/**
 * Fichier : AuthContext.jsx
 * Description : Fournit un contexte React pour gérer l'authentification dans l'application. Contient des fonctions
 * pour l'inscription (signup), la connexion (login), la déconnexion (logout), la récupération du profil (fetchprofil),
 * et la mise à jour de l'utilisateur (updateUser). Utilise Axios pour les requêtes API et jwt-decode pour extraire
 * les informations des tokens JWT. Gère l'état de l'utilisateur et du token, avec persistance dans localStorage.
 */

// Importe createContext pour créer un contexte React permettant de partager des données globalement
import { createContext, useState, useEffect } from 'react';

// Importe l'instance Axios configurée pour effectuer des requêtes HTTP vers le backend
import axios from "../services/axios.js";

// Importe jwtDecode pour décoder les tokens JWT et extraire les informations utilisateur
import { jwtDecode } from "jwt-decode";

// Crée le contexte AuthContext pour partager l'état et les fonctions d'authentification
export const AuthContext = createContext();

/**
 * Composant : AuthProvider
 * Description : Fournisseur de contexte qui enveloppe l'application pour fournir l'état utilisateur,
 * le token, et les fonctions d'authentification. Les composants enfants accèdent à ces valeurs via useContext.
 * Props :
 * - props.children : Composants enfants ayant accès au contexte
 * Retour : JSX avec AuthContext.Provider enveloppant les enfants
 */
