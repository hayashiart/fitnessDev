/**
 * Fichier : BurgerMenu.jsx
 * Description : Composant React pour un menu burger responsive (mobile uniquement) dans FitnessDev. Affiche une icône
 * de menu qui ouvre un panneau de navigation avec des liens vers les pages principales et des options d'authentification.
 * Utilise AuthContext pour gérer la connexion/déconnexion et CartContext pour afficher le nombre total d'articles dans le
 * panier. Inclut des styles responsifs pour mobile et gère les erreurs de contexte pour éviter les plantages.
 * Contexte : Projet FitnessDev, aligné avec la branche Trey pour intégrer avec Panier.jsx, Produit.jsx, Checkout.jsx, et Paiement.jsx.
 * Dépendances : react (composant, hooks useState et useContext), styled-components (styles), react-router-dom (navigation),
 * useScroll (hook personnalisé), FontAwesome (icônes), composants locaux (Button, MenuIcon).
 */

/** Importation des dépendances nécessaires */
import React, { useState, useContext } from 'react'; // React pour créer des composants, useState pour gérer l'état local, useContext pour accéder aux contextes
import useScroll from '../hooks/useScroll.jsx'; // Hook personnalisé pour détecter le défilement de la page
import styled from 'styled-components'; // styled-components pour créer des styles encapsulés
import MenuIcon from '../assets/icons/menu.svg?react'; // Icône SVG du menu burger, importée comme composant React via ?react
import { Link, useNavigate } from 'react-router-dom'; // Link pour les liens de navigation, useNavigate pour la redirection programmatique
import { AuthContext } from '../contexts/AuthContext.jsx'; // Contexte pour gérer l'état de l'utilisateur (connecté ou non)
import { CartContext } from '../contexts/CartContext.jsx'; // Contexte pour gérer le panier, inclut totalCartItems
import Button from './Button.jsx'; // Composant bouton personnalisé pour les actions
import '@fortawesome/fontawesome-free/css/all.min.css'; // Styles CSS pour les icônes FontAwesome (ex. icône de panier)

/** Définition des composants stylisés avec styled-components */
const StyledH2 = styled.h2`
  font-size: 12px;
  color: #ffffff;
`;

const BurgerIcon = styled(MenuIcon)`
  width: 32px;
  height: 32px;
  cursor: pointer;
  fill: #ffffff;
  display: block;
  @media (min-width: 768px) {
    display: none;
  }
`;

const BurgerMenuContainer = styled.nav.withConfig({
  shouldForwardProp: (prop) => prop !== 'isOpen' && prop !== 'scrolled',
})`
  transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-100%)')};
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  pointer-events: ${({ isOpen }) => (isOpen ? 'auto' : 'none')};
  transition: transform 0.3s ease, opacity 0.3s ease, position 0.3s ease;
  flex-direction: column;
  position: fixed;
  top: ${({ scrolled }) => (scrolled ? '84px' : '124px')};
  left: 0;
  right: 0;
  background-color: #000000;
  z-index: 1000;
  padding: 20px;
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  li {
    margin: 0;
  }
  a {
    text-decoration: none;
    color: #ffffff;
    font-size: 16px;
    font-weight: 500;
    display: block;
    padding: 10px 0;
  }
  button {
    &:hover {
      background-color: #ffffff;
      color: #9a1b14;
    }
  }
  @media (min-width: 768px) {
    display: none;
  }
`;

const BurgerHeader = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'scrolled',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  height: 84px;
  padding: 0 20px;
  background-color: #000000;
  position: fixed;
  top: ${({ scrolled }) => (scrolled ? '0' : '40px')};
  z-index: 1001;
  transition: top 0.3s ease;
  @media (min-width: 768px) {
    display: none;
  }
`;

const CartIconWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Panier = styled.i`
  display: flex;
  margin-top: 10px;
  height: 30px;
  align-self: center;
  font-size: 20px;
  color: #ffffff;
  cursor: pointer;
`;

const CartBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -10px;
  background-color: #ff0000;
  color: #ffffff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: bold;
`;

/**
 * Composant : BurgerMenu
 * Description : Menu burger responsive pour la navigation mobile. Affiche une icône de menu qui ouvre un panneau avec des
 * liens vers les pages principales (Accueil, Contact, etc.) et des options d'authentification (connexion, déconnexion, profil).
 * Utilise AuthContext pour gérer l'état de l'utilisateur et CartContext pour afficher le nombre total d'articles dans le panier.
 * Gère le défilement via useScroll et les erreurs de contexte pour éviter les plantages.
 * Paramètres : Aucun
 * Retour : JSX contenant l'en-tête du burger (icône et options d'authentification) et le panneau de navigation
 */
