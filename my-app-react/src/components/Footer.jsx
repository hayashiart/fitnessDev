/**
 * Fichier : Footer.jsx
 * Description : Composant React pour le pied de page de l'application. Inclut une newsletter,
 * une barre de navigation pour les réseaux sociaux (NavbarRS), et un texte de copyright.
 */

import NavbarRS from "./NavbarRS";
import Newsletter from "./Newsletter";
import styled from "styled-components";

const FooterContainer = styled.footer`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #000000;
`;

const CopyrightStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000000;
  color: #ffffff;
  width: 100%;
  height: 50px;

  p {
    margin: 0;
    font-size: 14px;
    text-align: center;
  }
`;

/**
 * Composant : Footer
 * Description : Affiche le pied de page avec une newsletter, des liens vers les réseaux sociaux,
 * et un texte de copyright.
 * Retour : JSX avec les sections du pied de page
 */
const Footer = () => {
  // Début du rendu JSX
  return (
    // Conteneur principal du pied de page
    <FooterContainer>
      {/* Section pour la newsletter */}
      <Newsletter />
      
      {/* Conteneur pour les icônes de réseaux sociaux */}
      <div style={{height:"50px",display: "flex",alignItems: "center" ,justifyContent:"center"}}>
        {/* Composant NavbarRS avec taille et couleurs personnalisées */}
        <NavbarRS size={34} backgroundcolor='#ffffff' textcolor='#000000' />
      </div>
      
      {/* Section pour le texte de copyright */}
      <CopyrightStyle>
        {/* Texte de copyright */}
        <p>Copyright © 2025 Tous droits réservés FitnessDev</p>
      </CopyrightStyle>
    </FooterContainer>
  );
};

// Exporte le composant Footer pour utilisation ailleurs
export default Footer;