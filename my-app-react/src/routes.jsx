/**
 * Fichier : routes.jsx
 * Description : Composant React définissant les routes de l'application FitnessDev à l'aide de React Router.
 * Chaque route associe un chemin URL à un composant de page ou une fonctionnalité, comme la page d'accueil, le panier,
 * le paiement, ou le profil. Certaines routes sont enveloppées dans CartWrapper pour fournir le contexte du panier.
 * Inclut Paiement.jsx pour la page de paiement, aligné avec la branche Trey pour un flux de commande cohérent.
 * Contexte : Projet FitnessDev, aligné avec la branche Trey pour utiliser Panier.jsx, Produit.jsx, Checkout.jsx, et Paiement.jsx.
 * Dépendances : react-router-dom pour la gestion des routes, composants de pages spécifiques.
 */

/** Importation des dépendances nécessaires */
import { Routes, Route } from 'react-router-dom'; // Routes est le conteneur principal des routes, Route associe un chemin à un composant
import HomePage from './pages/HomePage/HomePage.jsx'; // Page d'accueil, affichée à la racine de l'application
import ContactPage from './pages/ContactPage/ContactPage.jsx'; // Page de contact pour les informations de support
import LoginPage from './pages/LoginPage/LoginPage.jsx'; // Page de connexion pour l'authentification des utilisateurs
import SignUpPage from './pages/SignUpPage/SignUpPage.jsx'; // Page d'inscription pour la création de comptes
import SubscriptionPage from './pages/SubscriptionPage/SubscriptionPage.jsx'; // Page des abonnements pour gérer les plans
// Imports alignés avec la branche Trey pour la gestion du panier, des produits, et du paiement
import Produit from './pages/Produit/Produit.jsx'; // Page des produits, affiche la liste des articles disponibles
import Panier from './pages/Panier/Panier.jsx'; // Page du panier, affiche les articles sélectionnés
import CartWrapper from './components/CartWrapper.jsx'; // Composant enveloppeur fournissant le contexte CartContext
import Checkout from './pages/Checkout/Checkout.jsx'; // Page de validation de commande, gère livraison et paiement
import Paiement from './pages/Paiement/Paiement.jsx'; // Page de paiement, collecte l'adresse et les informations de carte
// Imports pour les fonctionnalités de cours et de profil
import CoursePage from './pages/CoursePage/CoursePage.jsx'; // Page des cours, affiche les options de cours disponibles
import CourseSelectionPage from './pages/CourseSelectionPage/CourseSelectionPage.jsx'; // Page de sélection des créneaux de cours
import ProfilePage from './pages/ProfilePage/ProfilePage.jsx'; // Page principale du profil utilisateur
import EditProfilePage from './pages/ProfilePage/EditProfilePage.jsx'; // Page pour modifier les informations du profil
import CoursesInscritsPage from './pages/ProfilePage/CoursesInscritsPage.jsx'; // Page des cours auxquels l'utilisateur est inscrit
import CommandesPage from './pages/ProfilePage/CommandesPage.jsx'; // Page des commandes passées par l'utilisateur
import ScrollToTop from './components/ScrollToTop.jsx'; // Composant pour remonter en haut de la page à chaque changement de route

/**
 * Composant : AppRoutes
 * Description : Définit l'ensemble des routes de l'application FitnessDev en utilisant le composant Routes de react-router-dom.
 * Chaque Route mappe un chemin URL (path) à un composant de page. Les routes liées au panier (produit, panier, checkout)
 * sont enveloppées dans CartWrapper pour accéder au contexte du panier. ScrollToTop garantit que la page commence en haut
 * à chaque navigation. Inclut la route pour Paiement.jsx à l'URL "/paiement" pour le flux de commande.
 * Paramètres : Aucun
 * Retour : JSX contenant le composant Routes avec toutes les routes définies, précédé de ScrollToTop
 */
const AppRoutes = () => {
  // Fragment (<>) regroupe ScrollToTop et Routes sans ajouter de balise DOM supplémentaire
  // Syntaxe : <>contenu</> est équivalent à <React.Fragment>
  // Utilisé pour éviter des div inutiles dans le DOM
  return (
    <>
      {/* ScrollToTop est un composant qui exécute window.scrollTo(0, 0) à chaque changement de route */}
      <ScrollToTop />
      
      {/* Routes est le conteneur principal qui encapsule toutes les définitions de routes */}
      <Routes>
        {/* Route pour la page d'accueil, rendue lorsque l'URL est "/" */}
        <Route path="/" element={<HomePage />} />
        
        {/* Route pour la page de contact, rendue à "/contact" */}
        <Route path="/contact" element={<ContactPage />} />
        
        {/* Route pour la page de connexion, rendue à "/login" */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Route pour la page d'inscription, rendue à "/signup" */}
        <Route path="/signup" element={<SignUpPage />} />
        
        {/* Route pour la page des abonnements, rendue à "/subscription" */}
        <Route path="/subscription" element={<SubscriptionPage />} />
        
        {/* Route pour la page des produits, enveloppée dans CartWrapper pour fournir le contexte du panier */}
        <Route
          path="/produit" // Chemin URL pour accéder à la page
          element={
            // CartWrapper fournit CartContext à Produit et ses descendants
            <CartWrapper>
              <Produit />
            </CartWrapper>
          }
        />
        
        {/* Route pour la page du panier, enveloppée dans CartWrapper */}
        <Route
          path="/panier"
          element={
            <CartWrapper>
              <Panier />
            </CartWrapper>
          }
        />
        
        {/* Route pour la page de validation de commande, enveloppée dans CartWrapper */}
        <Route
          path="/checkout"
          element={
            <CartWrapper>
              <Checkout />
            </CartWrapper>
          }
        />
        
        {/* Route pour la page de paiement, rendue à "/paiement" */}
        <Route path="/paiement" element={<Paiement />} />
        
        {/* Route pour la page des cours, rendue à "/courses" */}
        <Route path="/courses" element={<CoursePage />} />
        
        {/* Route dynamique pour la sélection des créneaux de cours, rendue à "/course-selection/:courseName" */}
        {/* :courseName est un paramètre dynamique, ex. "/course-selection/Cours%20Collectifs" */}
        <Route path="/course-selection/:courseName" element={<CourseSelectionPage />} />
        
        {/* Route pour la page principale du profil, rendue à "/profil" */}
        <Route path="/profil" element={<ProfilePage />} />
        
        {/* Route pour la page des cours inscrits, rendue à "/courses-inscrits" */}
        <Route path="/courses-inscrits" element={<CoursesInscritsPage />} />
        
        {/* Route pour la page de modification du profil, rendue à "/profil/edit" */}
        <Route path="/profil/edit" element={<EditProfilePage />} />
        
        {/* Route pour la page des commandes, rendue à "/commandes" */}
        <Route path="/commandes" element={<CommandesPage />} />
      </Routes>
    </>
  );
};

/** Exportation du composant AppRoutes pour utilisation dans l'application */
export default AppRoutes;