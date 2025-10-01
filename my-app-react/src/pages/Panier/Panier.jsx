/**
 * Fichier : Panier.jsx
 * Description : Composant React pour la page du panier dans FitnessDev. Affiche les articles ajoutés, permet de modifier
 * les quantités, d’ajouter d’autres produits via la page Produit, et de passer à la validation via la page Checkout.
 * Gère les erreurs si les données du panier sont invalides et affiche un message si le panier est vide. Utilise CartContext
 * pour gérer les articles et react-router-dom pour la navigation. Inclut des styles responsifs pour mobile.
 * Contexte : Projet FitnessDev, aligné avec la branche Trey pour intégrer avec Produit.jsx et Checkout.jsx.
 * Dépendances : react (composant, hooks), styled-components (styles), react-router-dom (navigation), CartContext (panier).
 */

/** Importation des dépendances nécessaires */
import React, { useContext, useEffect } from 'react'; // React pour la création du composant, useContext pour accéder au contexte, useEffect pour les effets secondaires
import { useNavigate } from 'react-router-dom'; // useNavigate pour rediriger l'utilisateur
import styled from 'styled-components'; // styled-components pour créer des styles dynamiques
import { CartContext } from '../../contexts/CartContext'; // Contexte pour gérer les articles du panier

/** Définition des composants stylisés avec styled-components */
const PanierContainer = styled.div`
  background-color: #ffffff;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 15%;
  @media (max-width: 600px) {
    padding: 10px;
    margin-top: 10%;
  }
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  @media (max-width: 600px) {
    padding: 10px;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 15px;
  @media (max-width: 600px) {
    width: 60px;
    height: 60px;
    margin-right: 0;
    margin-bottom: 10px;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  @media (max-width: 600px) {
    gap: 3px;
  }
`;

const ItemTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  @media (max-width: 600px) {
    font-size: 16px;
  }
`;

const ItemDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.4;
  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

const ItemPrice = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const DecorativeBar = styled.div`
  width: 50px;
  height: 8px;
  background-color: #d3d3d3;
  border-radius: 4px;
  margin: 5px 0;
  @media (max-width: 600px) {
    width: 40px;
  }
`;

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  @media (max-width: 600px) {
    margin-top: 5px;
  }
`;

const QuantityButton = styled.button`
  padding: 5px 10px;
  background-color: #f0f0f0;
  color: #333;
  border: none;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #e0e0e0;
  }
  @media (max-width: 600px) {
    padding: 3px 8px;
    font-size: 14px;
  }
`;

const QuantityText = styled.span`
  padding: 5px 15px;
  color: #333;
  font-size: 16px;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  @media (max-width: 600px) {
    padding: 3px 10px;
    font-size: 14px;
  }
`;

const EmptyBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  @media (max-width: 600px) {
    height: 80px;
  }
`;

const AddIcon = styled.div`
  font-size: 40px;
  color: #666;
  @media (max-width: 600px) {
    font-size: 30px;
  }
`;

const SummarySection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #d3d3d3;
  border-radius: 8px;
  @media (max-width: 600px) {
    padding: 10px;
    flex-direction: column;
    gap: 10px;
  }
`;

const ThinLine = styled.hr`
  border: none;
  border-top: 1px solid #d3d3d3;
  margin: 20px 0;
  @media (max-width: 600px) {
    margin: 15px 0;
  }
`;

const TotalText = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  @media (max-width: 600px) {
    font-size: 16px;
  }
`;

const ValiderButton = styled.button`
  background-color: #000000;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  @media (max-width: 600px) {
    padding: 6px 12px;
  }
`;

const ValiderText = styled.span`
  color: #ff0000;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

/**
 * Composant : Panier
 * Description : Affiche la page du panier, montrant les articles ajoutés, permettant de modifier les quantités,
 * d’ajouter d’autres produits via la page Produit, et de passer à la validation via la page Checkout.
 * Gère les erreurs si les données du panier sont invalides et affiche un message si le panier est vide.
 * Paramètres : Aucun
 * Retour : JSX représentant la page du panier avec les articles, un bouton pour ajouter des produits, et un bouton de validation
 */
