/**
 * Fichier : Produit.jsx
 * Description : Composant React pour la page des produits dans FitnessDev. Affiche une grille de produits disponibles,
 * permet de sélectionner la quantité pour chaque produit et de les ajouter au panier via CartContext. Inclut une navigation
 * optionnelle vers la page du panier après ajout. Intégré avec Panier.jsx et Checkout.jsx pour la gestion des commandes.
 * Inclut des styles responsifs pour mobile. Remplace ProductPage.jsx dans la branche Trey.
 * Contexte : Projet FitnessDev, aligné avec la branche Trey.
 * Dépendances : react (composant, hooks), styled-components (styles), react-router-dom (navigation), CartContext (panier), images des produits.
 */

/** Importation des dépendances nécessaires */
import React, { useState, useContext } from 'react'; // React pour la création du composant, useState pour gérer l’état local, useContext pour accéder au contexte
import { useNavigate } from 'react-router-dom'; // useNavigate pour rediriger l’utilisateur
import styled from 'styled-components'; // styled-components pour créer des styles dynamiques
import { CartContext } from '../../contexts/CartContext'; // Contexte pour gérer les articles du panier

// Importation des images des produits depuis le dossier assets
import fitness from '../../assets/images/fitness.webp'; // Image pour "Gilet zippé Code - Noir"
import blue_hoodie from '../../assets/images/blue_hoodie.png'; // Image pour "Pull à capuche Strike - Bleu marine"
import cut_offs from '../../assets/images/cut_offs.jpg'; // Image pour "Coupe de compression Apex - Rouge"
import leggings_black from '../../assets/images/leggings_black.webp'; // Image pour "Leggings de femme - Black"

/**
 * Liste des produits disponibles
 * Description : Tableau statique définissant les produits affichés, avec leurs identifiants, noms, prix, et images.
 * Chaque produit est un objet avec les propriétés suivantes :
 * - id : Identifiant unique (ex. 1)
 * - name : Nom du produit (ex. 'Leggings de femme - Black')
 * - price : Prix unitaire en euros (ex. 5.99)
 * - image : Chemin vers l’image du produit (ex. leggings_black)
 */
const products = [
  { id: 1, name: 'Leggings de femme - Black', price: 5.99, image: leggings_black },
  { id: 2, name: 'Gilet zippé Code - Noir', price: 9.99, image: fitness },
  { id: 3, name: 'Pull à capuche Strike - Bleu marine', price: 24.99, image: blue_hoodie },
  { id: 4, name: 'Coupe de compression Apex - Rouge', price: 9.99, image: cut_offs },
];

/** Définition des composants stylisés avec styled-components */
const MainContainer = styled.main`
  background-color: #333333;
  padding: 5%;
  min-height: 100vh;
  @media (max-width: 600px) {
    padding: 3%;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px 16px;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const ProductCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  background-color: #333333;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  top: 20%;
  overflow: hidden;
  ::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
  @media (max-width: 600px) {
    top: 10%;
    padding: 6px;
  }
`;

const StyledImg = styled.img`
  border-radius: 20px;
  width: 100%;
  height: 70%;
  object-fit: cover;
  @media (max-width: 600px) {
    height: 60%;
  }
`;

const ContentWrapper = styled.div`
  padding: 8px;
  margin-top: 5%;
  @media (max-width: 600px) {
    padding: 6px;
    margin-top: 3%;
  }
`;

const ProductName = styled.h3`
  font-size: 24px;
  font-weight: 500;
  color: #ffffff;
  @media (max-width: 600px) {
    font-size: 20px;
  }
`;

