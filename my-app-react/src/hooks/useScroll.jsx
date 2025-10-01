/**
 * Fichier : useScroll.jsx
 * Description : Hook personnalisé React pour détecter si l'utilisateur a dépassé un seuil de défilement
 * vertical dans la page. Retourne un booléen indiquant si la position de défilement dépasse le seuil.
 * Utile pour des fonctionnalités comme des barres de navigation collantes ou des animations déclenchées.
 */

/**
 * Importations
 */
// Importe useEffect pour ajouter et supprimer l'écouteur d'événement de défilement
import { useEffect, useState } from 'react';

// Importe useState pour gérer l'état scrolled
// useState permet de créer un état réactif dans les composants fonctionnels

/**
 * Hook : useScroll
 * Description : Surveille la position de défilement vertical et retourne un booléen si window.scrollY
 * dépasse le seuil donné.
 * Arguments :
 * - threshold : Nombre (par défaut 40), seuil en pixels pour déclencher l'état scrolled
 * Retour : Booléen (true si window.scrollY > threshold, false sinon)
 */
const useScroll = (threshold = 40) => {
  // Crée l'état scrolled pour indiquer si le seuil de défilement est dépassé, initialisé à false
  const [scrolled, setScrolled] = useState(false);

  /**
   * Effet : Surveillance du défilement
   * Description : Ajoute un écouteur pour l'événement scroll et met à jour l'état scrolled.
   * Nettoie l'écouteur lors du démontage du composant.
   * Dépendances : [threshold] (relance si le seuil change)
   */
  useEffect(() => {
    // Définit une fonction pour gérer l'événement scroll
    const handleScroll = () => setScrolled(window.scrollY > threshold);
    
    // Ajoute l'écouteur d'événement scroll à la fenêtre
    window.addEventListener('scroll', handleScroll);
    
    // Retourne une fonction de nettoyage pour supprimer l'écouteur lors du démontage
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]); // Dépendance : threshold, relance si le seuil change

  // Retourne l'état scrolled
  return scrolled;
};

/**
 * Exportation
 * Description : Exporte le hook useScroll pour une utilisation dans les composants React
 */
export default useScroll;