const Panier = () => {
  // Déstructure l’objet retourné par useContext(CartContext) pour obtenir cartItems (tableau des articles) et addToCart (fonction pour modifier le panier)
  // Fournit une valeur par défaut { cartItems: [], addToCart: () => {} } pour éviter les erreurs si le contexte n’est pas chargé
  // Syntaxe : useContext(Context) retourne la valeur actuelle du contexte
  const { cartItems, addToCart } = useContext(CartContext) || { cartItems: [], addToCart: () => {} };

  // Crée une fonction navigate à partir du hook useNavigate
  // useNavigate retourne une fonction permettant de rediriger l’utilisateur vers une autre URL
  // Syntaxe : navigate(path, options)
  const navigate = useNavigate();

  /**
   * Effet : Journalisation des articles du panier
   * Description : Utilise useEffect pour journaliser les articles du panier à chaque changement, facilitant le débogage.
   * Dépendances : [cartItems]
   * Retour : Aucun (effet secondaire : journalisation)
   */
  useEffect(() => {
    // console.log journalise les articles du panier
    // Argument : Message et valeur de cartItems (tableau d’objets)
    console.log('Panier - Cart Items:', cartItems);
  }, [cartItems]); // Dépendance : cartItems, relance l’effet si cartItems change

  /**
   * Fonction : handleQuantityChange
   * Description : Modifie la quantité d’un article dans le panier ou le supprime si la quantité est inférieure à 1.
   * Paramètres :
   * - itemId : Identifiant unique de l’article (ex. 1)
   * - newQuantity : Nouvelle quantité souhaitée (ex. 2)
   * Retour : Aucun (effet secondaire : mise à jour du panier via addToCart)
   */
  const handleQuantityChange = (itemId, newQuantity) => {
    // Vérifie si la nouvelle quantité est inférieure à 1
    // Syntaxe : if (condition) { bloc }
    if (newQuantity < 1) {
      // filter est une méthode de tableau qui crée un nouveau tableau excluant les éléments ne satisfaisant pas la condition
      // Syntaxe : array.filter(callback)
      // Callback arguments : item (élément courant), index, array
      // Retour : Nouveau tableau sans l’article avec itemId
      const updatedItems = cartItems.filter((item) => item.id !== itemId);
      // addToCart met à jour le panier avec le nouveau tableau
      addToCart(updatedItems);
    } else {
      // map est une méthode de tableau qui crée un nouveau tableau en transformant chaque élément
      // Syntaxe : array.map(callback)
      // Callback arguments : item (élément courant), index, array
      // Retour : Nouveau tableau avec l’article mis à jour
      const updatedItems = cartItems.map((item) =>
        // Vérifie si l’ID de l’article correspond à itemId
        item.id === itemId ? { ...item, quantity: newQuantity } : item // Opérateur spread (...item) copie les propriétés, quantity est mis à jour
      );
      // addToCart met à jour le panier
      addToCart(updatedItems);
    }
  };

  /**
   * Fonction : handleAddMoreItems
   * Description : Redirige l’utilisateur vers la page Produit pour ajouter d’autres articles au panier.
   * Paramètres : Aucun (déclenchée par un événement onClick)
   * Retour : Aucun (effet secondaire : navigation)
   */
  const handleAddMoreItems = () => {
    // console.log journalise la navigation pour débogage
    // Argument : Message
    console.log('Navigating to Produit page');
    // navigate redirige vers /produit
    // Arguments : Chemin ('/produit'), options ({ replace: false } pour ajouter à l’historique)
    navigate('/produit', { replace: false });
  };

  /**
   * Fonction : handleValidate
   * Description : Redirige l’utilisateur vers la page Checkout pour valider la commande.
   * Paramètres : Aucun (déclenchée par un événement onClick)
   * Retour : Aucun (effet secondaire : navigation)
   */
  const handleValidate = () => {
    // console.log journalise la navigation pour débogage
    console.log('Navigating to checkout');
    // navigate redirige vers /checkout
    navigate('/checkout');
  };

  /**
   * Calcul du total du panier
   * Description : Somme les prix des articles (prix unitaire * quantité) pour afficher le montant total.
   * Variable :
   * - totalSum : Total du panier, calculé avec reduce
   */
  // reduce parcourt cartItems pour calculer le total
  // Syntaxe : array.reduce(callback, initialValue)
  // Callback arguments : total (accumulateur), item (élément courant)
  // Retour : Nombre, somme des prix * quantités
  const totalSum = cartItems.reduce((total, item) => {
    // item.quantity || 1 fournit 1 si quantity est undefined
    // item.price * (item.quantity || 1) calcule le coût de l’article
    return total + (item.price * (item.quantity || 1));
  }, 0); // 0 est la valeur initiale de total

  /**
   * Vérification des données du panier
   * Description : S’assure que cartItems est un tableau pour éviter les erreurs de rendu.
   * Si cartItems n’est pas un tableau, affiche un message d’erreur et un bouton pour ajouter des produits.
   * Retour : JSX avec un message d’erreur ou le contenu du panier
   */
  // Array.isArray vérifie si cartItems est un tableau
  // Syntaxe : Array.isArray(value)
  // Retour : Booléen (true si tableau, false sinon)
  if (!Array.isArray(cartItems)) {
    // console.error journalise l’erreur pour débogage
    console.error('cartItems is not an array:', cartItems);
    return (
      <PanierContainer>
        {/* Paragraphe avec style inline pour centrer le texte et définir la couleur */}
        <p style={{ textAlign: 'center', color: '#666' }}>
          Une erreur s'est produite. Veuillez réessayer.
        </p>
        {/* EmptyBlock déclenche handleAddMoreItems au clic */}
        <EmptyBlock onClick={handleAddMoreItems}>
          <AddIcon>+</AddIcon>
        </EmptyBlock>
      </PanierContainer>
    );
  }

  /**
   * Rendu JSX du composant
   * Description : Structure la page avec une liste des articles du panier, des descriptions personnalisées,
   * des contrôles de quantité, un bouton pour ajouter des produits, et un résumé avec le bouton de validation.
   * Affiche un message si le panier est vide.
   * Retour : JSX représentant la page du panier
   */
  console.log('Rendering Panier page'); // Journalise le rendu pour débogage
  return (
    <PanierContainer>
      {/* Vérifie si cartItems est vide avec length === 0 */}
      {cartItems.length === 0 ? (
        // Si vide, affiche un paragraphe avec style inline
        <p style={{ textAlign: 'center', color: '#666' }}>Votre panier est vide.</p>
      ) : (
        // Sinon, parcourt cartItems avec map
        cartItems.map((item) => {
          // Vérifie que l’article est valide pour éviter les erreurs
          if (!item || !item.id || !item.name || !item.image) {
            // console.warn journalise un avertissement
            console.warn('Invalid cart item:', item);
            return null; // Ignore les articles invalides
          }
          return (
            // CartItem contient l’image, les détails, et les contrôles de quantité
            <CartItem key={item.id}>
              <ItemImage
                src={item.image} // Source de l’image
                alt={item.name} // Texte alternatif
                onError={(e) => {
                  console.error('Failed to load image:', item.image);
                  e.target.style.display = 'none';
                }}
              />
              <ItemDetails>
                <ItemTitle>{item.name}</ItemTitle>
                <ItemDescription>
                  {/* Descriptions personnalisées conditionnelles */}
                  {item.name === 'Leggings de femme - Black' &&
                    'Notre collection Tech revient à l’essentiel, avec une coupe décontractée et un style décoratif et contrasté.'}
                  {item.name === 'Gilet zippé Code - Noir' &&
                    'Notre shaker pour compléments alimentaires vous aide à rester hydraté tout au long de la journée, et la boule de mélange a été conçue pour vous offrir un shake lisse quel que soit le complément que vous mélangez.'}
                  {item.name === 'Pull à capuche Strike - Bleu marine' &&
                    'Nos manchons de compression en néoprène peuvent aider à réduire les tensions, les douleurs et l’inconfort au niveau du genou sans limiter l’amplitude de vos mouvements.'}
                  {item.name === 'Coupe de compression Apex - Rouge' &&
                    'Nos manchons de compression en néoprène peuvent aider à réduire les tensions, les douleurs et l’inconfort au niveau du genou sans limiter l’amplitude de vos mouvements.'}
                </ItemDescription>
                <DecorativeBar />
                {/* Affiche le prix total de l’article avec 2 décimales */}
                <ItemPrice>€{(item.price * (item.quantity || 1)).toFixed(2)}</ItemPrice>
              </ItemDetails>
              <QuantityContainer>
                {/* Bouton pour diminuer la quantité */}
                <QuantityButton
                  onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                >
                  -
                </QuantityButton>
                <QuantityText>{item.quantity || 1}</QuantityText>
                {/* Bouton pour augmenter la quantité */}
                <QuantityButton
                  onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                >
                  +
                </QuantityButton>
              </QuantityContainer>
            </CartItem>
          );
        })
      )}
      <EmptyBlock onClick={handleAddMoreItems}>
        <AddIcon>+</AddIcon>
      </EmptyBlock>
      <ThinLine />
      <SummarySection>
        <TotalText>Total: €{totalSum.toFixed(2)}</TotalText>
        <ValiderButton onClick={handleValidate}>
          <ValiderText>VALIDER</ValiderText>
        </ValiderButton>
      </SummarySection>
      <ThinLine />
    </PanierContainer>
  );
};

/** Exportation du composant Panier pour utilisation dans les routes */
export default Panier;