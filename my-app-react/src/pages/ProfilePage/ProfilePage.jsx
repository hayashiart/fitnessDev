/**
 * Fichier : ProfilePage.jsx
 * Description : Composant React pour la page de profil utilisateur. Affiche les informations personnelles,
 * l'abonnement actif (s'il existe), et des boutons pour accéder à l'historique des achats et des cours inscrits.
 * Inclut un popup pour annuler l'abonnement actif. Récupère les données via des requêtes API.
 */

import React, { useState, useEffect, useContext } from 'react'; // Importe React et les hooks nécessaires
import { AuthContext } from '../../contexts/AuthContext'; // Importe AuthContext pour accéder à l'utilisateur
import { useNavigate, useLocation } from 'react-router-dom'; // Importe useNavigate et useLocation pour la navigation
import axios from '../../services/axios'; // Importe l'instance Axios pour les requêtes API
import * as S from './ProfilePageStyles'; // Importe tous les composants stylisés depuis ProfilePageStyles.jsx

/**
 * Composant : ProfilePage
 * Description : Affiche une page avec les informations du profil, l'abonnement actif, et des liens vers
 * l'historique des achats et des cours inscrits. Permet d'annuler l'abonnement via un popup de confirmation.
 * Retour : JSX contenant les sections du profil et un popup pour l'annulation
 */
