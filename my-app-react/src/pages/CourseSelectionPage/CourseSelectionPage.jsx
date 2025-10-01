/**
 * Fichier : CourseSelectionPage.jsx
 * Description : Composant React pour permettre à un utilisateur de choisir un créneau horaire pour un cours spécifique (ex. : "Cours Collectifs").
 * Affiche une liste de créneaux disponibles sur les 3 prochaines semaines, avec des boutons pour réserver un créneau.
 * Vérifie les inscriptions existantes pour désactiver les créneaux déjà réservés, affiche des popups pour confirmer ou indiquer le succès de la réservation,
 * et redirige vers la page de connexion si l'utilisateur n'est pas authentifié. Les styles sont importés depuis CourseSelectionPageStyles.jsx.
 */

import { useState, useEffect } from 'react'; // Importe les hooks React : useState pour gérer l'état, useEffect pour exécuter du code après le rendu ou à chaque changement de dépendances
import { useParams, Link, useNavigate } from 'react-router-dom'; // Importe des hooks de react-router-dom : useParams pour récupérer les paramètres d'URL, Link pour les liens de navigation, useNavigate pour rediriger programmatiquement
import * as S from './CourseSelectionPageStyles'; // Importe tous les composants stylisés (ex. : S.Container, S.Title) depuis CourseSelectionPageStyles.jsx sous l'alias S

/**
 * Composant : CourseSelectionPage
 * Description : Affiche une page avec une liste de créneaux horaires pour un cours donné (ex. : "Cours Collectifs"), permet de réserver un créneau,
 * et gère les inscriptions existantes via des requêtes API. Inclut des popups pour confirmer une réservation ou afficher un message de succès.
 * Retour : JSX contenant un titre, une liste de créneaux, un lien de retour, et des popups pour l'interaction utilisateur
 */
