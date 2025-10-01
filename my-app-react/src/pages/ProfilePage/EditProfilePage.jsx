/**
 * Fichier : EditProfilePage.jsx
 * Description : Composant React pour la page de modification du profil utilisateur. Permet à l'utilisateur
 * de mettre à jour ses informations personnelles (civilité, nom, prénom, téléphone, e-mail, mot de passe,
 * adresse) via un formulaire. Utilise un reCAPTCHA pour sécuriser la soumission et récupère les données
 * initiales via une requête API. Redirige vers la page de profil après succès.
 */

import React, { useRef, useState, useContext, useEffect } from "react"; // Importe React et les hooks nécessaires
import { Link, useNavigate } from "react-router-dom"; // Importe Link pour les liens et useNavigate pour la navigation
import { AuthContext } from "../../contexts/AuthContext"; // Importe AuthContext pour accéder à l'utilisateur et à updateUser
import axios from "../../services/axios"; // Importe l'instance Axios configurée pour les requêtes API
import styled from "styled-components"; // Importe styled-components pour les styles
import ReCAPTCHA from 'react-google-recaptcha'; // Importe le composant ReCAPTCHA pour la vérification anti-bot

const Offset = styled.div`
  display: none;
  width: 100%;
  height: 84px;
  background-color: #000000;

  @media (max-width: 768px) {
    display: flex;
    height: 60px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-self: center;
  align-items: center;
  max-width: 940px;
  width: 80%;
  gap: 20px;
  padding: 20px;

  @media (max-width: 768px) {
    width: 90%;
    gap: 15px;
    padding: 10px;
  }
`;

const Select = styled.select`
  align-self: start;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 10px;
  width: 100px;
  height: 40px;
  line-height: 30px;
  color: rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    font-size: 14px;
    width: 80px;
    height: 35px;
  }
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 10px;
  width: 100%;
  height: 40px;

  @media (max-width: 768px) {
    font-size: 14px;
    height: 35px;
    padding: 8px;
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

  &:disabled {
    background-color: #999999;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 120px;
    height: 35px;
    font-size: 14px;
  }
`;

const CancelButton = styled(Button)`
  background-color: #666666;

  &:hover {
    background-color: #4d4d4d;
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
    transform: scale(0.85);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    gap: 10px;
    flex-direction: column;
    align-items: center;
  }
`;

/**
 * Composant : EditProfilePage
 * Description : Affiche un formulaire pré-rempli avec les informations actuelles de l'utilisateur,
 * permettant de modifier la civilité, le nom, le prénom, le téléphone, l'e-mail, le mot de passe
 * (facultatif), et l'adresse. Vérifie la correspondance des e-mails, utilise un reCAPTCHA, et envoie
 * une requête PUT pour mettre à jour le profil. Redirige vers la page de profil après succès.
 * Retour : JSX contenant le formulaire de modification ou un message de chargement
 */
