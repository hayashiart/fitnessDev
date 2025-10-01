/**
 * Fichier : axios.js
 * Description : Configure une instance Axios personnalisée pour les requêtes HTTP vers le backend
 * (http://localhost:3000). Gère les tokens JWT via des intercepteurs et journalise les erreurs (notamment 403).
 */

/**
 * Importation
 * - axios : Bibliothèque pour les requêtes HTTP
 */
import axios from 'axios';

/**
 * Création d'une instance Axios
 * Syntaxe : axios.create(config) crée une instance avec des configurations par défaut
 * - baseURL : URL de base pour toutes les requêtes
 * - headers : Type de contenu JSON par défaut
 */
const instance = axios.create({
  baseURL: 'https://localhost:3001',  // Le backend en HTTPS
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;