const ProductPrice = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin-top: 10%;
  @media (max-width: 600px) {
    font-size: 14px;
    margin-top: 8%;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20%;
  @media (max-width: 600px) {
    margin-top: 15%;
  }
`;

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ffffff;
  border-radius: 8px;
  @media (max-width: 600px) {
    border-radius: 6px;
  }
`;

const QuantityButton = styled.button`
  padding: 4px 10px;
  background-color: transparent;
  color: #ffffff;
  border: 1px solid #ffffff;
  cursor: pointer;
  @media (max-width: 600px) {
    padding: 3px 8px;
  }
`;

const QuantityText = styled.span`
  color: #ffffff;
  padding: 2px 20px;
  @media (max-width: 600px) {
    padding: 2px 15px;
  }
`;

const AddToCartButton = styled.button`
  padding: 4px 12px;
  background-color: #2563eb;
  color: #ffffff;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #1d4ed8;
  }
  @media (max-width: 600px) {
    padding: 3px 10px;
  }
`;

/**
 * Composant : ProductItem
 * Description : Sous-composant représentant un produit individuel dans la grille. Affiche l’image, le nom, le prix,
 * un contrôle de quantité, et un bouton pour ajouter au panier. Gère la quantité et le prix dynamiquement via l’état local.
 * Paramètres :
 * - name : Nom du produit (ex. 'Leggings de femme - Black')
 * - price : Prix unitaire du produit (ex. 5.99)
 * - image : Chemin vers l’image du produit (ex. leggings_black)
 * - id : Identifiant unique du produit (ex. 1)
 * Retour : JSX représentant une carte produit avec ses contrôles
 */
const ProductItem = ({ name, price: basePrice, image, id }) => {
  // Crée un état local quantity avec useState pour suivre la quantité sélectionnée
  // Initialisé à 1, représentant un article par défaut
  // setQuantity est la fonction pour mettre à jour cet état
  // Syntaxe : const [state, setState] = useState(initialValue)
  const [quantity, setQuantity] = useState(1);

  // Crée un état local currentPrice pour suivre le prix courant
  // Initialisé au prix de base (basePrice), ajusté dynamiquement avec la quantité
  const [currentPrice, setCurrentPrice] = useState(basePrice);

  // Crée une fonction navigate à partir du hook useNavigate
  // useNavigate retourne une fonction pour rediriger l’utilisateur
  // Syntaxe : navigate(path, options)
  const navigate = useNavigate();

  // Récupère la fonction addToCart depuis CartContext pour ajouter des articles au panier
  // useContext accède à CartContext défini dans src/contexts/CartContext.js
  const { addToCart } = useContext(CartContext);

  /**
   * Fonction : handleAddToCart
   * Description : Ajoute le produit au panier via CartContext avec la quantité et le prix courant.
   * Journalise l’ajout pour débogage et peut rediriger vers la page du panier (commenté).
   * Paramètres : Aucun (déclenchée par un événement onClick)
   * Retour : Aucun (effet secondaire : ajout au panier, journalisation, navigation optionnelle)
   */
  const handleAddToCart = () => {
    // addToCart ajoute un objet au panier avec les propriétés id, name, price, image, quantity
    // Syntaxe : addToCart(item)
    // Argument : Objet représentant l’article à ajouter
    addToCart({ id, name, price: currentPrice, image, quantity });
    // Navigation vers /panier commentée pour éviter une redirection automatique
    // navigate('/panier');
  };

  /**
   * Fonction : decreaseQuantity
   * Description : Diminue la quantité du produit si elle est supérieure à 1 et ajuste le prix courant.
   * Paramètres : Aucun (déclenchée par un événement onClick)
   * Retour : Aucun (effet secondaire : mise à jour de quantity et currentPrice)
   */
  const decreaseQuantity = () => {
    // Vérifie si quantity est supérieur à 1 pour éviter des quantités négatives
    if (quantity > 1) {
      // setQuantity met à jour l’état quantity en diminuant de 1
      // Syntaxe : setState(newValue)
      setQuantity(quantity - 1);
      // setCurrentPrice divise le prix par 2 (logique spécifique, peut-être à revoir)
      setCurrentPrice(currentPrice / 2);
    }
  };

  /**
   * Fonction : increaseQuantity
   * Description : Augmente la quantité du produit et ajuste le prix courant.
   * Paramètres : Aucun (déclenchée par un événement onClick)
   * Retour : Aucun (effet secondaire : mise à jour de quantity et currentPrice)
   */
  const increaseQuantity = () => {
    // setQuantity augmente quantity de 1
    setQuantity(quantity + 1);
    // setCurrentPrice multiplie le prix par 2 (logique spécifique, peut-être à revoir)
    setCurrentPrice(currentPrice * 2);
  };

  /**
   * Rendu JSX du sous-composant
   * Description : Affiche une carte produit avec l’image, le nom, le prix, un contrôle de quantité, et un bouton d’ajout au panier.
   * Retour : JSX représentant une carte produit
   */
  return (
    <ProductCard>
      {/* Affiche l’image du produit */}
      <StyledImg src={image} alt={name} />
      <ContentWrapper>
        {/* Affiche le nom du produit */}
        <ProductName>{name}</ProductName>
        {/* Affiche le prix courant formaté avec 2 décimales */}
        <ProductPrice>€{currentPrice.toFixed(2)}</ProductPrice>
        <ButtonContainer>
          {/* Contrôle de quantité avec boutons + et - */}
          <QuantityContainer>
            <QuantityButton onClick={decreaseQuantity}>-</QuantityButton>
            <QuantityText>{quantity}</QuantityText>
            <QuantityButton onClick={increaseQuantity}>+</QuantityButton>
          </QuantityContainer>
          {/* Bouton pour ajouter au panier */}
          <AddToCartButton onClick={handleAddToCart}>Add to Cart</AddToCartButton>
        </ButtonContainer>
      </ContentWrapper>
    </ProductCard>
  );
};

/**
 * Composant : Produit
 * Description : Affiche une grille de produits disponibles, utilisant le sous-composant ProductItem pour chaque produit.
 * Parcourt la liste statique des produits et rend une carte pour chacun.
 * Paramètres : Aucun
 * Retour : JSX représentant la page des produits avec une grille de cartes
 */
const Produit = () => {
  return (
    <MainContainer>
      <GridContainer>
        {/* Parcourt products avec map pour afficher chaque produit */}
        {products.map((product) => (
          // ProductItem rend une carte produit
          <ProductItem
            key={product.id} // Clé unique pour chaque produit
            id={product.id} // Identifiant du produit
            name={product.name} // Nom du produit
            price={product.price} // Prix unitaire
            image={product.image} // Image du produit
          />
        ))}
      </GridContainer>
    </MainContainer>
  );
};

/** Exportation du composant Produit pour utilisation dans les routes */
export default Produit;