/**
 * Fichier : ButtonInputAdd.jsx
 * Description : Composant React pour permettre la sélection de fichiers via un bouton stylisé.
 * Affiche le nom du fichier sélectionné ou un message par défaut. Utilise un input de type file caché
 * déclenché par le bouton.
 */

import React, { useRef, useState } from "react";
import styled from "styled-components";

const AddButton = styled.button`
    background-color: #ffffff;
    color: rgba(0, 0, 0, 0.5);
    padding: 10px;
    border: 1px solid rgba(0, 0, 0, 0.5);
    cursor: pointer;
    font-size: 16px;
`;

const HiddenFileInput = styled.input`
    display: none;
`;

const FileNameDisplay = styled.div`
    align-self: start;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.5);
`;

/**
 * Composant : ButtonInputAdd
 * Description : Bouton pour déclencher la sélection de fichiers, avec affichage du nom du fichier choisi.
 * Props :
 * - text : Texte du bouton (par défaut "Choisir un fichier")
 * - onClick : Fonction appelée lors de la sélection d'un fichier
 * - filetype : Types de fichiers acceptés (ex. : "image/*")
 * Retour : JSX avec bouton, input caché, et affichage du nom de fichier
 */
const ButtonInputAdd = ({ text, onClick, filetype }) => {
  // Crée une référence pour l'input de type file caché
  const fileInputRef = useRef();
  
  // État pour stocker le nom du fichier sélectionné, initialisé vide
  const [fileName, setFileName] = useState("");

  /**
   * Fonction : triggerFileInput
   * Description : Déclenche le clic sur l'input caché pour ouvrir la fenêtre de sélection de fichiers.
   * Arguments : Aucun
   * Retour : Aucun
   */
  const triggerFileInput = () => {
    // Simule un clic sur l'input caché
    fileInputRef.current.click();
  };

  /**
   * Fonction : handleFileChange
   * Description : Gère le changement de fichier dans l'input, met à jour le nom affiché, et appelle onClick.
   * Arguments :
   * - event : Événement de changement de l'input
   * Retour : Aucun
   */
  const handleFileChange = (event) => {
    // Récupère le premier fichier sélectionné
    const file = event.target.files[0];
    
    // Si un fichier est sélectionné
    if (file) {
      // Met à jour l'état fileName avec le nom du fichier
      setFileName(file.name);
    } else {
      // Réinitialise fileName si aucun fichier n'est sélectionné
      setFileName("");
    }
    
    // Si une fonction onClick est fournie, l'appelle avec l'événement
    if (onClick) {
      onClick(event);
    }
  };

  // Début du rendu JSX
  return (
    // Fragment pour regrouper les éléments sans conteneur supplémentaire
    <>
      {/* Bouton stylisé pour déclencher la sélection de fichier */}
      <AddButton onClick={triggerFileInput}>
        {/* Affiche le texte personnalisé ou "Choisir un fichier" par défaut */}
        {text || "Choisir un fichier"}
      </AddButton>
      
      {/* Input caché pour la sélection de fichiers */}
      <HiddenFileInput
        // Associe la référence pour manipulation programmatique
        ref={fileInputRef}
        // Type file pour sélectionner des fichiers
        type="file"
        // Types de fichiers acceptés (ex. : "image/*")
        accept={filetype}
        // Appelle handleFileChange lors de la sélection
        onChange={handleFileChange}
      />
      
      {/* Affiche un message si aucun fichier n'est sélectionné */}
      {!fileName && <FileNameDisplay>Aucun fichier sélectionné</FileNameDisplay>}
      
      {/* Affiche le nom du fichier sélectionné */}
      {fileName && <FileNameDisplay>{fileName}</FileNameDisplay>}
    </>
  );
};

// Exporte le composant ButtonInputAdd pour utilisation ailleurs
export default ButtonInputAdd;
