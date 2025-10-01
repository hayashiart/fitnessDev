/**
 * Fichier : useLocalStorage.jsx
 * Description : Hook personnalisé React pour gérer des données persistantes dans localStorage.
 * Fournit une interface similaire à useState, avec synchronisation automatique dans localStorage.
 * Utile pour sauvegarder des préférences utilisateur ou des données temporaires.
 */

/**
 * Importations
 */
// Importe useState pour gérer l'état storedValue
import { useState } from 'react';

/**
 * Hook : useLocalStorage
 * Description : Gère une valeur persistante dans localStorage et fournit une fonction pour la mettre à jour.
 * Arguments :
 * - key : String, clé dans localStorage pour identifier la valeur
 * - initialValue : Valeur initiale si aucune donnée n'existe dans localStorage
 * Retour : Tableau [storedValue, setValue] où storedValue est la valeur actuelle et setValue est la fonction de mise à jour
 */
const useLocalStorage = (key, initialValue) => {
  // Crée l'état storedValue, initialisé avec la valeur de localStorage ou initialValue
  // Utilise une fonction d'initialisation pour éviter de recalculer à chaque rendu
  const [storedValue, setStoredValue] = useState(() => {
    // Récupère la valeur associée à la clé dans localStorage
    const item = localStorage.getItem(key);
    
    // Si une valeur existe, la parse en JSON et la retourne ; sinon, retourne initialValue
    return item ? JSON.parse(item) : initialValue;
  });

  /**
   * Fonction : setValue
   * Description : Met à jour storedValue et persiste la nouvelle valeur dans localStorage.
   * Arguments :
   * - value : Nouvelle valeur à stocker (peut être un objet, un tableau, une primitive, etc.)
   * Retour : Aucun
   */
  const setValue = (value) => {
    // Met à jour l'état storedValue avec la nouvelle valeur
    setStoredValue(value);
    
    // Sérialise la valeur en JSON et la stocke dans localStorage sous la clé fournie
    localStorage.setItem(key, JSON.stringify(value));
  };

  // Retourne un tableau contenant la valeur actuelle et la fonction de mise à jour
  return [storedValue, setValue];
};

/**
 * Exportation
 * Description : Exporte le hook useLocalStorage pour une utilisation dans les composants React
 */
export default useLocalStorage;