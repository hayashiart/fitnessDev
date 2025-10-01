/**
 * Fichier : CartContext.jsx
 * Description : Composant React définissant le contexte du panier pour l'application FitnessDev. Fournit un contexte (CartContext)
 * pour gérer les articles du panier, ajouter des articles, et calculer le nombre total d'articles. Persiste les données du panier
 * dans localStorage pour maintenir l'état entre les rechargements de page. Utilisé par des composants comme Panier.jsx, Produit.jsx,
 * Checkout.jsx, et BurgerMenu.jsx dans la branche Trey.
 * Contexte : Projet FitnessDev, aligné avec la branche Trey pour un flux de commande cohérent.
 * Dépendances : react (composant, hooks useState et useEffect pour gérer l'état et les effets secondaires).
 */

/** Importation des dépendances nécessaires */
import React, { createContext, useState, useEffect } from 'react'; // React pour créer des composants, createContext pour définir le contexte, useState pour l'état, useEffect pour les effets secondaires

/**
 * Création du contexte CartContext
 * Description : createContext est une fonction React qui crée un objet de contexte utilisé pour partager des données entre
 * composants sans passer par des props. CartContext sera utilisé pour fournir cartItems, addToCart, et totalCartItems.
 * Syntaxe : createContext(defaultValue)
 * Argument : defaultValue (valeur par défaut si aucun Provider n'est trouvé, ici undefined implicitement)
 * Retour : Objet de contexte avec Provider et Consumer
 */
export const CartContext = createContext();

/**
 * Composant : CartProvider
 * Description : Fournit le contexte CartContext à ses composants enfants via CartContext.Provider. Gère l'état du panier
 * (cartItems), une fonction pour ajouter/modifier des articles (addToCart), et le nombre total d'articles (totalCartItems).
 * Persiste cartItems dans localStorage pour maintenir l'état entre les sessions. Inclut totalCartItems pour corriger l'erreur
 * dans BurgerMenu.jsx.
 * Paramètres :
 * - children : Composants enfants (JSX) qui auront accès au contexte
 * Retour : JSX contenant le Provider avec les valeurs du contexte et les enfants
 */
