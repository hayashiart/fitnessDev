/**
 * Fichier : Newsletter.jsx
 * Description : Composant React pour un formulaire d'inscription à une newsletter. Permet aux utilisateurs
 * d'entrer leur adresse e-mail et de soumettre le formulaire. Actuellement, la soumission affiche un message
 * dans la console (logique placeholder). Utilisé dans le pied de page (Footer.jsx).
 */

import React, { useRef } from "react"; // Importe React et useRef pour gérer les références aux éléments DOM
import styled from "styled-components"; // Importe styled-components pour créer des composants stylisés avec CSS

const NewsletterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  background-color: #000000;
  color: #ffffff;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 500px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  gap: 10px;

  @media (max-width: 768px) {
    width: 80%;
    max-width: 100%;
  }
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 10px;
  width: 100%;
  height: 40px;

  @media (max-width: 768px) {
    font-size: 14px;
    height: 35px;
  }
`;

const Button = styled.button`
  width: 100%;
  height: 40px;
  background-color: #9a1b14;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #000000;
  }

  @media (max-width: 768px) {
    height: 45px;
  }
`;

const TextContent = styled.div`
  width: 100%;
  max-width: 500px;

  h2 {
    font-size: 24px;
    font-weight: bold;
  }

  p {
    font-size: 16px;
    margin-top: 10px;
  }

  @media (max-width: 768px) {
    text-align: center;
    padding: 0 15px;
  }
`;

/**
 * Composant : Newsletter
 * Description : Affiche un texte promotionnel et un formulaire pour s'inscrire à la newsletter.
 * Le formulaire capture l'adresse e-mail et affiche un message dans la console lors de la soumission.
 * Retour : JSX avec texte et formulaire
 */
const Newsletter = () => {
  // Crée une référence pour le formulaire afin d'y accéder programmatiquement
  const formRef = useRef();
  
  // Crée une référence pour stocker les éléments input du formulaire
  const inputs = useRef([]);

  /**
   * Fonction : addInputs
   * Description : Ajoute un élément input à la liste des références inputs si celui-ci n'est pas déjà inclus.
   * Arguments :
   * - el : Élément DOM (input) à ajouter
   * Retour : Aucun
   */
  const addInputs = (el) => {
    // Vérifie si l'élément existe et n'est pas déjà dans la liste
    if (el && !inputs.current.includes(el)) {
      // Ajoute l'élément à la liste des références
      inputs.current.push(el);
    }
  };

  /**
   * Fonction : handleFormSubmit
   * Description : Gère la soumission du formulaire. Empêche le rechargement de la page et affiche
   * un message dans la console (placeholder pour une future logique).
   * Arguments :
   * - e : Événement de soumission du formulaire
   * Retour : Aucun
   */
  const handleFormSubmit = (e) => {
    // Empêche le rechargement par défaut du navigateur
    e.preventDefault();
    
    // Journalise un message pour indiquer la soumission (placeholder)
    console.log("Formulaire soumis !");
  };

  // Début du rendu JSX
  return (
    // Fragment pour regrouper les éléments sans conteneur supplémentaire
    <>
      {/* Conteneur principal pour la newsletter avec texte et formulaire */}
      <NewsletterContainer>
        {/* Section pour le texte promotionnel */}
        <TextContent>
          {/* Titre accrocheur pour attirer l'attention */}
          <h2>PERTE DE POIDS, PRISE DE MASSE OU JUSTE REMISE EN FORME ?</h2>
          {/* Description des avantages de la newsletter */}
          <p>Atteins ton objectif grâce à notre accompagnement personnalisé : recettes, trainings et astuces !</p>
        </TextContent>

        {/* Formulaire pour l'inscription à la newsletter */}
        <Form ref={formRef} onSubmit={handleFormSubmit}>
          {/* Titre du formulaire */}
          <h1 style={{ color: "#000000" }}>Newsletter</h1>
          
          {/* Champ de saisie pour l'adresse e-mail */}
          <Input
            // Associe la référence pour suivi
            ref={addInputs}
            // Type email pour validation native
            type="email"
            // Placeholder pour guider l'utilisateur
            placeholder="Adresse e-mail"
            // Pattern regex pour valider le format de l'e-mail
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            // Champ requis
            required
            // Étiquette pour l'accessibilité
            aria-label="Entrez votre adresse email"
          />
          
          {/* Bouton pour soumettre le formulaire */}
          <Button type="submit">JE M'INSCRIS !</Button>
        </Form>
      </NewsletterContainer>
    </>
  );
};

// Exporte le composant Newsletter pour utilisation dans Footer.jsx
export default Newsletter;