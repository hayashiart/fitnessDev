/**
 * Fichier : CoursesInscritsPage.jsx
 * Description : Composant React pour afficher la liste des cours à venir auxquels l'utilisateur est inscrit.
 * Récupère les cours via une requête API, affiche chaque cours avec son image, sa date, et son nom, et permet
 * d'annuler une inscription via un popup de confirmation. Inclut un bouton pour retourner au profil.
 */

import React, { useState, useEffect } from 'react'; // Importe React, useState pour l'état, useEffect pour les effets
import { useNavigate } from 'react-router-dom'; // Importe useNavigate pour la navigation
import axios from '../../services/axios'; // Importe l'instance Axios pour les requêtes API
import styled from 'styled-components'; // Importe styled-components pour les styles
import poleDance from '../../assets/images/pole-dance.jpg'; // Importe l'image pour le cours Pole Dance
import coursCollectifs from '../../assets/images/cours-collectifs.jpg'; // Importe l'image pour les Cours Collectifs
import espaceCrosstraining from '../../assets/images/espace-crosstraining.jpg'; // Importe l'image pour le Crosstraining
import espaceBoxe from '../../assets/images/espace-boxe.jpg'; // Importe l'image pour la Boxe
import espaceHalterophilie from '../../assets/images/espace-halterophilie.jpg'; // Importe l'image pour l'Haltérophilie
import espaceMma from '../../assets/images/espace-mma.jpg'; // Importe l'image pour le MMA

// Définit un objet courseDetails qui associe chaque nom de cours à son image correspondante
// Utilisé pour afficher l'image appropriée pour chaque cours
const courseDetails = {
  'Cours Collectifs': { image: coursCollectifs }, // Associe "Cours Collectifs" à son image
  'Pole Dance': { image: poleDance },
  'Crosstraining': { image: espaceCrosstraining },
  'Boxe': { image: espaceBoxe },
  'Haltérophilie': { image: espaceHalterophilie },
  'MMA': { image: espaceMma },
};

const PageContainer = styled.div`
  background-color: #ffffff;
  min-height: 100vh;
  padding-top: 124px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding-top: 80px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 15px;
  }
`;

const ReturnButton = styled.button`
  width: 150px;
  height: 40px;
  background-color: #9a1b14;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;

  &:hover {
    background-color: #000000;
  }

  @media (max-width: 768px) {
    width: 120px;
    height: 35px;
    font-size: 14px;
    margin-bottom: 15px;
  }
`;

const CoursesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 1200px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
    padding: 0 10px;
  }
`;

const CourseBlock = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const CourseImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;

  @media (max-width: 768px) {
    height: 150px;
  }
`;

const CourseInfo = styled.div`
  padding: 10px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 8px;
  }
`;

const CourseDateTime = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: #000000;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const CourseName = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: #000000;
  margin: 5px 0 0;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const NoCoursesMessage = styled.p`
  font-size: 16px;
  color: #000000;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Popup = styled.div`
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
  width: 90%;

  @media (max-width: 768px) {
    max-width: 80%;
    padding: 15px;
  }
`;

const PopupTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 8px;
  }
`;

const PopupText = styled.p`
  font-size: 16px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 15px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const RedButton = styled.button`
  width: 100px;
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

  &:disabled {
    background-color: #999999;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 90px;
    height: 35px;
    font-size: 14px;
  }
`;

const GrayButton = styled.button`
  width: 100px;
  height: 40px;
  background-color: #666666;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #4d4d4d;
  }

  @media (max-width: 768px) {
    width: 90px;
    height: 35px;
    font-size: 14px;
  }
