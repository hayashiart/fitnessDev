/**
 * Fichier : Checkout.jsx
 * Description : Composant React pour la page de validation de commande dans FitnessDev. Affiche les articles du panier,
 * permet de sélectionner une option de livraison et un mode de paiement, calcule le total, et valide la commande.
 * Utilise CartContext pour gérer le panier et react-router-dom pour la navigation. Inclut des styles responsifs pour mobile.
 * Contexte : Projet FitnessDev, aligné avec la branche Trey pour intégrer avec Panier.jsx, Produit.jsx, et Paiement.jsx.
 * Dépendances : react (composant, hooks), styled-components (styles), react-router-dom (navigation), CartContext (panier).
 */

/** Importation des dépendances nécessaires */
import React, { useState, useContext } from 'react'; // React pour la création du composant, useState pour gérer l'état local, useContext pour accéder au contexte
import styled from 'styled-components'; // styled-components pour créer des styles dynamiques
import { CartContext } from '../../contexts/CartContext'; // Contexte pour gérer les articles du panier
import { useNavigate } from 'react-router-dom'; // useNavigate pour rediriger l'utilisateur après validation

/** Définition des composants stylisés avec styled-components */
const CheckoutContainer = styled.div`
  background-color: #ffffff;
  min-height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 84px;
  @media (max-width: 600px) {
    padding: 10px;
    margin-top: 60px;
  }
`;

const SectionTitle = styled.h2`
  background-color: #000000;
  color: #ffffff;
  padding: 10px 20px;
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
  width: 100%;
  text-align: center;
  margin: 20px 0;
  @media (max-width: 600px) {
    font-size: 16px;
    padding: 8px 15px;
  }
`;

const CartItemsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  @media (max-width: 600px) {
    gap: 10px;
  }
`;

const CartItemImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  @media (max-width: 600px) {
    width: 80px;
    height: 80px;
  }
`;

const ShippingOptionsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  @media (max-width: 600px) {
    gap: 10px;
  }
`;

const ShippingOption = styled.label`
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  width: 200px;
  text-align: center;
  cursor: pointer;
  border: 2px solid ${({ checked }) => (checked ? '#000000' : '#cccccc')};
  @media (max-width: 600px) {
    width: 150px;
    padding: 10px;
  }
`;

const ShippingTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 10px 0;
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const ShippingPrice = styled.p`
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

const ShippingTime = styled.p`
  font-size: 12px;
  color: #666;
  margin: 5px 0 0 0;
  @media (max-width: 600px) {
    font-size: 10px;
  }
`;

const RadioInput = styled.input`
  margin-right: 10px;
  @media (max-width: 600px) {
    margin-right: 8px;
  }
`;

const PaymentMethodsContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
  @media (max-width: 600px) {
    max-width: 100%;
  }
`;

const PaymentOption = styled.label`
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #cccccc;
  cursor: pointer;
  @media (max-width: 600px) {
    padding: 8px;
  }
`;

const PaymentText = styled.span`
  font-size: 16px;
  font-weight: 500;
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const PaymentIcons = styled.div`
  display: flex;
  gap: 10px;
  margin: 10px 0;
  @media (max-width: 600px) {
    gap: 8px;
  }
`;

const PaymentIcon = styled.img`
  height: 30px;
  @media (max-width: 600px) {
    height: 25px;
  }
`;

const TermsText = styled.p`
  font-size: 12px;
  color: #666;
  text-align: center;
  margin: 20px 0;
  @media (max-width: 600px) {
    font-size: 10px;
  }
`;

const SummaryContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  @media (max-width: 600px) {
    gap: 10px;
    flex-direction: column;
  }
`;

const TotalBox = styled.div`
  background-color: #000000;
  color: #ffffff;
  padding: 10px 20px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 4px;
  @media (max-width: 600px) {
    font-size: 16px;
    padding: 8px 15px;
  }
`;

const ValiderButton = styled.button`
  background-color: #ff0000;
  color: #ffffff;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #cc0000;
  }
  @media (max-width: 600px) {
    font-size: 14px;
    padding: 8px 15px;
  }
