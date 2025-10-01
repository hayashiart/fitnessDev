/**
 * Fichier : NavbarRS.jsx
 * Description : Composant React pour une barre de navigation avec des icônes de réseaux sociaux
 * (Facebook, YouTube, TikTok, Instagram). Utilise FontAwesome pour les icônes et styled-components
 * pour le style personnalisable.
 */

import React from 'react';
import styled from 'styled-components';
import '@fortawesome/fontawesome-free/css/all.min.css';

const NavbarRSstyle = styled.div`
  width: 100%;
  max-width: ${({ $size }) => ($size * 4) + (5 * 16)}px;
  height: ${({ $size }) => $size}px;

  ul {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    justify-content: space-evenly;
    flex-direction: row;
    flex-wrap: wrap;
  }

  li {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: ${({ $backgroundcolor }) => $backgroundcolor};
    color: ${({ $textcolor }) => $textcolor};
    height: ${({ $size }) => $size}px;
    width: ${({ $size }) => $size}px;
    overflow: visible;
  }

  a {    
    color: ${({ $textcolor }) => $textcolor};  
    line-height: 0;
    transition: color 0.3s ease, transform 0.3s ease;
  }

  a i { 
    color: ${({ $textcolor }) => $textcolor}; 
  }

  a:hover {
    color: #AE2119;
  }

  a:hover i {  
    color: #AE2119;
  }
`;

/**
 * Composant : NavbarRS
 * Description : Affiche une barre de navigation avec des icônes de réseaux sociaux sous forme de liens.
 * Props :
 * - size : Taille des icônes et conteneurs (en pixels)
 * - backgroundcolor : Couleur de fond des conteneurs d'icônes
 * - textcolor : Couleur des icônes
 * Retour : JSX avec une liste d'icônes de réseaux sociaux
 */
const NavbarRS = ({ size, backgroundcolor, textcolor }) => {
  // Début du rendu JSX
  return (
    // Conteneur stylisé pour la barre de navigation sociale
    <NavbarRSstyle 
      $size={size} 
      $backgroundcolor={backgroundcolor} 
      $textcolor={textcolor}
    >
      {/* Liste des liens vers les réseaux sociaux */}
      <ul>
        {/* Lien vers Facebook */}
        <li>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <i className="fab fa-facebook-f" aria-hidden="true"></i>
          </a>
        </li>
        {/* Lien vers YouTube */}
        <li>
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <i className="fab fa-youtube" aria-hidden="true"></i>
          </a>
        </li>
        {/* Lien vers TikTok */}
        <li>
          <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <i className="fab fa-tiktok" aria-hidden="true"></i>
          </a>
        </li>
        {/* Lien vers Instagram */}
        <li>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <i className="fab fa-instagram" aria-hidden="true"></i>
          </a>
        </li>
      </ul>
    </NavbarRSstyle>
  );
};

// Exporte le composant NavbarRS pour utilisation ailleurs
export default NavbarRS;