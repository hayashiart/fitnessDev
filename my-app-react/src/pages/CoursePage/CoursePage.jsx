/**
 * Fichier : CoursePage.jsx
 * Description : Composant React pour une page de sélection de cours. Affiche une image principale,
 * des détails sur le cours sélectionné, une grille de cours disponibles, et une grille des cours passés
 * de l'utilisateur. Permet de s'inscrire à un cours et gère les erreurs d'authentification.
 */

import { Link, useNavigate } from 'react-router-dom'; // Importe Link pour les liens de navigation et useNavigate pour la navigation programmatique
import React, { useState, useEffect, useRef } from 'react'; // Importe React et les hooks pour gérer l'état, les effets, et les références
import {
  Container,
  LeftBlock,
  HeaderSection,
  Title,
  Subtitle,
  EnrollButton,
  CoursesSection,
  CoursesTitle,
  CourseGrid,
  CourseBlock,
  CourseImage,
  CourseName,
  LargeImageContainer,
  LargeImage,
  GradientOverlay,
  ChevronButton,
  ChevronImage,
  CourseDate,
  ErrorMessage,
  NoCoursesMessage,
} from './CoursePageStyles'; // Importe les composants stylisés depuis CoursePageStyles.jsx
import poleDance from '../../assets/images/pole-dance.jpg'; // Importe l'image pour le cours Pole Dance
import coursCollectifs from '../../assets/images/cours-collectifs.jpg'; // Importe l'image pour les Cours Collectifs
import espaceCrosstraining from '../../assets/images/espace-crosstraining.jpg'; // Importe l'image pour le Crosstraining
import espaceBoxe from '../../assets/images/espace-boxe.jpg'; // Importe l'image pour la Boxe
import espaceHalterophilie from '../../assets/images/espace-halterophilie.jpg'; // Importe l'image pour l'Haltérophilie
import espaceMma from '../../assets/images/espace-mma.jpg'; // Importe l'image pour le MMA

/**
 * Composant : CoursePage
 * Description : Affiche une page pour explorer et s'inscrire à des cours. Inclut une image principale,
 * des détails sur le cours sélectionné, une grille de tous les cours disponibles, et une grille des
 * cours passés de l'utilisateur. Gère les erreurs d'authentification et le défilement des grilles.
 * Retour : JSX avec les sections de la page
 */