const EditProfilePage = () => {
  // Récupère l'utilisateur connecté et la fonction updateUser depuis AuthContext
  // user contient les informations actuelles, updateUser met à jour l'état global
  const { user, updateUser } = useContext(AuthContext);

  // Crée une fonction navigate pour rediriger l'utilisateur (ex. : vers /profil)
  const navigate = useNavigate();

  // Crée une référence pour le formulaire afin de le manipuler (ex. : accès aux valeurs)
  const formRef = useRef();

  // Crée une référence pour stocker la liste des éléments input (nom, prénom, etc.)
  const inputs = useRef([]);

  // Crée un état recaptchaToken pour stocker le token généré par le reCAPTCHA
  // Initialisé à null, car aucun token n'est généré au départ
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  // Crée une référence pour le composant ReCAPTCHA afin de le manipuler (ex. : gérer les erreurs)
  const recaptchaRef = useRef();

  // Crée un état initialData pour stocker les données initiales du profil récupérées via l'API
  // Initialisé à null, car les données sont chargées après le montage
  const [initialData, setInitialData] = useState(null);

  // Crée un état recaptchaError pour afficher un message en cas d'erreur avec le reCAPTCHA
  // Initialisé à null, car aucune erreur n'est présente au départ
  const [recaptchaError, setRecaptchaError] = useState(null);

  // Crée un état civilite pour gérer la valeur du menu déroulant de civilité
  // Initialisé comme une chaîne vide, mis à jour après récupération des données
  const [civilite, setCivilite] = useState('');

  /**
   * Fonction : addInputs
   * Description : Ajoute un élément input à la liste des références inputs si celui-ci n'est pas déjà inclus.
   * Arguments :
   * - el : Élément DOM (input) à ajouter
   * Retour : Aucun
   */
  const addInputs = (el) => {
    // Vérifie si l'élément existe et n'est pas déjà dans la liste
    // el && !inputs.current.includes(el) évite les doublons
    if (el && !inputs.current.includes(el)) {
      // Ajoute l'élément à la liste des références
      inputs.current.push(el);
    }
  };

  /**
   * Fonction : handleRecaptchaChange
   * Description : Met à jour l'état recaptchaToken lorsqu'un token est généré par le reCAPTCHA
   * et réinitialise toute erreur associée.
   * Arguments :
   * - token : Token généré par le reCAPTCHA (ou null si réinitialisé)
   * Retour : Aucun
   */
  const handleRecaptchaChange = (token) => {
    // Met à jour l'état recaptchaToken avec le token reçu
    setRecaptchaToken(token);
    // Réinitialise l'état recaptchaError pour effacer tout message d'erreur
    setRecaptchaError(null);
  };

  /**
   * Fonction : handleRecaptchaError
   * Description : Définit un message d'erreur dans l'état recaptchaError si le reCAPTCHA échoue à charger.
   * Retour : Aucun
   */
  const handleRecaptchaError = () => {
    // Définit un message d'erreur pour informer l'utilisateur
    setRecaptchaError('Erreur de chargement du reCAPTCHA. Veuillez réessayer.');
  };

  /**
   * Effet : Récupération des données du profil
   * Description : Envoie une requête GET à /user/profil pour récupérer les informations actuelles
   * de l'utilisateur au montage du composant. Met à jour initialData et civilite avec les données reçues.
   * Dépendances : [] (exécuté une seule fois au montage)
   */
  useEffect(() => {
    // Définit une fonction asynchrone pour récupérer le profil
    const fetchProfile = async () => {
      try {
        // Envoie une requête GET à l'endpoint /user/profil
        // Axios inclut automatiquement le token JWT dans l'en-tête Authorization
        const response = await axios.get('/user/profil');

        // Met à jour l'état initialData avec les données utilisateur reçues
        // response.data.user contient des champs comme nom_inscrit, prenom_inscrit, etc.
        setInitialData(response.data.user);

        // Met à jour l'état civilite avec la valeur type_inscrit (ex. : "Homme" ou "Femme")
        // Utilise || '' pour éviter undefined si type_inscrit est absent
        setCivilite(response.data.user.type_inscrit || '');

        // Journalise les données pour débogage
        console.log('Données initiales:', response.data.user);
      } catch (error) {
        // Journalise l'erreur pour débogage
        // Peut inclure des erreurs réseau ou un token invalide
        console.error('Erreur lors de la récupération du profil:', error);
      }
    };

    // Exécute la fonction pour récupérer le profil
    fetchProfile();
  }, []); // Tableau vide pour exécution unique au montage

  /**
   * Fonction : handleCiviliteChange
   * Description : Met à jour l'état civilite lorsqu'une nouvelle valeur est sélectionnée dans le menu déroulant.
   * Arguments :
   * - e : Événement de changement de la sélection
   * Retour : Aucun
   */
  const handleCiviliteChange = (e) => {
    // Met à jour l'état civilite avec la valeur sélectionnée (e.target.value)
    // Exemple : "Homme" ou "Femme"
    setCivilite(e.target.value);
  };

  /**
   * Fonction : handleForm
   * Description : Gère la soumission du formulaire de modification. Vérifie le reCAPTCHA, valide la correspondance
   * des e-mails, envoie une requête PUT à /user/profil pour mettre à jour les informations, met à jour l'état
   * global via updateUser, et redirige vers la page de profil.
   * Arguments :
   * - e : Événement de soumission du formulaire
   * Retour : Aucun
   */
  const handleForm = async (e) => {
    // Empêche le rechargement par défaut du navigateur
    e.preventDefault();

    // Vérifie si un token reCAPTCHA a été généré
    if (!recaptchaToken) {
      // Affiche une alerte si le reCAPTCHA n'est pas validé
      alert('Veuillez valider le reCAPTCHA.');
      // Arrête l'exécution
      return;
    }

    // Crée un objet data contenant les valeurs des champs du formulaire
    // Les champs sont accédés via inputs.current[index].value
    const data = {
      civilite, // Valeur du menu déroulant (ex. : "Homme")
      name: inputs.current[0]?.value, // Nom de famille
      firstname: inputs.current[1]?.value, // Prénom
      phone: inputs.current[2]?.value, // Numéro de téléphone
      email: inputs.current[3]?.value, // Adresse e-mail
      emailConfirm: inputs.current[4]?.value, // Confirmation de l'e-mail
      password: inputs.current[5]?.value || undefined, // Mot de passe (facultatif)
      adress: inputs.current[6]?.value, // Adresse physique
    };

    // Journalise les données envoyées pour débogage
    console.log('Données envoyées à PUT /profil:', data);

    // Vérifie si les champs e-mail et confirmation correspondent
    if (data.email !== data.emailConfirm) {
      // Affiche une alerte si les e-mails ne correspondent pas
      return alert("Les adresses e-mail ne correspondent pas.");
    }

    try {
      // Envoie une requête PUT à /user/profil avec les données et le token reCAPTCHA
      // Axios inclut le token JWT dans l'en-tête Authorization
      const response = await axios.put('/user/profil', { ...data, recaptchaToken });

      // Met à jour l'état global de l'utilisateur avec les nouvelles données
      updateUser(response.data.user);

      // Redirige vers la page de profil avec un état refresh pour forcer une mise à jour
      navigate('/profil', { state: { refresh: true } });
    } catch (error) {
      // Journalise l'erreur pour débogage
      console.error('Erreur lors de la mise à jour du profil:', error);
      // Affiche une alerte en cas d'échec
      alert('Échec de la mise à jour du profil');
    }
  };

  // Vérifie si les données initiales du profil ont été chargées
  // Affiche un message de chargement si initialData est null
  if (!initialData) return <div>Chargement...</div>;

  // Début du rendu JSX
  return (
    // Fragment pour regrouper les éléments sans conteneur supplémentaire
    <>
      {/* Conteneur de compensation pour le menu burger en mobile */}
      <Offset />
      
      {/* Balise principale pour la structure sémantique */}
      <main style={{ minHeight: "100vh", paddingTop: '124px' }}>
        {/* Titre de la page */}
        <h1>Modifier mes informations</h1>
        
        {/* Formulaire de modification du profil */}
        <Form ref={formRef} onSubmit={handleForm}>
          {/* Menu déroulant pour la civilité, pré-rempli avec la valeur initiale */}
          <Select value={civilite} onChange={handleCiviliteChange} required>
            {/* Option par défaut */}
            <option value="">Civilité</option>
            {/* Option pour Homme */}
            <option value="Homme">Homme</option>
            {/* Option pour Femme */}
            <option value="Femme">Femme</option>
          </Select>
          
          {/* Champ pour le nom, pré-rempli */}
          <Input
            ref={addInputs}
            type="text"
            defaultValue={initialData.nom_inscrit}
            placeholder="Votre nom"
            pattern="[a-zA-Z]{2,}"
            required
            aria-label="Entrer votre nom"
          />
          
          {/* Champ pour le prénom, pré-rempli */}
          <Input
            ref={addInputs}
            type="text"
            defaultValue={initialData.prenom_inscrit}
            placeholder="Votre prénom"
            pattern="[a-zA-Z]{2,}"
            required
            aria-label="Entrer votre prénom"
          />
          
          {/* Champ pour le téléphone, pré-rempli */}
          <Input
            ref={addInputs}
            type="tel"
            defaultValue={initialData.telephone_inscrit || ''}
            placeholder="Votre numéro de téléphone"
            pattern="[0-9]{10}"
            required
            aria-label="Entrer votre numéro de téléphone"
          />
          
          {/* Champ pour l'e-mail, pré-rempli */}
          <Input
            ref={addInputs}
            type="email"
            defaultValue={initialData.email_inscrit}
            placeholder="Adresse e-mail"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}"
            required
            aria-label="Entrez votre adresse e-mail"
          />
          
          {/* Champ pour confirmer l'e-mail, pré-rempli */}
          <Input
            ref={addInputs}
            type="email"
            defaultValue={initialData.email_inscrit}
            placeholder="Confirmation adresse e-mail"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}"
            required
            aria-label="Confirmez votre adresse e-mail"
          />
          
          {/* Champ pour un nouveau mot de passe, facultatif */}
          <Input
            ref={addInputs}
            type="password"
            placeholder="Nouveau mot de passe (facultatif)"
            aria-label="Entrez un nouveau mot de passe"
          />
          
          {/* Champ pour l'adresse, pré-rempli */}
          <Input
            ref={addInputs}
            type="text"
            defaultValue={initialData.adresse_inscrit}
            placeholder="Adresse"
            required
            aria-label="Entrez votre adresse"
          />
          
          {/* Conteneur pour le reCAPTCHA */}
          <ReCAPTCHACenterWrapper>
            {/* Composant ReCAPTCHA */}
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={handleRecaptchaChange}
              onErrored={handleRecaptchaError}
              size="normal"
            />
            {/* Affiche un message d'erreur si recaptchaError est défini */}
            {recaptchaError && <p style={{ color: 'red' }}>{recaptchaError}</p>}
          </ReCAPTCHACenterWrapper>
          
          {/* Conteneur pour les boutons */}
          <ButtonContainer>
            {/* Bouton pour soumettre le formulaire, désactivé si pas de token */}
            <Button type="submit" disabled={!recaptchaToken}>ENREGISTRER</Button>
            {/* Bouton pour annuler et retourner au profil */}
            <CancelButton as={Link} to="/profil">ANNULER</CancelButton>
          </ButtonContainer>
        </Form>
      </main>
    </>
  );
};

// Exporte le composant EditProfilePage pour utilisation dans les routes
export default EditProfilePage;