const CourseSelectionPage = () => {
  // Récupère le paramètre courseName de l'URL (ex. : "Cours%20Collectifs" pour "Cours Collectifs") en utilisant useParams
  // useParams retourne un objet avec les paramètres définis dans la route (ex. : /course-selection/:courseName)
  const { courseName } = useParams();

  // Crée une fonction navigate pour rediriger l'utilisateur vers d'autres pages (ex. : /login)
  // useNavigate retourne une fonction qui accepte un chemin ou un objet pour gérer la navigation
  const navigate = useNavigate();

  // Crée un état confirmation pour stocker un message de confirmation après une réservation réussie (ex. : "Réservation confirmée...")
  // Initialisé comme une chaîne vide, car aucun message n'est affiché au départ
  const [confirmation, setConfirmation] = useState('');

  // Crée un état showConfirmPopup pour contrôler l'affichage d'un popup demandant confirmation avant de réserver un créneau
  // Initialisé à false, car le popup est fermé par défaut
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  // Crée un état showSuccessPopup pour contrôler l'affichage d'un popup indiquant une réservation réussie
  // Initialisé à false, car le popup est fermé par défaut
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Crée un état selectedSlot pour stocker le créneau horaire sélectionné par l'utilisateur avant confirmation
  // Initialisé à null, car aucun créneau n'est sélectionné au départ
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Crée un état inscribedCourses pour stocker la liste des IDs des cours auxquels l'utilisateur est déjà inscrit
  // Initialisé comme un tableau vide, car aucune inscription n'est connue au départ
  const [inscribedCourses, setInscribedCourses] = useState([]);

  // Crée un état slotCourseIds pour mapper chaque créneau (ex. : "01/05/2025_18:00") à l'ID du cours correspondant
  // Initialisé comme un objet vide, car aucun mappage n'existe au départ
  const [slotCourseIds, setSlotCourseIds] = useState({});

  // Crée un état loading pour indiquer si les données (inscriptions) sont en cours de chargement
  // Initialisé à true, car le chargement commence dès le montage du composant
  const [loading, setLoading] = useState(true);

  // Crée un état renderKey pour forcer le re-rendu de la liste des créneaux lorsqu'une inscription est ajoutée
  // Initialisé à 0, incrémenté à chaque changement pour garantir un affichage à jour
  const [renderKey, setRenderKey] = useState(0);

  // Crée un état error pour stocker un message d'erreur en cas de problème (ex. : échec de la requête API)
  // Initialisé comme une chaîne vide, car aucune erreur n'est présente au départ
  const [error, setError] = useState('');

  // Définit un objet courseDetails contenant les informations de chaque cours : jour de la semaine (1 = lundi, 2 = mardi, etc.), heure, et nom du coach
  // Chaque clé est le nom du cours (ex. : "Cours Collectifs"), et la valeur est un objet avec day, time, coach
  const courseDetails = {
    'Cours Collectifs': { day: 1, time: '18:00', coach: 'Anna' }, // Cours Collectifs : lundi à 18h avec Anna
    'Pole Dance': { day: 2, time: '18:00', coach: 'Marc' }, // Pole Dance : mardi à 18h avec Marc
    'Crosstraining': { day: 3, time: '18:00', coach: 'Léa' }, // Crosstraining : mercredi à 18h avec Léa
    'Boxe': { day: 4, time: '18:00', coach: 'Paul' }, // Boxe : jeudi à 18h avec Paul
    'Haltérophilie': { day: 5, time: '18:00', coach: 'Sophie' }, // Haltérophilie : vendredi à 18h avec Sophie
    'MMA': { day: 6, time: '18:00', coach: 'Lucas' }, // MMA : samedi à 18h avec Lucas
  };

  /**
   * Fonction : getNextThreeWeeks
   * Description : Génère une liste de créneaux horaires pour un cours donné sur les 3 prochaines semaines.
   * Calcule les dates en fonction du jour de la semaine défini dans courseDetails (ex. : lundi pour Cours Collectifs).
   * Chaque créneau inclut un ID, une date formatée (JJ/MM/AAAA), une heure, et le nom du coach.
   * Arguments :
   * - course : Nom du cours (ex. : "Cours Collectifs")
   * Retour : Tableau d'objets représentant les créneaux (ex. : { id: 1, date: "01/05/2025", time: "18:00", coach: "Anna" })
   */
  const getNextThreeWeeks = (course) => {
    // Crée un tableau vide pour stocker les créneaux horaires
    const slots = [];

    // Crée un objet Date représentant la date et l'heure actuelles
    const today = new Date();

    // Récupère le jour de la semaine du cours depuis courseDetails (ex. : 1 pour lundi)
    // L'opérateur ?. évite une erreur si courseDetails[course] est undefined
    const courseDay = courseDetails[course]?.day;

    // Récupère l'heure du cours (ex. : "18:00")
    const courseTime = courseDetails[course]?.time;

    // Récupère le nom du coach (ex. : "Anna")
    const courseCoach = courseDetails[course]?.coach;

    // Vérifie si les informations nécessaires (jour, heure, coach) existent
    if (!courseDay || !courseTime || !courseCoach) {
      // Si une information manque, retourne un tableau vide pour éviter des erreurs
      return slots;
    }

    // Boucle sur 3 itérations pour générer un créneau par semaine (semaine actuelle + 2 suivantes)
    for (let i = 0; i < 3; i++) {
      // Crée une nouvelle instance de Date basée sur la date actuelle pour éviter de modifier today
      const nextDate = new Date(today);

      // Calcule le nombre de jours à ajouter pour atteindre le jour du cours dans la semaine i
      // (courseDay - today.getDay() + 7) % 7 : Calcule la différence entre le jour du cours et aujourd'hui, en tenant compte du cycle hebdomadaire
      // i * 7 : Ajoute i semaines
      nextDate.setDate(today.getDate() + ((courseDay - today.getDay() + 7) % 7) + i * 7);

      // Formate la date au format JJ/MM/AAAA (ex. : "01/05/2025") pour l'affichage
      const formattedDate = nextDate.toLocaleDateString('fr-FR', {
        day: '2-digit', // Jour sur 2 chiffres (ex. : 01)
        month: '2-digit', // Mois sur 2 chiffres (ex. : 05)
        year: 'numeric', // Année complète (ex. : 2025)
      });

      // Ajoute un objet créneau au tableau slots
      slots.push({
        id: i + 1, // ID unique pour le créneau (1, 2, 3)
        date: formattedDate, // Date formatée (ex. : "01/05/2025")
        time: courseTime, // Heure du cours (ex. : "18:00")
        coach: courseCoach, // Nom du coach (ex. : "Anna")
      });
    }

    // Retourne la liste complète des créneaux générés
    return slots;
  };

  // Crée une liste de créneaux pour le cours donné en décodant le nom du cours depuis l'URL
  // decodeURIComponent convertit les caractères encodés (ex. : "%20" devient un espace)
  // useState initialise l'état slots avec le résultat de getNextThreeWeeks, qui ne change pas après le montage
  const [slots] = useState(getNextThreeWeeks(decodeURIComponent(courseName)));

  /**
   * Effet : Mise à jour de la clé de rendu
   * Description : Incrémente renderKey à chaque changement de la liste des cours inscrits (inscribedCourses)
   * pour forcer le re-rendu de la liste des créneaux et refléter les nouvelles inscriptions.
   * Dépendances : [inscribedCourses]
   */
  useEffect(() => {
    // Met à jour renderKey en incrémentant la valeur précédente
    // prev est la valeur actuelle de renderKey, on la passe à prev + 1
    setRenderKey((prev) => prev + 1);

    // Journalise la nouvelle clé et la liste des cours inscrits pour déboguer
    // Aide à vérifier que les inscriptions sont correctement mises à jour
    console.log('RenderKey mis à jour:', renderKey, 'Inscribed Courses:', inscribedCourses);
  }, [inscribedCourses]); // Dépendance : inscribedCourses, relance l'effet si la liste change

  /**
   * Effet : Récupération des inscriptions existantes
   * Description : Envoie une requête GET à l'endpoint /user/previous-courses pour récupérer les cours auxquels
   * l'utilisateur est inscrit. Associe les IDs des cours aux créneaux disponibles pour désactiver les boutons
   * de réservation des créneaux déjà pris. Gère les erreurs (ex. : token invalide) et redirige si nécessaire.
   * Dépendances : [courseName, slots, navigate]
   */
  useEffect(() => {
    // Définit une fonction asynchrone pour récupérer les inscriptions
    const fetchInscriptions = async () => {
      // Active l'état de chargement pour indiquer que les données sont en cours de récupération
      setLoading(true);

      // Réinitialise l'état d'erreur pour effacer tout message d'erreur précédent
      setError('');

      // Récupère le token JWT stocké dans localStorage pour authentifier la requête
      const token = localStorage.getItem('token');

      // Journalise le token pour vérifier qu'il est correctement récupéré
      console.log('Token utilisé:', token);

      // Vérifie si un token existe
      if (!token) {
        // Si aucun token n'est trouvé, redirige l'utilisateur vers la page de connexion
        navigate('/login');
        // Désactive l'état de chargement
        setLoading(false);
        // Arrête l'exécution de la fonction
        return;
      }

      try {
        // Envoie une requête GET à l'endpoint /user/previous-courses pour récupérer les cours inscrits
        const response = await fetch('https://localhost:3001/user/previous-courses', {
          // Ajoute l'en-tête Authorization avec le format Bearer suivi du token
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Vérifie si la réponse indique un accès refusé (statut HTTP 403)
        if (response.status === 403) {
          // Journalise une erreur pour indiquer que le token est invalide ou expiré
          console.error('Accès refusé: Token invalide');
          // Supprime le token invalide de localStorage pour éviter d'autres erreurs
          localStorage.removeItem('token');
          // Redirige l'utilisateur vers la page de connexion
          navigate('/login');
          // Désactive l'état de chargement
          setLoading(false);
          // Arrête l'exécution de la fonction
          return;
        }

        // Vérifie si la réponse n'est pas réussie (statut HTTP autre que 2xx)
        if (!response.ok) {
          // Lance une erreur avec un message indiquant le code de statut HTTP
          throw new Error('Erreur lors de la récupération des cours');
        }

        // Convertit la réponse HTTP en objet JSON
        // data contient les cours inscrits, généralement sous la forme { courses: [...] }
        const data = await response.json();

        // Journalise les données reçues pour vérifier leur contenu
        console.log('Inscriptions reçues:', data.courses);

        // Crée un objet vide pour mapper les créneaux (date + heure) aux IDs des cours inscrits
        const courseIdMap = {};

        // Mappe chaque créneau disponible pour associer un ID de cours si l'utilisateur est déjà inscrit
        const courseIds = slots
          .map((slot) => {
            // Sépare la date du créneau (format JJ/MM/AAAA) en parties pour reformater
            // Exemple : "01/05/2025" devient ["01", "05", "2025"]
            const slotParts = slot.date.split('/');

            // Reformate la date au format AAAA-MM-JJ (ex. : "2025-05-01") pour comparaison
            // slotParts[2] = année, slotParts[1] = mois, slotParts[0] = jour
            const slotDateStr = `${slotParts[2]}-${slotParts[1]}-${slotParts[0]}`;

            // Récupère l'heure du créneau (ex. : "18:00")
            const slotTime = slot.time;

            // Recherche un cours correspondant dans la liste des cours inscrits (data.courses)
            // La méthode find parcourt le tableau data.courses et retourne le premier élément qui satisfait la condition
            // Syntaxe : array.find(callback(element[, index[, array]])[, thisArg])
            // Ici, callback est une fonction qui vérifie si un cours correspond au créneau
            const matchingCourse = data.courses.find((course) => {
              // Crée un objet Date à partir de la date du cours (course.datetime_cours)
              const courseDate = new Date(course.datetime_cours);

              // Extrait la date au format AAAA-MM-JJ (ex. : "2025-05-01")
              // toISOString() retourne une chaîne comme "2025-05-01T18:00:00.000Z"
              // split('T')[0] prend la partie avant "T" (la date)
              const courseDateStr = courseDate.toISOString().split('T')[0];

              // Extrait l'heure au format HH:MM (ex. : "18:00")
              // toLocaleTimeString('fr-FR', {...}) formate l'heure selon le fuseau horaire Europe/Paris
              // Options : hour et minute sur 2 chiffres, sans format 12h (24h)
              const courseTime = courseDate.toLocaleTimeString('fr-FR', {
                hour: '2-digit', // Heure sur 2 chiffres (ex. : 18)
                minute: '2-digit', // Minutes sur 2 chiffres (ex. : 00)
                hour12: false, // Format 24h (pas AM/PM)
                timeZone: 'Europe/Paris', // Fuseau horaire pour cohérence
              });

              // Journalise les détails pour déboguer la correspondance
              // Affiche le nom, la date, l'heure, l'ID du cours, et si les critères correspondent
              console.log('Course:', {
                nom_cours: course.nom_cours, // Nom du cours (ex. : "Cours Collectifs")
                datetime_cours: course.datetime_cours, // Date et heure brutes du cours
                id_cours: course.id_cours, // ID unique du cours
                courseDateStr, // Date formatée (ex. : "2025-05-01")
                courseTime, // Heure formatée (ex. : "18:00")
                slotDateStr, // Date du créneau (ex. : "2025-05-01")
                slotTime, // Heure du créneau (ex. : "18:00")
                matches:
                  course.nom_cours === decodeURIComponent(courseName) && // Vérifie si le nom correspond
                  courseDateStr === slotDateStr && // Vérifie si la date correspond
                  courseTime === slotTime, // Vérifie si l'heure correspond
              });

              // Retourne true si le cours correspond au créneau (nom, date, heure)
              return (
                course.nom_cours === decodeURIComponent(courseName) &&
                courseDateStr === slotDateStr &&
                courseTime === slotTime
              );
            });

            // Si un cours correspondant est trouvé
            if (matchingCourse) {
              // Récupère l'ID du cours
              const courseId = matchingCourse.id_cours;
              // Vérifie que l'ID existe
              if (courseId) {
                // Associe le créneau (date + heure) à l'ID du cours dans courseIdMap
                // La clé est formatée comme "JJ/MM/AAAA_HH:MM" pour unicité
                courseIdMap[`${slot.date}_${slot.time}`] = courseId;
                // Retourne l'ID pour l'ajouter à courseIds
                return courseId;
              }
            }
            // Retourne null si aucun cours ne correspond au créneau
            return null;
          })
          // Filtre les valeurs nulles ou indéfinies pour ne garder que les IDs valides
          // Syntaxe : array.filter(callback(element[, index[, array]])[, thisArg])
          // Retourne un nouveau tableau avec les éléments pour lesquels callback retourne true
          .filter((id) => id !== null && id !== undefined);

        // Met à jour l'état inscribedCourses avec la liste des IDs des cours inscrits
        setInscribedCourses(courseIds);

        // Met à jour l'état slotCourseIds avec l'objet mappant les créneaux aux IDs
        setSlotCourseIds(courseIdMap);

        // Journalise les résultats pour vérifier le mappage
        console.log('Inscribed Courses:', courseIds, 'Slot Course IDs:', courseIdMap);

        // Désactive l'état de chargement une fois les données traitées
        setLoading(false);
      } catch (error) {
        // Journalise l'erreur pour débogage
        console.error('Erreur lors de la récupération des inscriptions :', error);
        // Définit un message d'erreur à afficher à l'utilisateur
        setError('Impossible de charger les inscriptions. Veuillez réessayer.');
        // Réinitialise la liste des cours inscrits
        setInscribedCourses([]);
        // Réinitialise le mappage des créneaux
        setSlotCourseIds({});
        // Désactive l'état de chargement
        setLoading(false);
      }
    };

    // Exécute la fonction pour récupérer les inscriptions
    fetchInscriptions();
  }, [courseName, slots, navigate]); // Dépendances : courseName, slots, navigate

  /**
   * Fonction : handleReserve
   * Description : Gère le processus de réservation d'un créneau. Affiche un popup de confirmation avant
   * d'envoyer une requête POST à /bookings pour enregistrer la réservation. Met à jour les inscriptions,
   * affiche un popup de succès, et rafraîchit la liste des cours inscrits.
   * Arguments :
   * - slot : Objet créneau avec date, time, coach (ex. : { date: "01/05/2025", time: "18:00", coach: "Anna" })
   * - confirmed : Booléen indiquant si la réservation est confirmée (true après clic sur "Confirmer")
   * Retour : Aucun
   */
  const handleReserve = async (slot, confirmed = false) => {
    // Vérifie si la réservation n'est pas encore confirmée
    if (!confirmed) {
      // Stocke le créneau sélectionné dans l'état selectedSlot
      setSelectedSlot(slot);
      // Ouvre le popup de confirmation
      setShowConfirmPopup(true);
      // Arrête l'exécution pour attendre la confirmation
      return;
    }

    // Récupère le token JWT depuis localStorage pour authentifier la requête
    const token = localStorage.getItem('token');

    // Vérifie si un token existe
    if (!token) {
      // Redirige vers la page de connexion si l'utilisateur n'est pas connecté
      navigate('/login');
      // Arrête l'exécution
      return;
    }

    try {
      // Envoie une requête POST à l'endpoint /bookings pour enregistrer la réservation
      const response = await fetch('https://localhost:3001/bookings', {
        // Spécifie la méthode HTTP POST pour créer une nouvelle ressource
        method: 'POST',
        // Définit les en-têtes de la requête
        headers: {
          'Content-Type': 'application/json', // Indique que le corps est en JSON
          Authorization: `Bearer ${token}`, // Ajoute le token pour authentification
        },
        // Convertit les données du créneau en JSON pour le corps de la requête
        body: JSON.stringify({
          courseName: decodeURIComponent(courseName), // Nom du cours décodé (ex. : "Cours Collectifs")
          date: slot.date, // Date du créneau (ex. : "01/05/2025")
          time: slot.time, // Heure du créneau (ex. : "18:00")
          duration: '2 hours', // Durée fixe du cours (2 heures)
        }),
      });

      // Vérifie si la réponse indique un accès refusé (statut HTTP 403)
      if (response.status === 403) {
        // Journalise l'erreur pour indiquer un problème avec le token
        console.error('Accès refusé: Token invalide');
        // Supprime le token invalide de localStorage
        localStorage.removeItem('token');
        // Redirige vers la page de connexion
        navigate('/login');
        // Arrête l'exécution
        return;
      }

      // Vérifie si la réponse n'est pas réussie (statut HTTP autre que 2xx)
      if (!response.ok) {
        // Lance une erreur pour indiquer un problème avec la réservation
        console.error('Réponse de l\'API:', response);
        throw new Error('Erreur lors de la réservation');
      }

      // Convertit la réponse en JSON
      // data contient les informations de la réservation, notamment l'ID du cours créé
      const data = await response.json();

      // Vérifie si la réponse inclut un ID de cours valide
      if (data.id_cours) {
        // Met à jour l'état slotCourseIds en ajoutant l'ID du cours pour ce créneau
        // prev est l'objet slotCourseIds actuel, on ajoute une nouvelle entrée
        setSlotCourseIds((prev) => ({
          ...prev,
          [`${slot.date}_${slot.time}`]: data.id_cours, // Clé formatée comme "JJ/MM/AAAA_HH:MM"
        }));
        // Met à jour l'état inscribedCourses en ajoutant l'ID du cours à la liste
        // prev est le tableau actuel, on ajoute le nouvel ID
        setInscribedCourses((prev) => [...prev, data.id_cours]);
      }

      // Ferme le popup de confirmation
      setShowConfirmPopup(false);

      // Ouvre le popup de succès pour informer l'utilisateur
      setShowSuccessPopup(true);

      // Définit le message de confirmation avec les détails du créneau réservé
      setConfirmation(`Réservation confirmée pour ${courseName} le ${slot.date} à ${slot.time} !`);

      // Planifie la fermeture du popup de succès et la réinitialisation du message après 3 secondes
      setTimeout(() => {
        // Efface le message de confirmation
        setConfirmation('');
        // Ferme le popup de succès
        setShowSuccessPopup(false);
      }, 3000);

      // Définit une fonction asynchrone pour rafraîchir la liste des inscriptions
      const fetchInscriptions = async () => {
        // Active l'état de chargement pendant la récupération
        console.log("test")
        setLoading(true);
        try {          
          // Envoie une nouvelle requête GET à /user/previous-courses
          const response = await fetch('https://localhost:3001/user/previous-courses', {
            // Ajoute l'en-tête Authorization
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Vérifie si la réponse indique un accès refusé
          if (response.status === 403) {
            // Supprime le token invalide
            localStorage.removeItem('token');
            // Redirige vers la connexion
            navigate('/login');
            // Désactive le chargement
            setLoading(false);
            // Arrête l'exécution
            return;
          }

          // Vérifie si la réponse n'est pas réussie
          if (!response.ok) {
            // Lance une erreur
            throw new Error('Erreur lors de la récupération des cours');
          }

          // Convertit la réponse en JSON
          const data = await response.json();

          // Journalise les données reçues pour vérifier les nouvelles inscriptions
          console.log('Inscriptions reçues après réservation:', data.courses);

          // Crée un nouveau mappage pour associer les créneaux aux IDs
          const courseIdMap = {};

          // Mappe chaque créneau pour trouver les correspondances
          const courseIds = slots
            .map((slot) => {
              // Sépare la date du créneau
              const slotParts = slot.date.split('/');
              // Reformate au format AAAA-MM-JJ
              const slotDateStr = `${slotParts[2]}-${slotParts[1]}-${slotParts[0]}`;
              // Récupère l'heure
              const slotTime = slot.time;

              // Recherche un cours correspondant
              const matchingCourse = data.courses.find((course) => {
                // Crée un objet Date
                const courseDate = new Date(course.datetime_cours);
                // Extrait la date
                const courseDateStr = courseDate.toISOString().split('T')[0];
                // Extrait l'heure
                const courseTime = courseDate.toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                  timeZone: 'Europe/Paris',
                });
                // Journalise pour débogage
                console.log('Course après réservation:', {
                  nom_cours: course.nom_cours,
                  datetime_cours: course.datetime_cours,
                  id_cours: course.id_cours,
                  courseDateStr,
                  courseTime,
                  slotDateStr,
                  slotTime,
                });
                // Vérifie la correspondance
                return (
                  course.nom_cours === decodeURIComponent(courseName) &&
                  courseDateStr === slotDateStr &&
                  courseTime === slotTime
                );
              });

              // Si un cours est trouvé
              if (matchingCourse) {
                // Récupère l'ID
                const courseId = matchingCourse.id_cours;
                // Vérifie l'ID
                if (courseId) {
                  // Ajoute au mappage
                  courseIdMap[`${slot.date}_${slot.time}`] = courseId;
                  // Retourne l'ID
                  return courseId;
                }
              }
              // Retourne null si pas de correspondance
              return null;
            })
            // Filtre les valeurs nulles
            .filter((id) => id !== null && id !== undefined);

          // Met à jour les états
          setInscribedCourses(courseIds);
          setSlotCourseIds(courseIdMap);
          // Journalise les résultats
          console.log('Inscribed Courses après réservation:', courseIds, 'Slot Course IDs:', courseIdMap);
          // Désactive le chargement
          setLoading(false);
        } catch (error) {
          // Journalise l'erreur
          console.error('Erreur lors de la récupération des inscriptions :', error);
          // Définit un message d'erreur
          setError('Impossible de charger les inscriptions après réservation. Veuillez réessayer.');
          // Désactive le chargement
          setLoading(false);
        }
      };

      // Exécute la fonction pour rafraîchir les inscriptions
      await fetchInscriptions();
    } catch (error) {
      // Affiche une alerte avec le message d'erreur
      alert('Échec de la réservation : ' + error.message);
      // Ferme le popup de confirmation
      setShowConfirmPopup(false);
      // Désactive l'état de chargement
      setLoading(false);
    }
  };

  // Début du rendu JSX
  return (
    // Conteneur principal de la page, stylisé via S.Container
    <S.Container>
      {/* Titre de la page, affichant le nom du cours décodé (ex. : "Cours Collectifs") */}
      <S.Title>Choisir un créneau pour {decodeURIComponent(courseName)}</S.Title>
      
      {/* Vérifie si les données sont en cours de chargement */}
      {loading ? (
        // Affiche un message indiquant que les créneaux sont en cours de chargement
        <S.CourseDetails>Chargement des créneaux...</S.CourseDetails>
      ) : error ? (
        // Affiche un message d'erreur si une erreur est survenue
        <S.ErrorMessage>{error}</S.ErrorMessage>
      ) : (
        // Affiche la liste des créneaux disponibles
        <S.CourseList key={`course-list-${renderKey}`}>
          {/* Lien pour retourner à la page des cours, stylisé via S.ReturnLink */}
          <S.ReturnLink to="/courses">Retour</S.ReturnLink>
          
          {/* Vérifie si des créneaux sont disponibles */}
          {slots.length > 0 ? (
            // Mappe chaque créneau pour l'afficher dans un élément de liste
            slots.map((slot) => {
              // Vérifie si le créneau est déjà réservé par l'utilisateur
              // slotCourseIds contient les IDs des cours pour chaque créneau (ex. : "01/05/2025_18:00" -> 123)
              // inscribedCourses contient les IDs des cours inscrits
              // isDisabled est true si le créneau est déjà réservé
              const isDisabled = slotCourseIds[`${slot.date}_${slot.time}`] && inscribedCourses.includes(slotCourseIds[`${slot.date}_${slot.time}`]);
              
              // Journalise l'état de désactivation pour déboguer
              console.log('Disabled for slot:', slot.date, slot.time, isDisabled, 'RenderKey:', renderKey);
              
              // Retourne un élément de liste pour le créneau
              return (
                // Élément de liste pour le créneau, avec une clé unique basée sur date et heure
                <S.CourseItem key={`${slot.date}_${slot.time}`}>
                  {/* Conteneur pour les informations du créneau (nom, date, heure, coach) */}
                  <S.CourseInfo>
                    {/* Nom du cours, décodé pour affichage correct */}
                    <S.CourseName>{decodeURIComponent(courseName)}</S.CourseName>
                    {/* Date du créneau (ex. : "01/05/2025") */}
                    <S.CourseDetails>Date : {slot.date}</S.CourseDetails>
                    {/* Heure du créneau (ex. : "18:00") */}
                    <S.CourseDetails>Horaire : {slot.time}</S.CourseDetails>
                    {/* Nom du coach (ex. : "Anna") */}
                    <S.CourseDetails>Coach : {slot.coach}</S.CourseDetails>
                  </S.CourseInfo>
                  {/* Bouton pour réserver le créneau, désactivé si déjà réservé */}
                  <S.CustomReserveButton
                    // Appelle handleReserve avec le créneau lors du clic
                    onClick={() => handleReserve(slot)}
                    // Désactive le bouton si isDisabled est true
                    disabled={isDisabled}
                  >
                    Réserver
                  </S.CustomReserveButton>
                </S.CourseItem>
              );
            })
          ) : (
            // Affiche un message si aucun créneau n'est disponible
            <S.CourseDetails>Aucun créneau disponible pour ce cours.</S.CourseDetails>
          )}
        </S.CourseList>
      )}
      
      {/* Affiche un message de confirmation s'il existe */}
      {confirmation && <S.Confirmation>{confirmation}</S.Confirmation>}
      
      {/* Affiche le popup de confirmation si showConfirmPopup est true et un créneau est sélectionné */}
      {showConfirmPopup && selectedSlot && (
        // Fragment pour regrouper la superposition et le popup
        <>
          {/* Superposition sombre pour mettre en avant le popup */}
          <S.Overlay />
          {/* Popup de confirmation, stylisé via S.ConfirmationPopup */}
          <S.ConfirmationPopup isVisible={showConfirmPopup}>
            {/* Message demandant confirmation, avec détails du créneau */}
            <S.PopupMessage>
              Êtes-vous sûr de vouloir vous inscrire pour le cours {decodeURIComponent(courseName)} le {selectedSlot.date} à {selectedSlot.time} ?
            </S.PopupMessage>
            {/* Bouton pour confirmer la réservation, appelle handleReserve avec confirmed=true */}
            <S.PopupButton onClick={() => handleReserve(selectedSlot, true)}>Confirmer</S.PopupButton>
            {/* Bouton pour annuler, ferme le popup */}
            <S.PopupButton onClick={() => setShowConfirmPopup(false)}>Annuler</S.PopupButton>
          </S.ConfirmationPopup>
        </>
      )}
      
      {/* Affiche le popup de succès si showSuccessPopup est true et un créneau est sélectionné */}
      {showSuccessPopup && selectedSlot && (
        // Fragment pour regrouper la superposition et le popup
        <>
          {/* Superposition sombre */}
          <S.Overlay />
          {/* Popup de succès */}
          <S.ConfirmationPopup isVisible={showSuccessPopup}>
            {/* Message indiquant la réussite de la réservation */}
            <S.PopupMessage>
              Réservation confirmée pour {decodeURIComponent(courseName)} le {selectedSlot.date} à {selectedSlot.time} !
            </S.PopupMessage>
            {/* Bouton pour fermer le popup */}
            <S.PopupButton onClick={() => setShowSuccessPopup(false)}>OK</S.PopupButton>
          </S.ConfirmationPopup>
        </>
      )}
    </S.Container>
  );
};

// Exporte le composant CourseSelectionPage pour utilisation dans les routes de l'application
export default CourseSelectionPage;