function CoursePage() {
  // État pour stocker l'image principale affichée, initialisé avec l'image des Cours Collectifs
  const [selectedImage, setSelectedImage] = useState(coursCollectifs);
  
  // État pour stocker le nom du cours actuellement sélectionné, initialisé à "Cours Collectifs"
  const [selectedCourse, setSelectedCourse] = useState('Cours Collectifs');
  
  // État pour stocker la liste des cours passés de l'utilisateur, initialisé vide
  const [previousCourses, setPreviousCourses] = useState([]);
  
  // État pour contrôler l'affichage des chevrons de navigation pour la grille principale, initialisé à false
  const [showMainChevrons, setShowMainChevrons] = useState(false);
  
  // État pour contrôler l'affichage des chevrons de navigation pour la grille d'historique, initialisé à false
  const [showHistoryChevrons, setShowHistoryChevrons] = useState(false);
  
  // État pour stocker un message d'erreur en cas de problème (ex. : authentification), initialisé vide
  const [error, setError] = useState('');
  
  // Référence pour la grille principale des cours afin de gérer le défilement
  const gridRef = useRef(null);
  
  // Référence pour la grille des cours passés afin de gérer le défilement
  const historyGridRef = useRef(null);
  
  // Hook pour naviguer programmatiquement
  const navigate = useNavigate();

  // Objet définissant les détails de chaque cours (titre, sous-titre, image)
  const courseDetails = {
    'Cours Collectifs': {
      title: 'Cours Collectifs',
      subtitle: 'Rejoignez nos sessions variées tous les lundis de 18:00 à 20:00 pour un entraînement dynamique adapté à tous les niveaux.',
      image: coursCollectifs,
    },
    'Pole Dance': {
      title: 'Pole Dance',
      subtitle: 'Découvrez la pole dance chaque mardi de 18:00 à 20:00, un mélange unique de force et de grâce avec nos coachs experts.',
      image: poleDance,
    },
    'Crosstraining': {
      title: 'Crosstraining',
      subtitle: 'Boostez votre condition physique avec notre crosstraining intensif tous les mercredis de 18:00 à 20:00.',
      image: espaceCrosstraining,
    },
    'Boxe': {
      title: 'Boxe',
      subtitle: 'Plongez dans l’univers de la boxe chaque jeudi de 18:00 à 20:00 pour développer puissance et technique.',
      image: espaceBoxe,
    },
    'Haltérophilie': {
      title: 'Haltérophilie',
      subtitle: 'Maîtrisez les mouvements d’haltérophilie chaque vendredi de 18:00 à 20:00 avec des coachs spécialisés.',
      image: espaceHalterophilie,
    },
    'MMA': {
      title: 'MMA',
      subtitle: 'Entraînez-vous comme un combattant avec nos cours de MMA chaque samedi de 18:00 à 20:00.',
      image: espaceMma,
    },
  };

  /**
   * Effet : Récupération des cours passés
   * Description : Effectue une requête GET à /user/previous-courses pour récupérer les cours passés
   * de l'utilisateur connecté. Filtre les cours pour n'afficher que ceux antérieurs à la date actuelle.
   * Gère les erreurs d'authentification et les échecs HTTP.
   * Dépendances : [navigate] (relance si navigate change)
   */
  useEffect(() => {
    // Définit une fonction asynchrone pour récupérer les cours
    const fetchPreviousCourses = async () => {
      try {
        // Récupère le token JWT depuis localStorage
        const token = localStorage.getItem('token');
        
        // Vérifie si un token existe
        if (!token) {
          // Définit un message d'erreur si non connecté
          setError('Veuillez vous connecter');
          // Arrête la fonction
          return;
        }
        
        // Envoie une requête GET à l'endpoint /user/previous-courses avec le token
        const response = await fetch('https://localhost:3001/user/previous-courses', {
          // Ajoute l'en-tête Authorization avec le token Bearer
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Vérifie si la réponse indique un accès refusé (403)
        if (response.status === 403) {
          // Journalise l'erreur pour débogage
          console.error('Accès refusé : Token invalide ou expiré');
          // Supprime le token invalide
          localStorage.removeItem('token');
          // Redirige vers la page de connexion
          navigate('/login');
          // Arrête la fonction
          return;
        }
        
        // Vérifie si la réponse n'est pas OK (ex. : 404, 500)
        if (!response.ok) {
          // Lance une erreur avec le statut HTTP
          throw new Error(`Erreur HTTP ${response.status}`);
        }
        
        // Convertit la réponse en JSON
        const data = await response.json();
        
        // Journalise les cours reçus pour débogage
        console.log('Inscriptions reçues (CoursePage):', data.courses);

        // Filtre les cours pour ne garder que ceux passés (avant la date actuelle)
        const pastCourses = data.courses.filter((course) => {
          // Convertit la date du cours en objet Date
          const courseDate = new Date(course.datetime_cours);
          // Compare avec la date actuelle
          return courseDate < new Date();
        });
        
        // Journalise les cours passés filtrés
        console.log('Cours passés filtrés:', pastCourses);

        // Met à jour l'état previousCourses avec les cours passés
        setPreviousCourses(pastCourses);
      } catch (error) {
        // Journalise l'erreur pour débogage
        console.error('Erreur lors de la récupération des cours précédents:', error);
        // Définit un message d'erreur pour l'utilisateur
        setError('Impossible de charger l’historique des cours.');
      }
    };
    
    // Exécute la fonction de récupération
    fetchPreviousCourses();
  }, [navigate]); // Dépendance : navigate, relance si navigate change

  /**
   * Effet : Gestion des chevrons de navigation
   * Description : Vérifie si les grilles (principale et historique) nécessitent des chevrons de navigation
   * en comparant leur largeur de défilement à leur largeur visible. Ajoute un écouteur pour les redimensionnements.
   * Dépendances : [previousCourses] (relance si la liste des cours passés change)
   */
  useEffect(() => {
    // Définit une fonction pour vérifier les largeurs des grilles
    const checkScroll = () => {
      // Vérifie la grille principale
      if (gridRef.current) {
        // Récupère la largeur totale de défilement de la grille
        const scrollWidth = gridRef.current.scrollWidth;
        // Récupère la largeur visible de la grille
        const clientWidth = gridRef.current.clientWidth;
        // Journalise pour débogage
        console.log('Main Grid - scrollWidth:', scrollWidth, 'clientWidth:', clientWidth);
        // Affiche les chevrons si la largeur de défilement dépasse la largeur visible
        setShowMainChevrons(scrollWidth > clientWidth);
      }
      
      // Vérifie la grille d'historique
      if (historyGridRef.current) {
        // Récupère la largeur totale de défilement
        const scrollWidth = historyGridRef.current.scrollWidth;
        // Récupère la largeur visible
        const clientWidth = historyGridRef.current.clientWidth;
        // Journalise pour débogage
        console.log('History Grid - scrollWidth:', scrollWidth, 'clientWidth:', clientWidth);
        // Affiche les chevrons si nécessaire
        setShowHistoryChevrons(scrollWidth > clientWidth);
      }
    };

    // Exécute la vérification initiale
    checkScroll();
    
    // Exécute à nouveau après 100ms pour gérer les rendus asynchrones
    setTimeout(checkScroll, 100);
    
    // Ajoute un écouteur pour les redimensionnements de la fenêtre
    window.addEventListener('resize', checkScroll);
    
    // Nettoie l'écouteur lors du démontage
    return () => window.removeEventListener('resize', checkScroll);
  }, [previousCourses]); // Dépendance : previousCourses, relance si la liste change

  /**
   * Fonction : handleImageClick
   * Description : Met à jour l'image principale et le cours sélectionné lorsqu'un cours est cliqué.
   * Arguments :
   * - courseName : Nom du cours cliqué
   * Retour : Aucun
   */
  const handleImageClick = (courseName) => {
    // Met à jour l'image principale avec l'image du cours ou une image par défaut
    setSelectedImage(courseDetails[courseName]?.image || coursCollectifs);
    // Met à jour le cours sélectionné
    setSelectedCourse(courseName);
  };

  /**
   * Fonction : handleEnrollClick
   * Description : Redirige vers la page de sélection de créneau pour le cours sélectionné,
   * ou vers la page de connexion si l'utilisateur n'est pas connecté.
   * Retour : Aucun
   */
  const handleEnrollClick = () => {
    // Récupère le token JWT
    const token = localStorage.getItem('token');
    
    // Vérifie si l'utilisateur est connecté
    if (!token) {
      // Redirige vers la page de connexion avec le cours sélectionné en état
      navigate('/login', { state: { redirectCourse: selectedCourse } });
    } else {
      // Redirige vers la page de sélection de créneau pour le cours
      navigate(`/course-selection/${encodeURIComponent(selectedCourse)}`);
    }
  };

  /**
   * Fonction : scrollLeft
   * Description : Fait défiler une grille vers la gauche de 340 pixels avec un effet fluide.
   * Arguments :
   * - ref : Référence à la grille (gridRef ou historyGridRef)
   * Retour : Aucun
   */
  const scrollLeft = (ref) => {
    // Vérifie si la référence existe
    if (ref.current) {
      // Fait défiler la grille vers la gauche
      ref.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  /**
   * Fonction : scrollRight
   * Description : Fait défiler une grille vers la droite de 340 pixels avec un effet fluide.
   * Arguments :
   * - ref : Référence à la grille
   * Retour : Aucun
   */
  const scrollRight = (ref) => {
    // Vérifie si la référence existe
    if (ref.current) {
      // Fait défiler la grille vers la droite
      ref.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  // Début du rendu JSX
  return (
    // Conteneur principal de la page
    <Container>
      {/* Conteneur pour l'image principale */}
      <LargeImageContainer>
        {/* Image principale affichée */}
        <LargeImage src={selectedImage} alt={selectedCourse} />
        {/* Superposition de dégradé pour améliorer la lisibilité */}
        <GradientOverlay />
      </LargeImageContainer>
      
      {/* Bloc gauche avec les détails du cours sélectionné */}
      <LeftBlock>
        {/* Section pour le titre, sous-titre et bouton */}
        <HeaderSection>
          {/* Titre du cours sélectionné */}
          <Title>{courseDetails[selectedCourse]?.title || 'Cours'}</Title>
          {/* Sous-titre du cours */}
          <Subtitle>{courseDetails[selectedCourse]?.subtitle || ''}</Subtitle>
          {/* Bouton pour s'inscrire au cours */}
          <EnrollButton onClick={handleEnrollClick}>S'inscrire</EnrollButton>
        </HeaderSection>
      </LeftBlock>
      
      {/* Section pour les cours disponibles */}
      <CoursesSection>
        {/* Titre de la section */}
        <CoursesTitle>NOS COURS</CoursesTitle>
        {/* Chevron gauche pour défiler la grille principale */}
        <ChevronButton $visible={showMainChevrons} onClick={() => scrollLeft(gridRef)} direction="left">
          <ChevronImage src="/src/assets/icons/flecheGauche.png" alt="Flèche gauche" />
        </ChevronButton>
        {/* Grille des cours disponibles */}
        <CourseGrid ref={gridRef}>
          {/* Mappe chaque cours disponible */}
          {Object.keys(courseDetails).map((courseName) => (
            // Bloc de cours avec sélection visuelle
            <CourseBlock
              key={courseName}
              $isSelected={selectedCourse === courseName}
              onClick={() => handleImageClick(courseName)}
            >
              {/* Image du cours */}
              <CourseImage src={courseDetails[courseName].image} alt={courseName} />
              {/* Nom du cours */}
              <CourseName>{courseName}</CourseName>
            </CourseBlock>
          ))}
        </CourseGrid>
        {/* Chevron droit pour défiler la grille principale */}
        <ChevronButton $visible={showMainChevrons} onClick={() => scrollRight(gridRef)} direction="right">
          <ChevronImage src="/src/assets/icons/flecheDroite.png" alt="Flèche droite" />
        </ChevronButton>
      </CoursesSection>
      
      {/* Section pour les cours passés */}
      <CoursesSection>
        {/* Titre de la section */}
        <CoursesTitle>VOS COURS PRÉCÉDENTS</CoursesTitle>
        {/* Vérifie s'il y a une erreur */}
        {error ? (
          // Affiche un message d'erreur
          <ErrorMessage>{error}</ErrorMessage>
        ) : previousCourses.length === 0 ? (
          // Affiche un message si aucun cours passé
          <NoCoursesMessage>Aucun cours passé trouvé.</NoCoursesMessage>
        ) : (
          // Affiche la grille des cours passés
          <>
            {/* Chevron gauche pour défiler la grille d'historique */}
            <ChevronButton $visible={showHistoryChevrons} onClick={() => scrollLeft(historyGridRef)} direction="left">
              <ChevronImage src="/src/assets/icons/flecheGauche.png" alt="Flèche gauche" />
            </ChevronButton>
            {/* Grille des cours passés */}
            <CourseGrid ref={historyGridRef}>
              {/* Mappe chaque cours passé */}
              {previousCourses.map((course, index) => (
                // Bloc de cours avec clé unique
                <CourseBlock
                  key={`${course.id_cours}_${index}`}
                  $isSelected={selectedCourse === course.nom_cours}
                  onClick={() => handleImageClick(course.nom_cours)}
                >
                  {/* Image du cours ou image par défaut */}
                  <CourseImage
                    src={courseDetails[course.nom_cours]?.image || coursCollectifs}
                    alt={course.nom_cours}
                  />
                  {/* Nom du cours */}
                  <CourseName>{course.nom_cours}</CourseName>
                  {/* Date et heure du cours */}
                  <CourseDate>
                    {new Date(course.datetime_cours).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}
                  </CourseDate>
                </CourseBlock>
              ))}
            </CourseGrid>
            {/* Chevron droit pour défiler la grille d'historique */}
            <ChevronButton $visible={showHistoryChevrons} onClick={() => scrollRight(historyGridRef)} direction="right">
              <ChevronImage src="/src/assets/icons/flecheDroite.png" alt="Flèche droite" />
            </ChevronButton>
          </>
        )}
      </CoursesSection>
    </Container>
  );
}

// Exporte le composant CoursePage pour utilisation dans les routes
export default CoursePage;
