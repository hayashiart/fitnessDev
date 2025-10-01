/**
 * Fichier : firebase.js
 * Description : Configure et initialise Firebase pour l'application. Fournit des services comme Firestore (base de
 * données NoSQL) et Analytics (suivi des événements). Exporte des fonctions et objets pour interagir avec Firestore.
 * Utilise des variables d'environnement pour sécuriser les clés de configuration.
 */

/**
 * Importations
 * - initializeApp : Fonction pour initialiser Firebase
 * - getAnalytics : Active le suivi analytique
 * - getFirestore, doc, setDoc, collection, getDocs : Outils pour manipuler Firestore
 */
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc, collection, getDocs } from 'firebase/firestore';

/**
 * Objet : firebaseConfig
 * Description : Contient les informations de configuration pour connecter l'application à Firebase.
 * Les valeurs sont récupérées depuis des variables d'environnement définies dans .env pour éviter
 * d'exposer les clés sensibles.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, // Clé API pour authentifier l'application
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, // Domaine pour l'authentification
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID, // Identifiant du projet Firebase
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, // Bucket pour Firebase Storage
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, // ID pour Cloud Messaging
  appId: import.meta.env.VITE_FIREBASE_APP_ID, // ID unique de l'application
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID, // ID pour Analytics
};

/**
 * Initialisation de Firebase
 * Syntaxe : initializeApp(config) crée une instance de l'application Firebase
 * app : Objet représentant l'application Firebase initialisée
 */
const app = initializeApp(firebaseConfig);

/**
 * Initialisation de Firestore
 * Syntaxe : getFirestore(app) crée une instance de Firestore liée à l'application Firebase
 * db : Instance de Firestore utilisée pour interagir avec la base de données
 */
const db = getFirestore(app);

/**
 * Initialisation de Firebase Analytics
 * Syntaxe : getAnalytics(app) active le suivi analytique pour l'application
 * analytics : Objet utilisé pour enregistrer des événements utilisateur (non exporté)
 */
const analytics = getAnalytics(app);

/**
 * Exportations
 * Description : Exporte les objets et fonctions pour interagir avec Firestore
 * - db : Instance de Firestore
 * - doc : Crée une référence à un document
 * - setDoc : Définit ou met à jour un document
 * - collection : Crée une référence à une collection
 * - getDocs : Récupère tous les documents d'une collection
 */
export { db, doc, setDoc, collection, getDocs };