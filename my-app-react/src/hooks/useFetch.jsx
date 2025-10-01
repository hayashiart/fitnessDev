/**
 * Fichier : useFetch.jsx
 * Description : Hook personnalisé React pour effectuer des requêtes HTTP GET avec fetch.
 * Gère l'état des données et du chargement, utile pour récupérer des données API dans des composants.
 */

/**
 * Importations
 */
// Importe useState pour gérer les états data et loading
import { useState, useEffect } from 'react';

// Importe useEffect pour exécuter la requête au montage et à chaque changement d'URL
// useEffect permet de gérer les effets secondaires dans les composants fonctionnels

/**
 * Hook : useFetch
 * Description : Effectue une requête GET à l'URL fournie et retourne les données et l'état de chargement.
 * Arguments :
 * - url : String, l'URL de l'API à interroger
 * Retour : Objet contenant :
 * - data : Données récupérées (null initialement)
 * - loading : Booléen indiquant si la requête est en cours
 */
const useFetch = (url) => {
  // Crée l'état data pour stocker les données récupérées, initialisé à null
  const [data, setData] = useState(null);

  // Crée l'état loading pour indiquer si la requête est en cours, initialisé à true
  const [loading, setLoading] = useState(true);

  /**
   * Effet : Récupération des données
   * Description : Exécute une requête GET à l'URL et met à jour les états data et loading.
   * Dépendances : [url] (relance l'effet si l'URL change)
   */
  useEffect(() => {
    // Définit une fonction asynchrone pour effectuer la requête
    const fetchData = async () => {
      // Envoie une requête GET à l'URL fournie
      const response = await fetch(url);
      
      // Convertit la réponse en JSON
      const result = await response.json();
      
      // Met à jour l'état data avec les données reçues
      setData(result);
      
      // Met à jour l'état loading à false pour indiquer que la requête est terminée
      setLoading(false);
    };
    
    // Appelle la fonction de récupération
    fetchData();
  }, [url]); // Dépendance : url, relance l'effet si l'URL change

  // Retourne un objet contenant les états data et loading
  return { data, loading };
};

/**
 * Exportation
 * Description : Exporte le hook useFetch pour une utilisation dans les composants React
 */
export default useFetch;