/**
 * Fichier : LoginPage.jsx
 * Description : Composant React pour la page de connexion de l'application. Permet aux utilisateurs
 * d'entrer leur e-mail, mot de passe, et de valider un reCAPTCHA pour se connecter. Gère les erreurs
 * de connexion et redirige vers la page d'accueil ou une page spécifique (ex. : sélection de cours)
 * après une connexion réussie.
 */

import { useRef, useState, useContext } from 'react'; // Importe les hooks React : useRef pour les références, useState pour l'état, useContext pour accéder au contexte
import { Link, useNavigate, useLocation } from "react-router-dom"; // Importe Link pour les liens, useNavigate pour la redirection, useLocation pour accéder à l'état de la navigation
import { AuthContext } from "../../contexts/AuthContext"; // Importe AuthContext pour accéder à la fonction login
import styled from "styled-components"; // Importe styled-components pour les styles CSS
import ReCAPTCHA from 'react-google-recaptcha'; // Importe le composant ReCAPTCHA pour la vérification anti-bot

const Offset = styled.div`
  display: none;
  width: 100%;
  height: 84px;
  background-color: #000000;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  padding: 20px;
  overflow: visible;

  a {
    color: #000000;
  }

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80%;
  padding: 20px;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: auto;
  overflow: visible;
  position: relative;
  @media (max-width: 768px) {
    width: 90%;
    padding: 10px;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;

  @media (max-width: 768px) {
    gap: 15px;
  }
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 10px;
  width: 340px;
  height: 40px;

  @media (max-width: 768px) {
    width: 100%;
    padding: 10px;
    font-size: 14px;
  }
`;

const Button = styled.button`
  width: 150px;
  height: 40px;
  background-color: #9a1b14;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #000000;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 45px;
  }
`;

const ReCAPTCHACenterWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  width: 100%;
  box-sizing: border-box;
  overflow-x: visible;
  div {
    overflow-x: visible;
  }
  @media (max-width: 768px) {
    margin-top: 15px;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  margin-top: 10px;
`;

/**
 * Composant : LoginPage
 * Description : Affiche un formulaire de connexion avec des champs pour l'e-mail et le mot de passe,
 * un reCAPTCHA pour la sécurité, et un lien vers la page d'inscription. Gère la soumission du formulaire,
 * les erreurs de connexion, et redirige après succès.
 * Retour : JSX contenant le formulaire de connexion
 */
const LoginPage = () => {
  // Crée un état recaptchaToken pour stocker le token généré par le reCAPTCHA
  // Initialisé à null, car aucun token n'est généré au départ
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  // Crée un état error pour afficher un message d'erreur en cas de problème (ex. : identifiants incorrects)
  // Initialisé comme une chaîne vide
  const [error, setError] = useState('');

  // Récupère la fonction login depuis AuthContext pour gérer la connexion
  const { login } = useContext(AuthContext);

  // Crée une fonction navigate pour rediriger l'utilisateur après connexion
  const navigate = useNavigate();

  // Récupère l'objet location pour accéder à l'état de la navigation (ex. : redirectCourse)
  const location = useLocation();

  // Crée une référence pour le formulaire afin de le manipuler (ex. : réinitialiser)
  const formRef = useRef();

  // Crée une référence pour stocker les éléments input (e-mail et mot de passe)
  const inputs = useRef([]);

  // Crée une référence pour le composant ReCAPTCHA afin de le réinitialiser
  const recaptchaRef = useRef();

  /**
   * Fonction : handleRecaptchaChange
   * Description : Met à jour l'état recaptchaToken lorsqu'un token est généré par le reCAPTCHA.
   * Arguments :
   * - value : Token généré par le reCAPTCHA (ou null si le reCAPTCHA est réinitialisé)
   * Retour : Aucun
   */
  const handleRecaptchaChange = (value) => {
    // Met à jour l'état recaptchaToken avec la valeur reçue
    setRecaptchaToken(value);
    // Journalise le token pour débogage
    console.log("ReCAPTCHA value: ", value);
  };

  /**
   * Fonction : addInputs
   * Description : Ajoute un élément input à la liste des références inputs si celui-ci n'est pas déjà inclus.
   * Arguments :
   * - el : Élément DOM (input) à ajouter
   * Retour : Aucun
   */
  const addInputs = (el) => {
    // Vérifie si l'élément existe et n'est pas déjà dans la liste
    if (el && !inputs.current.includes(el)) {
      // Ajoute l'élément à la liste des références
      inputs.current.push(el);
    }
  };

  /**
   * Fonction : handleForm
   * Description : Gère la soumission du formulaire de connexion. Vérifie le reCAPTCHA, appelle la fonction
   * login, et redirige l'utilisateur après succès ou affiche une erreur en cas d'échec.
   * Arguments :
   * - e : Événement de soumission du formulaire
   * Retour : Aucun
   */
  const handleForm = async (e) => {
    // Empêche le rechargement par défaut du navigateur lors de la soumission
    e.preventDefault();

    // Vérifie si un token reCAPTCHA a été généré
    if (!recaptchaToken) {
      // Définit un message d'erreur si le reCAPTCHA n'est pas validé
      setError('Veuillez valider le reCAPTCHA.');
      // Arrête l'exécution
      return;
    }

    try {
      // Appelle la fonction login avec l'e-mail, le mot de passe, et le token reCAPTCHA
      // inputs.current[0] contient l'e-mail, inputs.current[1] contient le mot de passe
      await login(inputs.current[0].value, inputs.current[1].value, recaptchaToken);

      // Récupère le cours de redirection depuis l'état de la navigation, si présent
      // Exemple : redirectCourse = "Cours Collectifs" si l'utilisateur a été redirigé depuis CoursePage
      const redirectCourse = location.state?.redirectCourse;

      // Vérifie si un cours de redirection est spécifié
      if (redirectCourse) {
        // Redirige vers la page de sélection de créneau pour le cours spécifié
        navigate(`/course-selection/${encodeURIComponent(redirectCourse)}`);
      } else {
        // Redirige vers la page d'accueil par défaut
        navigate('/');
      }
    } catch (error) {
      // Définit un message d'erreur en cas d'échec de la connexion
      setError('Email ou mot de passe incorrect');
    }

    // Réinitialise l'état recaptchaToken pour forcer une nouvelle validation
    setRecaptchaToken(null);

    // Réinitialise le composant ReCAPTCHA pour effacer la coche
    recaptchaRef.current.reset();
  };

  // Début du rendu JSX
  return (
    // Fragment pour regrouper les éléments sans conteneur supplémentaire
    <>
      {/* Conteneur de compensation pour le menu burger en mobile */}
      <Offset />
      
      {/* Balise principale pour la structure sémantique */}
      <main style={{ minHeight: "100vh", paddingTop: '124px' }}>
        {/* Conteneur centré pour le formulaire */}
        <FormContainer>
          {/* Titre de la page */}
          <h1>Connexion</h1>
          
          {/* Formulaire de connexion */}
          <Form ref={formRef} onSubmit={handleForm}>
            {/* Conteneur pour les champs de saisie */}
            <InputContainer>
              {/* Champ pour l'adresse e-mail */}
              <div>
                <Input
                  // Associe une référence pour accéder à la valeur
                  ref={addInputs}
                  // ID pour l'accessibilité et les tests
                  id="login-email"
                  // Type email pour validation native
                  type="email"
                  // Placeholder pour guider l'utilisateur
                  placeholder="Adresse e-mail"
                  // Pattern regex pour valider le format de l'e-mail
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}" // MODIFICATION: Supprimé \ pour le point
                  // Champ requis
                  required
                  // Étiquette pour l'accessibilité
                  aria-label="Entrez votre adresse email"
                />
              </div>
              
              {/* Champ pour le mot de passe */}
              <div>
                <Input
                  // Associe une référence
                  ref={addInputs}
                  // ID pour l'accessibilité
                  id="login-password"
                  // Type password pour masquer les caractères
                  type="password"
                  // Placeholder
                  placeholder="Mot de passe"
                  // Champ requis
                  required
                  // Étiquette pour l'accessibilité
                  aria-label="Entrez votre mot de passe"
                />
              </div>
              
              {/* Conteneur pour le reCAPTCHA */}
              <ReCAPTCHACenterWrapper>
                {/* Composant ReCAPTCHA */}
                <ReCAPTCHA
                  // Associe une référence pour réinitialisation
                  ref={recaptchaRef}
                  // Clé du site reCAPTCHA depuis les variables d'environnement
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  // Appelle handleRecaptchaChange lors de la validation
                  onChange={handleRecaptchaChange}
                  // Taille normale pour l'affichage
                  size="normal"
                />
              </ReCAPTCHACenterWrapper>
              
              {/* Conteneur pour le bouton de connexion */}
              <div>
                {/* Bouton de soumission, désactivé si aucun token reCAPTCHA */}
                <Button type="submit" disabled={!recaptchaToken}>Se Connecter</Button>
              </div>
            </InputContainer>
            
            {/* Affiche un message d'erreur si défini */}
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </Form>
          
          {/* Lien vers la page d'inscription */}
          <p>
            Tu n'as pas encore de compte ? <Link to="/signup" className="signup-link">M'inscrire maintenant</Link>
          </p>
        </FormContainer>
      </main>
    </>
  );
};

// Exporte le composant LoginPage pour utilisation dans les routes
export default LoginPage;