const BurgerMenu = () => {
  // Utilise le hook personnalisé useScroll pour détecter si la page a été défilée
  // useScroll retourne un booléen : true si la page est défilée, false sinon
  // Utilisé pour ajuster la position de l'en-tête et du menu
  const scrolled = useScroll();

  // Crée un état local menuOpen avec useState pour gérer l'ouverture/fermeture du menu
  // useState est un hook React qui retourne un tableau avec l'état actuel et une fonction pour le mettre à jour
  // Syntaxe : const [state, setState] = useState(initialValue)
  // Initialisé à false, car le menu est fermé par défaut
  // setMenuOpen est la fonction pour mettre à jour cet état
  const [menuOpen, setMenuOpen] = useState(false);

  // Récupère user et logout depuis AuthContext via useContext
  // useContext est un hook React qui accède à la valeur actuelle d'un contexte
  // Syntaxe : useContext(Context)
  // AuthContext fournit l'état de l'utilisateur (user) et la fonction logout
  // user est un objet (ex. { email: 'user@example.com', ... }) ou null si non connecté
  // logout est une fonction asynchrone pour déconnecter l'utilisateur
  const { user, logout } = useContext(AuthContext);

  // Récupère totalCartItems depuis CartContext via useContext
  // Fournit une valeur par défaut { totalCartItems: 0 } pour éviter les erreurs si le contexte est indéfini
  // Syntaxe : useContext(Context) || defaultValue utilise l'opérateur || pour fournir une valeur de secours
  // totalCartItems est un nombre représentant la somme des quantités dans le panier
  const cartContext = useContext(CartContext) || { totalCartItems: 0 };
  const { totalCartItems } = cartContext;

  // Crée une fonction navigate à partir du hook useNavigate
  // useNavigate retourne une fonction pour rediriger l'utilisateur vers une autre URL
  // Syntaxe : navigate(path, [options])
  // Exemple : navigate('/') redirige vers la page d'accueil
  const navigate = useNavigate();

  /**
   * Fonction : LogOut
   * Description : Déconnecte l'utilisateur en appelant la fonction logout d'AuthContext, redirige vers la page d'accueil,
   * et ferme le menu burger. Gère les erreurs potentielles lors de la déconnexion.
   * Paramètres : Aucun (déclenchée par un événement onClick)
   * Retour : Aucun (effet secondaire : déconnexion, navigation, mise à jour de l'état)
   */
  const LogOut = async () => {
    try {
      // Appelle logout, une fonction asynchrone d'AuthContext qui déconnecte l'utilisateur
      // Syntaxe : await fonction() attend la résolution d'une promesse
      await logout();
      // Redirige vers la page d'accueil
      navigate('/');
      // Ferme le menu en mettant menuOpen à false
      setMenuOpen(false);
    } catch (error) {
      // Journalise l'erreur pour débogage si logout échoue
      // Syntaxe : console.error(message, erreur)
      console.error(error);
    }
  };

  /**
   * Fonction : handleClick
   * Description : Redirige l'utilisateur vers une page spécifiée et ferme le menu burger.
   * Paramètres :
   * - page : Chaîne représentant le chemin URL (ex. '/signup')
   * Retour : Aucun (effet secondaire : navigation, mise à jour de l'état)
   */
  const handleClick = (page) => {
    // Redirige vers le chemin spécifié
    navigate(page);
    // Ferme le menu
    setMenuOpen(false);
  };

  /**
   * Variable : authLinks
   * Description : Contient les liens d'authentification conditionnels basés sur l'état de l'utilisateur.
   * Si user est défini (utilisateur connecté), affiche les liens Profil et Déconnexion.
   * Sinon, affiche les liens Se connecter et S'inscrire.
   * Utilise un fragment (<>) pour regrouper les éléments sans balise DOM supplémentaire.
   * Retour : JSX contenant les liens d'authentification
   */
  const authLinks = user ? (
    // Fragment pour regrouper les éléments
    <>
      {/* Lien vers la page de profil */}
      <li>
        <Link to="/profil" onClick={() => setMenuOpen(false)}>
          {/* StyledH2 affiche le texte 'Profil' */}
          <StyledH2>Profil</StyledH2>
        </Link>
      </li>
      {/* Bouton de déconnexion */}
      <li>
        <Button text="Déconnexion" height="30px" width="90px" onClick={LogOut} />
      </li>
    </>
  ) : (
    // Si l'utilisateur n'est pas connecté
    <>
      {/* Lien vers la page de connexion */}
      <li>
        <Link to="/LogIn" onClick={() => setMenuOpen(false)}>
          <StyledH2>Se connecter</StyledH2>
        </Link>
      </li>
      {/* Bouton pour s'inscrire */}
      <li>
        <Button
          text="S'inscrire"
          height="30px"
          width="90px"
          onClick={() => handleClick('/signup')}
        />
      </li>
    </>
  );

  /**
   * Variable : otherLinks
   * Description : Contient la liste des liens de navigation principaux pour le menu burger.
   * Inclut des liens vers toutes les pages principales de l'application, organisés dans une liste non ordonnée.
   * Chaque lien ferme le menu lorsqu'il est cliqué.
   * Retour : JSX contenant une liste <ul> avec des liens
   */
  const otherLinks = (
    // Liste non ordonnée pour les liens
    <ul>
      {/* Lien vers la page d'accueil */}
      <li>
        <Link to="/" onClick={() => setMenuOpen(false)}>
          <StyledH2>Accueil</StyledH2>
        </Link>
      </li>
      {/* Lien vers la page de contact */}
      <li>
        <Link to="/contact" onClick={() => setMenuOpen(false)}>
          <StyledH2>Contact</StyledH2>
        </Link>
      </li>
      {/* Lien vers la page des abonnements */}
      <li>
        <Link to="/subscription" onClick={() => setMenuOpen(false)}>
          <StyledH2>Abonnement</StyledH2>
        </Link>
      </li>
      {/* Lien vers la page des produits */}
      <li>
        <Link to="/produit" onClick={() => setMenuOpen(false)}>
          <StyledH2>Produit</StyledH2>
        </Link>
      </li>
      {/* Lien vers la page du panier */}
      <li>
        <Link to="/panier" onClick={() => setMenuOpen(false)}>
          <StyledH2>Panier</StyledH2>
        </Link>
      </li>
      {/* Lien vers la page de checkout */}
      <li>
        <Link to="/checkout" onClick={() => setMenuOpen(false)}>
          <StyledH2>Checkout</StyledH2>
        </Link>
      </li>
      {/* Lien vers la page de paiement */}
      <li>
        <Link to="/paiement" onClick={() => setMenuOpen(false)}>
          <StyledH2>Paiement</StyledH2>
        </Link>
      </li>
      {/* Lien vers la page des cours */}
      <li>
        <Link to="/courses" onClick={() => setMenuOpen(false)}>
          <StyledH2>Cours</StyledH2>
        </Link>
      </li>
      {/* Lien vers la page de sélection de cours */}
      <li>
        <Link to="/course-selection/:courseName" onClick={() => setMenuOpen(false)}>
          <StyledH2>Sélection de Cours</StyledH2>
        </Link>
      </li>
      {/* Lien vers la page de profil */}
      <li>
        <Link to="/profil" onClick={() => setMenuOpen(false)}>
          <StyledH2>Profil</StyledH2>
        </Link>
      </li>
      {/* Lien vers la page des cours inscrits */}
      <li>
        <Link to="/courses-inscrits" onClick={() => setMenuOpen(false)}>
          <StyledH2>Cours Inscrits</StyledH2>
        </Link>
      </li>
      {/* Lien vers la page de modification du profil */}
      <li>
        <Link to="/profil/edit" onClick={() => setMenuOpen(false)}>
          <StyledH2>Modifier Profil</StyledH2>
        </Link>
      </li>
      {/* Lien vers la page des commandes */}
      <li>
        <Link to="/commandes" onClick={() => setMenuOpen(false)}>
          <StyledH2>Commandes</StyledH2>
        </Link>
      </li>
    </ul>
  );

  /**
   * Rendu JSX du composant
   * Description : Structure le menu burger avec un en-tête (BurgerHeader) contenant l'icône du menu, les liens
   * d'authentification, et l'icône du panier avec un badge indiquant totalCartItems. Le panneau de navigation
   * (BurgerMenuContainer) s'ouvre/ferme selon l'état menuOpen et affiche les liens principaux.
   * Retour : JSX contenant l'en-tête et le panneau de navigation
   */
  return (
    // Fragment (<>) regroupe les éléments sans ajouter de balise DOM
    <>
      {/* BurgerHeader contient l'icône du menu, les liens d'authentification, et l'icône du panier */}
      <BurgerHeader scrolled={scrolled}>
        {/* BurgerIcon déclenche l'ouverture/fermeture du menu au clic */}
        <BurgerIcon onClick={() => setMenuOpen(!menuOpen)} />
        {/* Liste des liens d'authentification */}
        <ul style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
          {authLinks}
        </ul>
        {/* Lien vers la page du panier avec icône et badge */}
        <Link to="/panier" aria-label="Voir le panier" style={{ textDecoration: 'none' }}>
          <CartIconWrapper>
            {/* Panier utilise une icône FontAwesome */}
            <Panier className="fas fa-shopping-cart">
              {/* Affiche un badge si totalCartItems > 0 */}
              {totalCartItems > 0 && <CartBadge>{totalCartItems}</CartBadge>}
            </Panier>
          </CartIconWrapper>
        </Link>
      </BurgerHeader>

      {/* BurgerMenuContainer affiche le panneau de navigation lorsqu'il est ouvert */}
      <BurgerMenuContainer isOpen={menuOpen} scrolled={scrolled}>
        {otherLinks}
      </BurgerMenuContainer>
    </>
  );
};

/** Exportation du composant BurgerMenu pour utilisation dans l'application */
export default BurgerMenu;