
/**
 * Fichier : Avis.jsx
 * Description : Composant React pour afficher et ajouter des avis d'utilisateurs. Utilise Firestore pour stocker
 * et récupérer les avis, et un modal pour permettre aux utilisateurs connectés d'ajouter un avis. Les avis sont
 * affichés dans un carrousel horizontal avec des cartes stylisées.
 */

import React, { useContext, useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { AuthContext } from '../contexts/AuthContext.jsx';
import { db, doc, setDoc, collection, getDocs } from '../firebase.js';
import Modal from 'react-modal';

const ReviewContainer = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 10px 0;
  scroll-snap-type: x mandatory;
  gap: 16px;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Button = styled.button`
  width: 50%;
  max-width: 200px;
  height: 45px;
  background-color: #9a1b14;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #7a1a11;
  }

  @media (max-width: 768px) {
    height: 50px;
  }
`;

const Textarea = styled.textarea`
  border: 1px solid rgba(0, 0, 0, 0.5);
  padding: 10px;
  margin: 8px 0;
  font-size: 16px;
  width: 100%;
  resize: none;
  border-radius: 8px;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #9a1b14;
    box-shadow: 0 0 10px rgba(154, 27, 20, 0.5);
  }
`;

const ReviewCard = styled.div`
  min-width: 300px;
  margin-right: 16px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.15);
  color: #333;
  overflow-y: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 6px 6px 20px rgba(0, 0, 0, 0.2);
    transform: translateY(-5px);
  }

  strong {
    font-size: 18px;
    color: #9a1b14;
  }

  p {
    font-size: 16px;
    margin-top: 5px;
  }
`;

const ModalTitle = styled.h2`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #9a1b14;
`;

/**
 * Composant : Avis
 * Description : Affiche une liste d'avis sous forme de carrousel et permet aux utilisateurs connectés
 * d'ajouter un avis via un modal. Utilise Firestore pour la persistance des avis.
 * Retour : JSX contenant le carrousel d'avis et un modal pour l'ajout
 */
const Avis = () => {
  // Récupère l'utilisateur connecté et la fonction fetchprofil depuis AuthContext
  const { user, fetchprofil } = useContext(AuthContext);
  
  // État pour stocker la liste des avis récupérés depuis Firestore
  const [reviews, setReviews] = useState([]);
  
  // État pour contrôler l'ouverture/fermeture du modal d'ajout d'avis
  const [modalIsOpen, setModalIsOpen] = useState(false);
  
  // Référence pour accéder à la valeur du champ textarea dans le modal
  const reviewData = useRef();

  /**
   * Fonction : addReview
   * Description : Ajoute un nouvel avis à Firestore pour l'utilisateur connecté.
   * Arguments :
   * - e : Événement de soumission du formulaire
   * Retour : Aucun
   */
  const addReview = async (e) => {
    // Empêche le rechargement de la page lors de la soumission du formulaire
    e.preventDefault();

    // Vérifie si un utilisateur est connecté
    if (!user) {
      // Journalise une erreur si l'utilisateur n'est pas authentifié
      console.error("Utilisateur non authentifié");
      // Arrête la fonction
      return;
    }

    // Crée une référence à un document Firestore pour l'avis, identifié par l'email de l'utilisateur
    const reviewRef = doc(db, 'reviews', user.email);
    
    try {
      // Récupère les données du profil utilisateur via fetchprofil
      const userData = await fetchprofil();
      
      // Extrait la première lettre du nom en majuscule pour l'affichage (ex. : "Jean D.")
      const firstLetter = userData.nom_inscrit.charAt(0).toUpperCase();
      
      // Enregistre l'avis dans Firestore avec le nom formaté et le texte de l'avis
      await setDoc(reviewRef, {
        userName: `${userData.prenom_inscrit} ${firstLetter}.`,
        review: `"${reviewData.current.value}"`
      });
      
      // Réinitialise le champ textarea après soumission
      reviewData.current.value = '';
      
      // Ferme le modal
      setModalIsOpen(false);
      
      // Journalise le succès de l'opération
      console.log("Avis ajouté avec succès");
    } catch (error) {
      // Journalise toute erreur survenue lors de l'ajout
      console.error("Erreur lors de l'ajout de l'avis :", error);
    }
  };

  /**
   * Fonction : fetchAllReviews
   * Description : Récupère tous les avis depuis la collection Firestore "reviews".
   * Retour : Tableau d'objets représentant les avis
   */
  const fetchAllReviews = async () => {
    try {
      // Récupère tous les documents de la collection "reviews" dans Firestore
      const querySnapshot = await getDocs(collection(db, "reviews"));
      
      // Transforme les documents en un tableau d'objets avec ID et données
      const reviews = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Journalise les avis récupérés pour débogage
      console.log("Avis récupérés :", reviews);
      
      // Retourne la liste des avis
      return reviews;
    } catch (error) {
      // Journalise toute erreur survenue lors de la récupération
      console.error("Erreur lors de la récupération des avis :", error);
    }
  };

  /**
   * Effet : Chargement initial des avis
   * Description : Récupère les avis depuis Firestore au montage du composant et met à jour l'état reviews.
   * Dépendances : [] (exécuté une seule fois)
   */
  useEffect(() => {
    // Définit une fonction asynchrone pour récupérer les avis
    const getReviews = async () => {
      // Appelle fetchAllReviews pour obtenir les avis
      const fetchedReviews = await fetchAllReviews();
      
      // Met à jour l'état reviews avec les avis récupérés
      setReviews(fetchedReviews);
    };
    
    // Exécute la fonction de récupération
    getReviews();
  }, []); // Tableau vide pour exécution unique

  // Début du rendu JSX
  return (
    // Conteneur principal avec texte noir
    <div style={{ color: "#000000" }}>
      {/* Titre principal des avis */}
      <h1>Les avis de nos abonnés</h1>
      
      {/* Carrousel des avis */}
      <ReviewContainer>
        {/* Vérifie si des avis existent */}
        {reviews.length > 0 ? (
          // Si oui, mappe chaque avis dans une carte
          reviews.map((review) => (
            // Carte d'avis avec clé unique basée sur l'ID
            <ReviewCard key={review.id}>
              {/* Nom de l'utilisateur en gras */}
              <strong>{review.userName}</strong>
              {/* Texte de l'avis */}
              <p>{review.review}</p>
            </ReviewCard>
          ))
        ) : (
          // Si aucun avis, affiche un message
          <p>Aucun avis disponible.</p>
        )}
      </ReviewContainer>
      
      {/* Affiche le bouton et le modal uniquement si l'utilisateur est connecté */}
      {user && (
        <>
          {/* Bouton pour ouvrir le modal d'ajout d'avis */}
          <Button onClick={() => setModalIsOpen(true)}>Donner ton avis</Button>
          
          {/* Modal pour ajouter un avis */}
          <Modal
            // Contrôle l'ouverture du modal
            isOpen={modalIsOpen}
            // Ferme le modal lors d'un clic à l'extérieur
            onRequestClose={() => setModalIsOpen(false)}
            // Étiquette pour l'accessibilité
            contentLabel="Formulaire d'avis"
            // Styles personnalisés pour le modal
            style={{
              content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                transform: 'translate(-50%, -50%)',
                width: '400px',
                padding: '20px',
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: "10px",
                backgroundColor: "#fff",
                boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)"
              },
            }}
          >
            {/* Titre du modal */}
            <ModalTitle>Donne ton avis :</ModalTitle>
            
            {/* Formulaire pour soumettre un avis */}
            <form onSubmit={addReview} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              {/* Champ textarea pour l'avis */}
              <Textarea
                rows="4"
                ref={reviewData}
                placeholder="Écrivez votre avis ici"
                required
              />
              {/* Bouton de soumission */}
              <Button type="submit">Envoyer</Button>
            </form>
          </Modal>
        </>
      )}
    </div>
  );
};

// Exporte le composant Avis pour utilisation dans d'autres parties de l'application
export default Avis;