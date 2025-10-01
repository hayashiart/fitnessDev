/**
 * Fichier : ScrollToTop.jsx
 * Description : Composant React utilitaire qui fait défiler la page vers le haut à chaque changement de route.
 * Utilise le hook useLocation pour détecter les changements d'URL et useEffect pour effectuer le défilement.
 * Ne rend aucun JSX visible (retourne null).
 */

import { useEffect } from 'react'; // Importe useEffect pour exécuter du code après chaque rendu
import { useLocation } from 'react-router-dom'; // Importe useLocation pour accéder à l'URL actuelle

/**
 * Composant : ScrollToTop
 * Description : Fait défiler la fenêtre vers le haut (position 0) à chaque changement de route.
 * Utilisé pour améliorer l'expérience utilisateur en réinitialisant la position de défilement.
 * Retour : null (aucun rendu visible)
 */
const ScrollToTop = () => {
  // Récupère l'objet de localisation, dont pathname représente l'URL actuelle
  const { pathname } = useLocation();

  /**
   * Effet : Défilement vers le haut
   * Description : Exécute window.scrollTo pour ramener la fenêtre en haut à chaque changement de pathname.
   * Dépendances : [pathname] (relance l'effet si l'URL change)
   */
  useEffect(() => {
    // Fait défiler la fenêtre vers la position y=0 avec un comportement instantané
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]); // Dépendance : pathname, relance l'effet à chaque changement d'URL

  // Retourne null car le composant n'a pas de rendu visible
  return null;
};

// Exporte le composant ScrollToTop pour utilisation dans l'application
export default ScrollToTop;