const ProfilePage = () => {
  // Récupère l'utilisateur connecté depuis AuthContext
  // user contient les informations actuelles de l'utilisateur
  const { user } = useContext(AuthContext);

  // Crée une fonction navigate pour rediriger l'utilisateur
  const navigate = useNavigate();

  // Récupère l'objet location pour accéder à l'état de la navigation (ex. : refresh)
  const location = useLocation();

  // Crée un état profile pour stocker les informations du profil récupérées via l'API
  // Initialisé à null, car les données sont chargées après le montage
  const [profile, setProfile] = useState(null);

  // Crée un état abonnement pour stocker les informations de l'abonnement actif
  // Initialisé à null, mis à jour avec les données ou null si aucun abonnement
  const [abonnement, setAbonnement] = useState(null);

  // Crée un état showPopup pour contrôler l'affichage du popup d'annulation d'abonnement
  // Initialisé à false, car le popup est fermé par défaut
  const [showPopup, setShowPopup] = useState(false);

  /**
   * Effet : Récupération des données du profil et de l'abonnement
   * Description : Envoie des requêtes GET à /user/profil et /user/abonnement/check pour récupérer
   * les informations du profil et l'abonnement actif. S'exécute au montage et lors d'un rafraîchissement.
   * Dépendances : [location.state?.refresh]
   */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/user/profil');
        setProfile(response.data.user);
      } catch (error) {
        console.error('Erreur profil:', error);
        alert('Une erreur est survenue lors de la récupération de votre profil.');
      }
    };
  
    const fetchAbonnement = async () => {
      try {
        const response = await axios.get('/user/abonnement/check');
        setAbonnement(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setAbonnement(null);  // Aucun abonnement actif
        } else {
          console.error('Erreur abonnement:', error);
          alert("Une erreur est survenue lors de la récupération de votre abonnement.");
        }
      }
    };
  
    fetchProfile();
    fetchAbonnement();
  }, [location.state?.refresh]);// Dépendance : refresh, relance si refresh est true

  /**
   * Fonction : handleCancelAbonnement
   * Description : Envoie une requête PUT à /user/abonnement/cancel pour annuler l'abonnement actif
   * et met à jour l'état abonnement à null.
   * Retour : Aucun
   */
  const handleCancelAbonnement = async () => {
    try {
      // Envoie une requête PUT à /user/abonnement/cancel
      await axios.put('/user/abonnement/cancel');
      // Réinitialise l'état abonnement
      setAbonnement(null);
      // Ferme le popup
      setShowPopup(false);
    } catch (error) {
      // Journalise l'erreur pour débogage
      console.error('Erreur lors de l\'annulation de l\'abonnement:', error);
    }
  };

  // Crée une date formatée pour le jour actuel au format JJ/MM/AAAA
  // Utilisé dans le popup pour indiquer la date de fin de l'abonnement
  const today = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit', // Jour sur 2 chiffres
    month: '2-digit', // Mois sur 2 chiffres
    year: 'numeric', // Année complète
  });

  // Vérifie si les données du profil ont été chargées
  // Affiche un message de chargement si profile est null
  if (!profile) return <div>Chargement...</div>;

  // Début du rendu JSX
  return (
    // Fragment pour regrouper les éléments
    <>
      {/* Conteneur de compensation pour le menu burger en mobile */}
      <S.Offset />
      
      {/* Balise principale pour la structure sémantique */}
      <S.Main>
        {/* Conteneur centré pour le contenu */}
        <S.Container>
          {/* Titre de la page */}
          <S.Title>PROFIL</S.Title>
          
          {/* Grille pour les blocs d'informations et d'abonnement */}
          <S.GridContainer>
            {/* Bloc pour les informations du profil */}
            <S.LargeBlock>
              {/* Titre du bloc */}
              <S.BlockTitle>INFORMATIONS PROFIL</S.BlockTitle>
              
              {/* Liste des informations */}
              <S.InfoList>
                {/* E-mail de l'utilisateur */}
                <S.InfoItem><strong>Email :</strong> {profile.email_inscrit}</S.InfoItem>
                {/* Nom de l'utilisateur */}
                <S.InfoItem><strong>Nom :</strong> {profile.nom_inscrit}</S.InfoItem>
                {/* Prénom de l'utilisateur */}
                <S.InfoItem><strong>Prénom :</strong> {profile.prenom_inscrit}</S.InfoItem>
                {/* Adresse de l'utilisateur */}
                <S.InfoItem><strong>Adresse :</strong> {profile.adresse_inscrit}</S.InfoItem>
                {/* Téléphone, avec fallback si non défini */}
                <S.InfoItem><strong>Téléphone :</strong> {profile.telephone_inscrit || 'Non renseigné'}</S.InfoItem>
                {/* Civilité, avec fallback */}
                <S.InfoItem><strong>Type :</strong> {profile.type_inscrit || 'Non défini'}</S.InfoItem>
              </S.InfoList>
              
              {/* Bouton pour modifier le profil */}
              <S.RedButton onClick={() => navigate('/profil/edit')}>MODIFIER</S.RedButton>
            </S.LargeBlock>

            {/* Bloc pour l'abonnement actif */}
            <S.LargeBlock>
              {/* Titre du bloc */}
              <S.BlockTitle>ABONNEMENT ACTIF</S.BlockTitle>
              
              {/* Vérifie si un abonnement existe */}
              {abonnement ? (
                // Liste des détails de l'abonnement
                <S.InfoList>
                  {/* Type de l'abonnement (ex. : ESSENTIAL) */}
                  <S.InfoItem><strong>Type :</strong> {abonnement.nom_type_abonnement}</S.InfoItem>
                  {/* Durée de l'abonnement en mois */}
                  <S.InfoItem><strong>Durée :</strong> {abonnement.duree_abonnement} mois</S.InfoItem>
                  {/* Date de début, formatée */}
                  <S.InfoItem><strong>Début :</strong> {new Date(abonnement.datedebut_abonnement).toLocaleDateString()}</S.InfoItem>
                  {/* Date de fin, formatée */}
                  <S.InfoItem><strong>Fin :</strong> {new Date(abonnement.datefin_abonnement).toLocaleDateString()}</S.InfoItem>
                </S.InfoList>
              ) : (
                // Message si aucun abonnement actif
                <S.InfoList>
                  <S.InfoItem>Aucun abonnement actif</S.InfoItem>
                </S.InfoList>
              )}
              
              {/* Bouton pour modifier (annuler) l'abonnement, désactivé si aucun abonnement */}
              <S.RedButton
                onClick={() => setShowPopup(true)}
                disabled={!abonnement}
              >
                MODIFIER
              </S.RedButton>
            </S.LargeBlock>
          </S.GridContainer>

          {/* Grille pour les blocs d'historique */}
          <S.SmallGridContainer>
            {/* Bloc pour l'historique des achats */}
            <S.SmallBlock>
              {/* Titre du bloc */}
              <S.BlockTitle>HISTORIQUE ACHATS</S.BlockTitle>
              {/* Bouton pour naviguer vers la page des commandes */}
              <S.RedButton onClick={() => navigate('/commandes')}>VOIR</S.RedButton>
            </S.SmallBlock>

            {/* Bloc pour les cours inscrits */}
            <S.SmallBlock>
              {/* Titre du bloc */}
              <S.BlockTitle>COURS INSCRITS</S.BlockTitle>
              {/* Bouton pour naviguer vers la page des cours inscrits */}
              <S.RedButton onClick={() => navigate('/courses-inscrits')}>VOIR</S.RedButton>
            </S.SmallBlock>
          </S.SmallGridContainer>

          {/* Popup pour confirmer l'annulation de l'abonnement */}
          {showPopup && (
            // Superposition et popup
            <S.Overlay>
              {/* Conteneur du popup */}
              <S.Popup>
                {/* Titre du popup */}
                <S.PopupTitle>ANNULER ABONNEMENT</S.PopupTitle>
                {/* Message indiquant la date de fin */}
                <S.PopupText>Après Confirmation, votre abonnement prendra fin le {today}</S.PopupText>
                {/* Conteneur pour les boutons */}
                <S.ButtonContainer>
                  {/* Bouton pour annuler l'abonnement */}
                  <S.RedButton onClick={handleCancelAbonnement}>ANNULER</S.RedButton>
                  {/* Bouton pour fermer le popup */}
                  <S.GrayButton onClick={() => setShowPopup(false)}>FERMER</S.GrayButton>
                </S.ButtonContainer>
              </S.Popup>
            </S.Overlay>
          )}
        </S.Container>
      </S.Main>
    </>
  );
};

// Exporte le composant ProfilePage pour utilisation dans les routes
export default ProfilePage;