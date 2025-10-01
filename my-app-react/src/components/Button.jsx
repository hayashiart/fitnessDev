/**
 * Fichier : Button.jsx
 * Description : Composant React pour un bouton stylisé réutilisable avec texte, dimensions personnalisables,
 * et gestion d'événements. Utilise styled-components pour le style.
 */

import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: #9a1b14;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  width: ${({ width }) => width || 'auto'};
  height: ${({ height }) => height || 'auto'};

  &:hover {
    background-color: #000000;
  }
`;

/**
 * Composant : Button
 * Description : Bouton stylisé avec texte et gestion d'événements personnalisable.
 * Props :
 * - text : Texte affiché dans le bouton
 * - width : Largeur personnalisée (optionnel)
 * - height : Hauteur personnalisée (optionnel)
 * - onClick : Fonction appelée lors du clic
 * Retour : JSX avec un bouton stylisé
 */
const Button = ({ text, width, height, onClick }) => {
  // Début du rendu JSX
  return (
    // Bouton stylisé avec props pour texte, dimensions, et gestionnaire d'événement
    <StyledButton onClick={onClick} width={width} height={height}>
      {/* Affiche le texte du bouton */}
      {text}
    </StyledButton>
  );
};

// Exporte le composant Button pour utilisation ailleurs
export default Button;