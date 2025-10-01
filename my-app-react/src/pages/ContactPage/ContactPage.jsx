/**
 * Fichier : ContactPage.jsx
 * Description : Composant React pour une page de contact avec un formulaire permettant aux utilisateurs
 * d'envoyer un message. Inclut des champs pour nom, prénom, e-mail, type de demande, sujet, fichier joint,
 * et message. Affiche une confirmation temporaire après soumission (placeholder). Utilise ButtonInputAdd
 * pour la sélection de fichiers.
 */

import React, { useState, useRef } from "react"; // Importe React, useState pour l'état, useRef pour les références
import styled from 'styled-components'; // Importe styled-components pour créer des composants stylisés
import ButtonInputAdd from "../../components/ButtonInputAdd"; // Importe le composant pour sélectionner des fichiers

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15px;
  width: 100%;
  padding: 20px;
`;

const FormTitle = styled.h1`
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 1140px;
  width: 100%;
  gap: 20px;
  padding: 20px;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.5);
  padding: 8px;
  margin: 5px 0;
  height: 30px;
  font-size: 16px;
  width: 100%;
`;

const Textarea = styled.textarea`
  border: none;
  border: 1px solid rgba(0, 0, 0, 0.5);
  padding: 8px;
  margin: 5px 0;
  font-size: 16px;
  width: 100%;
  resize: none;
`;

const Select = styled.select`
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.5);
  padding: 0 8px;
  margin: 5px 0;
  font-size: 16px;
  height: 30px;
  line-height: 30px;
  width: 100%;
  color: rgba(0, 0, 0, 0.5);
`;

const SubmitButton = styled.button`
  background-color: #ffffff;
  color: #000000;
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #9a1b14;
    color: #ffffff;
  }
`;

const HorizontalGroup = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;

  & > div {
    width: 50%;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    & > div {
      width: 100%;
    }
  }
`;

/**
 * Composant : ContactPage
 * Description : Affiche une page de contact avec un formulaire pour envoyer un message. Gère les inputs,
 * affiche une confirmation temporaire après soumission, et réinitialise le formulaire.
 * Retour : JSX avec le formulaire de contact
 */
const ContactPage = () => {
  // Crée une référence pour stocker la liste des éléments input
  const inputs = useRef([]);
  
  // Crée une référence pour le formulaire afin de le réinitialiser
  const formRef = useRef();
  
  // État pour afficher un message de confirmation après soumission, initialisé à false
  const [messageEnvoye, setMessageEnvoye] = useState(false);

  /**
   * Fonction : addInputs
   * Description : Ajoute un élément input à la liste des références inputs si celui-ci n'est pas déjà inclus.
   * Arguments :
   * - el : Élément DOM (input ou textarea) à ajouter
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
   * Fonction : handleSubmit
   * Description : Gère la soumission du formulaire. Empêche le rechargement, affiche une confirmation,
   * réinitialise le formulaire, et masque la confirmation après 5 secondes.
   * Arguments :
   * - e : Événement de soumission du formulaire
   * Retour : Aucun
   */
  const handleSubmit = (e) => {
    // Empêche le rechargement par défaut du navigateur
    e.preventDefault();
    
    // Affiche le message de confirmation
    setMessageEnvoye(true);
    
    // Réinitialise le formulaire via la référence
    formRef.current.reset();
    
    // Masque le message de confirmation après 5 secondes
    setTimeout(() => setMessageEnvoye(false), 5000);
  };

  // Début du rendu JSX
  return (
    // Conteneur principal de la page avec un minimum de hauteur et un padding
    <>
      {/* Balise main pour la structure sémantique */}
      <main style={{ minHeight: "100vh", paddingTop: '124px' }}>
        {/* Conteneur du formulaire centré */}
        <FormContainer>
          {/* Titre de la page */}
          <FormTitle>CONTACTEZ-NOUS</FormTitle>
          
          {/* Affiche un message de confirmation si messageEnvoye est true */}
          {messageEnvoye && (
            <p style={{ color: "#9a1b14", fontWeight: "bold" }}>
              ✅ Votre message a bien été envoyé !
            </p>
          )}
          
          {/* Formulaire de contact */}
          <Form onSubmit={handleSubmit} ref={formRef}>
            {/* Groupe horizontal pour nom et prénom */}
            <HorizontalGroup>
              {/* Champ pour le nom */}
              <div>
                <Input
                  ref={addInputs}
                  type="text"
                  placeholder="Votre nom"
                  pattern="[a-z]{2,}$"
                  required
                  aria-label="Entrer votre nom"
                />
              </div>
              {/* Champ pour le prénom */}
              <div>
                <Input
                  ref={addInputs}
                  type="text"
                  placeholder="Votre prénom"
                  pattern="[a-z]{2,}$"
                  required
                  aria-label="Entrer votre prénom"
                />
              </div>
            </HorizontalGroup>

            {/* Groupe horizontal pour e-mail et type de demande */}
            <HorizontalGroup>
              {/* Champ pour l'e-mail */}
              <div>
                <Input
                  ref={addInputs}
                  type="email"
                  placeholder="Entrer votre email..."
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  required
                  aria-label="Entrer votre adresse email"
                />
              </div>
              {/* Menu déroulant pour le type de demande */}
              <div>
                <Select id="service" name="Request_type" required>
                  <option value="">--Sélectionner votre service--</option>
                  <option value="Paiement">Paiement</option>
                  <option value="Connexion">Connexion</option>
                </Select>
              </div>
            </HorizontalGroup>

            {/* Champ pour le sujet */}
            <div>
              <Input
                ref={addInputs}
                type="text"
                placeholder="Sujet de votre demande"
                aria-label="Entrer le sujet de votre demande"
                required
              />
            </div>
            
            {/* Composant pour ajouter un fichier joint */}
            <ButtonInputAdd />
            
            {/* Champ textarea pour le message */}
            <div>
              <Textarea
                ref={addInputs}
                placeholder="Écrivez votre message.."
                rows="5"
                aria-label="Entrer le message"
                required
              />
            </div>
            
            {/* Bouton de soumission */}
            <SubmitButton type="submit" className="send-button">Envoyer</SubmitButton>
          </Form>
        </FormContainer>
      </main>
    </>
  );
};

// Exporte le composant ContactPage pour utilisation dans les routes
export default ContactPage;