export const CartProvider = ({ children }) => {
  // Crée un état local cartItems avec useState pour stocker les articles du panier
  // useState est un hook React qui retourne un tableau avec l'état actuel et une fonction pour le mettre à jour
  // Syntaxe : const [state, setState] = useState(initialValue)
  // initialValue est une fonction qui initialise cartItems en récupérant les données depuis localStorage
  // localStorage.getItem('cartItems') récupère la chaîne JSON stockée sous la clé 'cartItems'
  // JSON.parse(savedCart) convertit la chaîne JSON en tableau JavaScript, ou [] si savedCart est null
  // Exemple : cartItems peut être [{ id: 1, name: 'Leggings', price: 5.99, quantity: 2 }, ...]
  const [cartItems, setCartItems] = useState(() => {
    // Syntaxe : localStorage.getItem(key)
    // Retour : Chaîne (ou null si la clé n'existe pas)
    const savedCart = localStorage.getItem('cartItems');
    // Syntaxe : savedCart ? JSON.parse(savedCart) : []
    // Retour : Tableau d'articles si savedCart existe, sinon tableau vide
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Calcule le nombre total d'articles dans le panier
  // reduce est une méthode de tableau qui parcourt chaque élément pour produire une valeur unique
  // Syntaxe : array.reduce(callback, initialValue)
  // Arguments :
  // - callback : Fonction exécutée pour chaque élément, prend (accumulateur, élément, index, tableau)
  // - initialValue : Valeur initiale de l'accumulateur (ici 0)
  // Callback arguments :
  // - total : Accumulateur, somme courante des quantités (initialisé à 0)
  // - item : Élément courant du tableau cartItems (ex. { id: 1, name: 'Leggings', quantity: 2 })
  // Retour : Nombre, somme des quantités
  // item.quantity || 1 utilise l'opérateur || pour fournir 1 si quantity est undefined
  const totalCartItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  /**
   * Effet : Persistance des articles du panier dans localStorage
   * Description : Utilise useEffect pour sauvegarder cartItems dans localStorage à chaque changement.
   * Dépendances : [cartItems]
   * Retour : Aucun (effet secondaire : mise à jour de localStorage)
   */
  useEffect(() => {
    // JSON.stringify(cartItems) convertit le tableau cartItems en chaîne JSON
    // Syntaxe : JSON.stringify(value)
    // Retour : Chaîne JSON représentant cartItems (ex. '[{"id":1,"name":"Leggings","quantity":2}]')
    // localStorage.setItem('cartItems', ...) enregistre la chaîne sous la clé 'cartItems'
    // Syntaxe : localStorage.setItem(key, value)
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]); // Dépendance : cartItems, l'effet se déclenche à chaque changement de cartItems

  /**
   * Fonction : addToCart
   * Description : Ajoute un article au panier ou met à jour sa quantité s'il existe déjà. Accepte soit un nouvel article
   * (objet), soit un tableau d'articles pour remplacer le panier. Met à jour l'état cartItems.
   * Paramètres :
   * - item : Objet représentant un article (ex. { id: 1, name: 'Leggings', quantity: 2 }) ou tableau d'articles
   * Retour : Aucun (effet secondaire : mise à jour de cartItems)
   */
  const addToCart = (item) => {
    // Array.isArray(item) vérifie si item est un tableau
    // Syntaxe : Array.isArray(value)
    // Retour : Booléen (true si tableau, false sinon)
    if (Array.isArray(item)) {
      // Si item est un tableau, remplace cartItems par ce tableau
      // setCartItems met à jour l'état avec le nouveau tableau
      setCartItems(item);
    } else {
      // Sinon, traite item comme un seul article
      // findIndex est une méthode de tableau qui retourne l'index du premier élément satisfaisant une condition
      // Syntaxe : array.findIndex(callback)
      // Callback arguments : cartItem (élément courant), index, array
      // Retour : Index de l'élément (ou -1 si non trouvé)
      // Vérifie si un article avec le même id existe déjà
      const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

      // Vérifie si l'article existe déjà (index !== -1)
      if (existingItemIndex !== -1) {
        // Crée une copie du tableau cartItems pour éviter de muter l'état directement
        // Syntaxe : [...array] utilise l'opérateur spread pour créer un nouveau tableau
        const updatedItems = [...cartItems];
        // Met à jour l'article existant en ajoutant la quantité de l'article entrant
        // Syntaxe : objet = { ...objet, propriété: valeur } utilise spread pour copier et mettre à jour
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex], // Copie les propriétés existantes
          quantity: updatedItems[existingItemIndex].quantity + item.quantity, // Additionne les quantités
        };
        // Met à jour l'état cartItems avec le nouveau tableau
        setCartItems(updatedItems);
      } else {
        // Si l'article n'existe pas, l'ajoute à la fin du tableau
        // Syntaxe : [...array, élément] ajoute un élément au nouveau tableau
        setCartItems([...cartItems, item]);
      }
    }
  };

  /**
   * Rendu JSX du composant
   * Description : Enveloppe les composants enfants dans CartContext.Provider, fournissant cartItems, addToCart, et
   * totalCartItems via la prop value. Les enfants accèdent à ces valeurs via useContext(CartContext).
   * Retour : JSX contenant le Provider et les composants enfants
   */
  return (
    // CartContext.Provider est un composant spécial qui fournit le contexte aux descendants
    // Syntaxe : <Context.Provider value={valeur}>{enfants}</Context.Provider>
    // value est un objet contenant les données partagées (cartItems, addToCart, totalCartItems)
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart, totalCartItems }}>
      {/* children représente les composants enfants passés au CartProvider */}
      {children}
    </CartContext.Provider>
  );
};