`;

/**
 * Composant : CoursesInscritsPage
 * Description : Affiche une grille des cours à venir auxquels l'utilisateur est inscrit, avec leur image,
 * date, et nom. Permet d'annuler une inscription via un popup de confirmation. Inclut un bouton pour
 * retourner à la page de profil. Récupère les cours via une requête GET à /user/previous-courses.
 * Retour : JSX contenant la liste des cours ou un message si aucun cours n'est trouvé
 */
const CoursesInscritsPage = () => {
  // Crée une fonction navigate pour rediriger l'utilisateur (ex. : vers /profil)
  const navigate = useNavigate();

  // Crée un état courses pour stocker la liste des cours à venir récupérés via l'API
  // Initialisé comme un tableau vide
  const [courses, setCourses] = useState([]);

  // Crée un état showPopup pour contrôler l'affichage du popup d'annulation
  // Initialisé à false
  const [showPopup, setShowPopup] = useState(false);

  // Crée un état selectedCourse pour stocker le cours sélectionné pour annulation
  // Initialisé à null
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Crée un état isCanceling pour désactiver le bouton d'annulation pendant le traitement
  // Initialisé à false
  const [isCanceling, setIsCanceling] = useState(false);

  /**
   * Effet : Récupération des cours à venir
   * Description : Envoie une requête GET à /user/previous-courses pour récupérer tous les cours inscrits,
   * puis filtre pour ne garder que les cours futurs (date > maintenant). Met à jour l'état courses.
   * Dépendances : [] (exécuté une seule fois au montage)
   */
  useEffect(() => {
    // Définit une fonction asynchrone pour récupérer les cours
    const fetchCourses = async () => {
      try {
        // Envoie une requête GET à /user/previous-courses
        const response = await axios.get('/user/previous-courses');
        console.log(response.data.courses)
        // Crée une instance de la date actuelle pour comparaison
        const now = new Date();
        
        // Filtre les cours pour ne garder que ceux dont la date est future
        // response.data.courses est un tableau d'objets (ex. : { id_cours, nom_cours, datetime_cours })
        // Syntaxe : array.filter(callback(element)) retourne un nouveau tableau avec les éléments pour lesquels callback retourne true
        const upcomingCourses = response.data.courses.filter(
          (course) => new Date(course.datetime_cours) > now // Compare la date du cours avec maintenant
        );
        
        // Met à jour l'état courses avec les cours futurs
        setCourses(upcomingCourses);
      } catch (error) {
        // Journalise l'erreur pour débogage
        console.error('Erreur lors de la récupération des cours inscrits:', error);
      }
    };
    
    // Exécute la fonction pour récupérer les cours
    fetchCourses();
  }, []); // Tableau vide pour exécution unique

  /**
   * Fonction : handleCourseClick
   * Description : Sélectionne un cours et ouvre le popup pour confirmer son annulation.
   * Arguments :
   * - course : Objet représentant le cours sélectionné (ex. : { id_cours, nom_cours, datetime_cours })
   * Retour : Aucun
   */
  const handleCourseClick = (course) => {
    // Met à jour l'état selectedCourse avec le cours cliqué
    setSelectedCourse(course);
    // Ouvre le popup d'annulation
    setShowPopup(true);
  };

  /**
   * Fonction : handleCancelInscription
   * Description : Annule l'inscription à un cours en envoyant une requête DELETE à /user/course/:id_cours,
   * puis rafraîchit la liste des cours à venir. Gère les erreurs, y compris le cas où le cours n'existe plus.
   * Retour : Aucun
   */
  const handleCancelInscription = async () => {
    // Vérifie si un cours est sélectionné et si une annulation n'est pas déjà en cours
    if (!selectedCourse || isCanceling) return;

    // Active l'état isCanceling pour désactiver le bouton pendant le traitement
    setIsCanceling(true);
    
    try {
      // Envoie une requête DELETE à /user/course/:id_cours pour annuler l'inscription
      await axios.delete(`/user/course/${selectedCourse.id_cours}`);
      
      // Récupère la liste mise à jour des cours
      const response = await axios.get('/user/previous-courses');
      
      // Crée une instance de la date actuelle
      const now = new Date();
      
      // Filtre les cours futurs
      const upcomingCourses = response.data.courses.filter(
        (course) => new Date(course.datetime_cours) > now
      );
      
      // Met à jour l'état courses
      setCourses(upcomingCourses);
      
      // Ferme le popup
      setShowPopup(false);
      
      // Réinitialise le cours sélectionné
      setSelectedCourse(null);
    } catch (error) {
      // Vérifie si l'erreur est un 404 (cours non trouvé)
      if (error.response && error.response.status === 404) {
        // Récupère la liste mise à jour pour gérer le cas où le cours a été supprimé
        const response = await axios.get('/user/previous-courses');
        const now = new Date();
        const upcomingCourses = response.data.courses.filter(
          (course) => new Date(course.datetime_cours) > now
        );
        setCourses(upcomingCourses);
      } else {
        // Journalise l'erreur pour débogage
        console.error('Erreur lors de l\'annulation de l\'inscription:', error);
        // Affiche une alerte pour l'utilisateur
        alert('Échec de l\'annulation de l\'inscription');
      }
    } finally {
      // Désactive l'état isCanceling
      setIsCanceling(false);
      // Ferme le popup et réinitialise le cours
      setShowPopup(false);
      setSelectedCourse(null);
    }
  };

  /**
   * Fonction : closePopup
   * Description : Ferme le popup d'annulation et réinitialise le cours sélectionné.
   * Retour : Aucun
   */
  const closePopup = () => {
    // Ferme le popup
    setShowPopup(false);
    // Réinitialise le cours sélectionné
    setSelectedCourse(null);
  };

  // Début du rendu JSX
  return (
    // Conteneur principal de la page, centré
    <PageContainer>
      {/* Bouton pour retourner à la page de profil */}
      <ReturnButton onClick={() => navigate('/profil')}>Retour</ReturnButton>
      
      {/* Titre de la page */}
      <Title>Mes Cours Inscrits</Title>
      
      {/* Vérifie si des cours sont disponibles */}
      {courses.length === 0 ? (
        // Affiche un message si aucun cours à venir
        <NoCoursesMessage>Aucun cours à venir.</NoCoursesMessage>
      ) : (
        // Affiche une grille des cours
        <CoursesGrid>
          {/* Mappe chaque cours pour afficher un bloc */}
          {courses.map((course, index) => (
            // Bloc pour un cours, cliquable pour ouvrir le popup
            <CourseBlock
              key={`${course.id_cours}_${index}`} // Clé unique combinant id_cours et index
              onClick={() => handleCourseClick(course)}
            >
              {/* Image du cours, avec fallback si non trouvée */}
              <CourseImage
                src={courseDetails[course.nom_cours]?.image || coursCollectifs}
                alt={course.nom_cours}
              />
              {/* Informations du cours */}
              <CourseInfo>
                {/* Date et heure du cours, formatées */}
                <CourseDateTime>
                  {new Date(course.datetime_cours).toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </CourseDateTime>
                {/* Nom du cours */}
                <CourseName>{course.nom_cours}</CourseName>
              </CourseInfo>
            </CourseBlock>
          ))}
        </CoursesGrid>
      )}
      
      {/* Popup pour confirmer l'annulation */}
      {showPopup && (
        // Superposition et popup
        <Overlay>
          {/* Conteneur du popup */}
          <Popup>
            {/* Titre du popup */}
            <PopupTitle>ANNULER INSCRIPTION</PopupTitle>
            {/* Message de confirmation avec détails du cours */}
            <PopupText>
              Voulez-vous annuler votre inscription au cours "{selectedCourse?.nom_cours}" du{' '}
              {new Date(selectedCourse?.datetime_cours).toLocaleDateString('fr-FR')} ?
            </PopupText>
            {/* Conteneur pour les boutons */}
            <ButtonContainer>
              {/* Bouton pour annuler l'inscription */}
              <RedButton onClick={handleCancelInscription} disabled={isCanceling}>
                ANNULER
              </RedButton>
              {/* Bouton pour fermer le popup */}
              <GrayButton onClick={closePopup}>FERMER</GrayButton>
            </ButtonContainer>
          </Popup>
        </Overlay>
      )}
    </PageContainer>
  );
};

// Exporte le composant CoursesInscritsPage pour utilisation dans les routes
export default CoursesInscritsPage;