export const AuthProvider = (props) => {
  // Crée l'état user pour stocker les informations utilisateur décodées du token JWT, initialisé à null
  const [user, setUser] = useState(null);

  // Crée l'état token pour stocker le token JWT, initialisé à null
  const [token, setToken] = useState(null);

  /**
   * Effet : Vérification initiale du token
   * Description : S'exécute une fois au montage du composant pour vérifier si un token existe dans localStorage.
   * Si présent, récupère le profil utilisateur et met à jour les états user et token.
   * Dépendances : [] (exécuté une seule fois au montage)
   */
  useEffect(() => {
    // Récupère le token JWT depuis localStorage
    const localToken = localStorage.getItem('token');
    
    // Vérifie si un token existe
    if (localToken) {
      // Définit une fonction asynchrone pour tester le token
      const testToken = async () => {
        try {
          // Appelle fetchprofil pour récupérer le profil utilisateur via l'API
          const profil = await fetchprofil();
          
          // Décode le token pour extraire les informations utilisateur (ex. : id, email)
          const decodedUser = jwtDecode(localToken);
          
          // Met à jour l'état user avec les informations décodées
          setUser(decodedUser);
          
          // Met à jour l'état token avec le token récupéré
          setToken(localToken);
          
          // Journalise le profil pour débogage
          console.log('Profil:', profil);
        } catch (error) {
          // Journalise l'erreur sans déconnexion automatique (MODIFICATION)
          console.error('Erreur lors du test du token:', error.message);
        }
      };
      
      // Exécute la fonction de test
      testToken();
    }
  }, []); // Tableau vide pour exécution unique au montage

  /**
   * Fonction : signup
   * Description : Inscrit un nouvel utilisateur en envoyant une requête POST à /auth/signup.
   * Stocke le token reçu dans localStorage et met à jour les états user et token.
   * Arguments :
   * - data : Objet contenant email, password, name, firstname, adress, phone, civilite, birthday
   * - recaptchaToken : Token reCAPTCHA pour vérification anti-bot
   * Retour : Aucun (lance une erreur si échec)
   */
  const signup = async (data, recaptchaToken) => {
    // Journalise les données envoyées pour débogage
    console.log(data);
    
    try {
      // Envoie une requête POST à /auth/signup avec les données utilisateur
      const response = await axios.post('/auth/signup', {
        // Champ email_inscrit : Adresse e-mail de l'utilisateur
        email_inscrit: data.email,
        // Champ mdp_inscrit : Mot de passe
        mdp_inscrit: data.password,
        // Champ nom_inscrit : Nom de famille
        nom_inscrit: data.name,
        // Champ prenom_inscrit : Prénom
        prenom_inscrit: data.firstname,
        // Champ adresse_inscrit : Adresse physique
        adresse_inscrit: data.adress,
        telephone_inscrit: data.phone,        
        type_inscrit: "client",
        date_naissance :data.birthday,
        civilite_inscrit: data.civilite,
        recaptchaToken
      });
      
      // Extrait le token JWT de la réponse
      const { token } = response.data;
      
      // Décode le token pour obtenir les informations utilisateur
      const decodedUser = jwtDecode(token);
      
      // Met à jour l'état user avec les informations décodées
      setUser(decodedUser);
      
      // Stocke le token dans localStorage pour persistance
      localStorage.setItem('token', token);
    } catch (error) {
      // Journalise l'erreur avec les détails de la réponse API
      console.error('Signup error:', error.response?.data?.message || error.message);
      
      // Propage l'erreur pour gestion dans le composant appelant
      throw error;
    }
  };

  /**
   * Fonction : login
   * Description : Connecte un utilisateur via une requête POST à /auth/login.
   * Stocke le token reçu et met à jour les états user et token.
   * Arguments :
   * - email : Adresse e-mail
   * - password : Mot de passe
   * - recaptchaToken : Token reCAPTCHA
   * Retour : Données de la réponse (ex. : token)
   */
  const login = async (email, password, recaptchaToken) => {
    try {
      // Envoie une requête POST à /auth/login avec les identifiants
      const response = await axios.post('/auth/login', {
        // Champ email_inscrit : Adresse e-mail
        email_inscrit: email,
        // Champ mdp_inscrit : Mot de passe
        mdp_inscrit: password,
        // Token reCAPTCHA
        recaptchaToken
      });
      
      // Extrait le token JWT de la réponse
      const { token } = response.data;
      
      // Stocke le token dans localStorage
      localStorage.setItem('token', token);
      
      // Décode le token pour obtenir les informations utilisateur
      const decodedUser = jwtDecode(token);
      
      // Met à jour l'état user
      setUser(decodedUser);
      
      // Retourne les données de la réponse pour utilisation dans le composant appelant
      return response.data;
    } catch (error) {
      // Journalise l'erreur avec les détails
      console.error('Login error:', error.response?.data?.message || error.message);
      
      // Propage l'erreur
      throw error;
    }
  };

  /**
   * Fonction : logout
   * Description : Déconnecte l'utilisateur en réinitialisant les états et en supprimant le token.
   * Arguments : Aucun
   * Retour : Aucun
   */
  const logout = () => {
    // Réinitialise l'état user à null
    setUser(null);
    
    // Réinitialise l'état token à null
    setToken(null);
    
    // Supprime le token de localStorage
    localStorage.removeItem('token');
  };

  /**
   * Fonction : fetchprofil
   * Description : Récupère le profil utilisateur via GET /user/profil et met à jour l'état user.
   * Arguments : Aucun
   * Retour : Données du profil utilisateur
   */
  const fetchprofil = async () => {
    try {
      // Envoie une requête GET à /user/profil
      const response = await axios.get('/user/profil');
      
      // Met à jour l'état user avec les données reçues
      setUser(response.data.user);
      
      // Retourne les données du profil
      return response.data.user;
    } catch (error) {
      // Journalise l'erreur
      console.error('Erreur fetchprofil:', error.response?.data?.message || error.message);
      
      // Propage l'erreur
      throw error;
    }
  };

  /**
   * Fonction : updateUser
   * Description : Met à jour l'état user avec de nouvelles informations (ex. : après modification du profil).
   * Arguments :
   * - updatedUser : Objet avec les nouvelles informations utilisateur
   * Retour : Aucun
   */
  const updateUser = (updatedUser) => {
    // Met à jour l'état user
    setUser(updatedUser);
  };

  /**
   * JSX : AuthContext.Provider
   * Description : Fournit les valeurs du contexte aux composants enfants
   */
  return (
    // Fournit le contexte avec les valeurs user, token et les fonctions d'authentification
    <AuthContext.Provider value={{ user, token, signup, login, logout, fetchprofil, updateUser }}>
      {/* Rend les composants enfants (ex. : App) qui accèdent au contexte */}
      {props.children}
    </AuthContext.Provider>
  );
};