`;

/**
 * Composant : Checkout
 * Description : Affiche la page de validation de commande, permettant à l'utilisateur de voir les articles du panier,
 * de sélectionner une option de livraison et un mode de paiement, et de valider la commande. Utilise CartContext pour
 * gérer les articles du panier et redirige vers la page d'accueil après validation. Affiche un message d'erreur si
 * l'option de livraison ou le mode de paiement ne sont pas sélectionnés. Inputs contrôlés pour éviter l'avertissement
 * de changement d'état contrôlé/non contrôlé.
 * Paramètres : Aucun
 * Retour : JSX contenant les sections des articles, livraison, paiement, et validation
 */
const Checkout = () => {
  // Déstructure l’objet retourné par useContext(CartContext) pour obtenir cartItems (tableau des articles) et setCartItems (fonction pour modifier le panier)
  // useContext est un hook qui accède au contexte CartContext défini dans src/contexts/CartContext.js
  // cartItems est un tableau d’objets (ex. [{ id: 1, name: 'Leggings', price: 5.99, quantity: 2 }])
  // setCartItems est une fonction pour mettre à jour cartItems
  const { cartItems, setCartItems } = useContext(CartContext);

  // Crée une fonction navigate à partir du hook useNavigate
  // useNavigate retourne une fonction permettant de rediriger l’utilisateur vers une autre URL
  // Syntaxe : navigate(path, [options])
  // Exemple : navigate('/') redirige vers la page d'accueil
  const navigate = useNavigate();

  // Crée un état local selectedShipping avec useState pour suivre l’option de livraison choisie
  // Initialisé avec un objet vide pour éviter les erreurs d’accès à des propriétés indéfinies
  // setSelectedShipping est la fonction pour mettre à jour cet état
  // Syntaxe : const [state, setState] = useState(initialValue)
  // Exemple : selectedShipping peut devenir { name: 'LIVRAISON STANDARD', price: 3.90, time: '9-11 jours ouvrés' }
  const [selectedShipping, setSelectedShipping] = useState({});

  // Crée un état local selectedPayment pour suivre le mode de paiement choisi
  // Initialisé avec un objet vide pour éviter les erreurs
  // setSelectedPayment est la fonction pour mettre à jour cet état
  // Exemple : selectedPayment peut devenir { name: 'Visa ****1269', value: 'visa' }
  const [selectedPayment, setSelectedPayment] = useState({});

  // Définit un tableau statique des options de livraison disponibles
  // Chaque option est un objet avec :
  // - name : Nom de l’option (chaîne, ex. 'LIVRAISON STANDARD')
  // - price : Prix en euros (nombre, ex. 3.90)
  // - time : Délai estimé (chaîne, ex. '9-11 jours ouvrés')
  const shippingOptions = [
    { name: 'LIVRAISON STANDARD', price: 3.90, time: '9-11 jours ouvrés' },
    { name: 'LIVRAISON EXPRESS', price: 7.85, time: '5-7 jours ouvrés' },
    { name: 'LIVRAISON ÉCONOMIQUE', price: 1.99, time: '16-22 jours ouvrés' },
  ];

  // Définit un tableau statique des modes de paiement disponibles
  // Chaque mode est un objet avec :
  // - name : Nom affiché (chaîne, ex. 'Visa ****1269')
  // - value : Valeur unique pour l’input radio (chaîne, ex. 'visa')
  const paymentMethods = [
    { name: 'Visa ****1269', value: 'visa' },
    { name: 'Coupon Limité', value: 'coupon' },
    { name: 'Apple Pay', value: 'apple-pay' },
  ];

  /**
   * Calcul du total de la commande
   * Description : Calcule le total des articles (prix * quantité) et ajoute les frais de livraison si sélectionnés.
   * Variables :
   * - cartTotal : Total des articles, calculé avec reduce
   * - shippingCost : Frais de livraison, 0 si aucune option sélectionnée
   * - totalSum : Total final (articles + livraison)
   */
  // cartItems.reduce est une méthode de tableau qui parcourt chaque élément pour produire une valeur unique
  // Syntaxe : array.reduce(callback, initialValue)
  // Arguments :
  // - callback : Fonction exécutée pour chaque élément, prend (accumulateur, élément, index, tableau)
  // - initialValue : Valeur initiale de l'accumulateur (ici 0)
  // Callback arguments :
  // - total : Accumulateur, somme courante des prix (initialisé à 0)
  // - item : Élément courant du tableau cartItems (ex. { id: 1, name: 'Leggings', price: 5.99, quantity: 2 })
  // Retour : Nombre, somme des prix * quantités
  // item.quantity || 1 utilise l’opérateur || pour fournir 1 si quantity est undefined
  const cartTotal = cartItems.reduce((total, item) => {
    return total + (item.price * (item.quantity || 1));
  }, 0);

  // shippingCost utilise l’opérateur ternaire (? :) pour retourner selectedShipping.price si selectedShipping.name existe, sinon 0
  // Syntaxe : condition ? valeurSiVrai : valeurSiFaux
  // selectedShipping.name vérifie si une option est sélectionnée
  const shippingCost = selectedShipping.name ? selectedShipping.price : 0;

  // totalSum additionne cartTotal et shippingCost
  // Résultat : Nombre représentant le coût total de la commande
  const totalSum = cartTotal + shippingCost;

  /**
   * Fonction : handleValidate
   * Description : Gère le clic sur le bouton "VALIDER". Vérifie que l’option de livraison et le mode de paiement
   * sont sélectionnés, journalise la commande, vide le panier, et redirige vers la page d’accueil.
   * Paramètres : Aucun (fonction déclenchée par un événement onClick)
   * Retour : Aucun (effet secondaire : alerte, journalisation, mise à jour du panier, redirection)
   */
  const handleValidate = () => {
    // Vérifie si l’option de livraison et le mode de paiement sont sélectionnés
    // !selectedShipping.name retourne true si name est undefined, !selectedPayment.value idem
    // || combine les conditions : si l’une est vraie, affiche une alerte
    if (!selectedShipping.name || !selectedPayment.value) {
      // alert est une fonction native du navigateur affichant une boîte de dialogue
      // Argument : Message à afficher
      alert('Veuillez sélectionner une option de livraison et un mode de paiement.');
      return; // Quitte la fonction si la condition n’est pas remplie
    }

    // console.log journalise les détails de la commande pour débogage
    // Argument : Objet contenant cartItems, selectedShipping, selectedPayment, totalSum
    console.log('Order confirmed:', {
      cartItems, // Tableau des articles
      shipping: selectedShipping, // Objet de l’option de livraison
      payment: selectedPayment, // Objet du mode de paiement
      total: totalSum, // Total en euros
    });

    // setCartItems([]) vide le panier en remplaçant cartItems par un tableau vide
    // setCartItems est une fonction de mise à jour d’état fournie par useContext
    setCartItems([]);

    // navigate('/') redirige vers la page d’accueil
    // Argument : Chemin URL ('/')
    navigate('/');
  };

  /**
   * Rendu JSX du composant
   * Description : Structure la page avec des sections pour les articles, les options de livraison, les modes de paiement,
   * les icônes de paiement, les conditions générales, et un résumé avec le bouton de validation.
   * Retour : JSX représentant la page de validation de commande
   */
  return (
    <CheckoutContainer>
      {/* Section des articles du panier */}
      <SectionTitle>COMMANDES</SectionTitle>
      <CartItemsContainer>
        {/* Vérifie si cartItems est vide avec length === 0 */}
        {cartItems.length === 0 ? (
          // Si vide, affiche un paragraphe avec un message
          <p>Votre panier est vide.</p>
        ) : (
          // Sinon, parcourt cartItems avec map pour afficher chaque article
          // map est une méthode de tableau qui crée un nouveau tableau à partir des éléments transformés
          // Syntaxe : array.map(callback)
          // Callback arguments : item (élément courant), index (position), array (tableau)
          // Retour : Tableau de JSX pour chaque article
          cartItems.map((item) => (
            // CartItemImage affiche l’image de l’article
            // key={item.id} est requis par React pour identifier chaque élément dans une liste
            <CartItemImage
              key={item.id} // Clé unique basée sur l’identifiant de l’article
              src={item.image} // Source de l’image (ex. chemin vers leggings_black.webp)
              alt={item.name} // Texte alternatif pour accessibilité
              onError={(e) => {
                // onError est un événement déclenché si l’image ne charge pas
                // e est l’objet d’événement
                console.error('Failed to load image:', item.image); // Journalise l’erreur
                e.target.style.display = 'none'; // Cache l’élément image (modifie le style inline)
              }}
            />
          ))
        )}
      </CartItemsContainer>

      {/* Section des options de livraison */}
      <SectionTitle>LIVRAISON</SectionTitle>
      <ShippingOptionsContainer>
        {/* Parcourt shippingOptions avec map pour afficher chaque option */}
        {shippingOptions.map((option) => (
          // ShippingOption est un label contenant un bouton radio et les détails
          <ShippingOption
            key={option.name} // Clé unique basée sur le nom de l’option
            checked={selectedShipping.name === option.name} // Booléen pour style conditionnel
          >
            {/* RadioInput est un input de type radio pour sélectionner une option */}
            <RadioInput
              type="radio" // Type d’input : bouton radio
              name="shipping" // Nom commun pour grouper les boutons radio
              value={option.name || ''} // Valeur de l’option, chaîne vide si undefined
              checked={selectedShipping.name === option.name} // Booléen pour l’état sélectionné
              onChange={() => setSelectedShipping(option)} // Met à jour selectedShipping avec l’option
            />
            <ShippingTitle>{option.name}</ShippingTitle>
            <ShippingPrice>{option.price.toFixed(2)}€</ShippingPrice>
            <ShippingTime>({option.time})</ShippingTime>
          </ShippingOption>
        ))}
      </ShippingOptionsContainer>

      {/* Section des modes de paiement */}
      <SectionTitle>MODE DE PAIEMENT</SectionTitle>
      <PaymentMethodsContainer>
        {/* Parcourt paymentMethods avec map pour afficher chaque mode */}
        {paymentMethods.map((method) => (
          // PaymentOption est un label contenant un bouton radio et le nom du mode
          <PaymentOption key={method.value}>
            <RadioInput
              type="radio" // Type d’input : bouton radio
              name="payment" // Nom commun pour grouper les boutons radio
              value={method.value || ''} // Valeur du mode, chaîne vide si undefined
              checked={selectedPayment.value === method.value} // Booléen pour l’état sélectionné
              onChange={() => setSelectedPayment(method)} // Met à jour selectedPayment avec le mode
            />
            <PaymentText>{method.name}</PaymentText>
          </PaymentOption>
        ))}
      </PaymentMethodsContainer>

      {/* Icônes des modes de paiement */}
      <PaymentIcons>
        {/* Affiche les icônes des méthodes de paiement disponibles */}
        <PaymentIcon src="/src/assets/images/Visa.png" alt="Visa" />
        <PaymentIcon src="/src/assets/images/mastercard.png" alt="Mastercard" />
        <PaymentIcon src="/src/assets/images/Paypal.jpg" alt="Paypal" />
        <PaymentIcon src="/src/assets/images/Apple_Pay_logo.svg" alt="Apple Pay" />
      </PaymentIcons>

      {/* Texte des conditions générales avec liens */}
      <TermsText>
        En passant cette commande, vous acceptez les{' '}
        {/* Lien placeholder pour les conditions générales */}
        <a href="#" style={{ color: '#000' }}>
          Conditions Générales
        </a>{' '}
        et la{' '}
        {/* Lien placeholder pour la politique de confidentialité */}
        <a href="#" style={{ color: '#000' }}>
          Politique de Confidentialité
        </a>{' '}
        de Fitness Dev
      </TermsText>

      {/* Résumé et bouton de validation */}
      <SummaryContainer>
        {/* Affiche le total formaté avec 2 décimales */}
        <TotalBox>{totalSum.toFixed(2)}€</TotalBox>
        {/* Bouton de validation déclenchant handleValidate */}
        <ValiderButton onClick={handleValidate}>VALIDER</ValiderButton>
      </SummaryContainer>
    </CheckoutContainer>
  );
};

/** Exportation du composant Checkout pour utilisation dans les routes */
export default Checkout;