/**
 * Fichier : CommandesPage.jsx
 * Description : Composant React pour afficher l'historique des commandes de l'utilisateur. Récupère les commandes
 * via une requête API, affiche chaque commande avec sa date, son total, son numéro, et les produits associés.
 * Inclut un bouton pour retourner au profil et des boutons pour voir les détails des produits.
 */

import React, { useState, useEffect } from 'react'; // Importe React, useState pour gérer l'état, useEffect pour les effets secondaires
import { useNavigate } from 'react-router-dom'; // Importe useNavigate pour la navigation programmatique
import axios from '../../services/axios'; // Importe l'instance Axios configurée pour les requêtes API
import styled from 'styled-components'; // Importe styled-components pour les styles CSS

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

const OrdersContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    padding: 0 10px;
    gap: 15px;
  }
`;

const OrderBlock = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  @media (max-width: 768px) {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const OrderHeader = styled.div`
  background-color: #f5f5f5;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 10px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const OrderHeaderText = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: #000000;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const OrderProducts = styled.div`
  padding: 15px;
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    padding: 10px;
    gap: 10px;
  }
`;

const ProductItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ProductInfo = styled.div`
  flex: 1;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ProductName = styled.p`
  font-size: 14px;
  font-weight: bold;
  color: #000000;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const ViewProductButton = styled.button`
  width: 120px;
  height: 30px;
  background-color: #9a1b14;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background-color: #000000;
  }

  @media (max-width: 768px) {
    width: 100px;
    height: 28px;
    font-size: 11px;
  }
`;

const NoOrdersMessage = styled.p`
  font-size: 16px;
  color: #000000;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

/**
 * Composant : CommandesPage
 * Description : Affiche l'historique des commandes de l'utilisateur, récupéré via une requête GET à /user/orders.
 * Chaque commande est présentée dans un bloc avec sa date, son total, son numéro, et les produits associés.
 * Inclut un bouton pour retourner à la page de profil et des boutons pour naviguer vers les pages des produits.
 * Retour : JSX contenant la liste des commandes ou un message si aucune commande n'est trouvée
 */
const CommandesPage = () => {
  // Crée une fonction navigate pour rediriger l'utilisateur (ex. : vers /profil ou /produit/:id)
  const navigate = useNavigate();

  // Crée un état orders pour stocker la liste des commandes récupérées depuis l'API
  // Initialisé comme un tableau vide, car aucune commande n'est connue au départ
  const [orders, setOrders] = useState([]);

  /**
   * Effet : Récupération des commandes
   * Description : Envoie une requête GET à l'endpoint /user/orders pour récupérer l'historique des commandes
   * de l'utilisateur authentifié. Met à jour l'état orders avec les données reçues.
   * Dépendances : [] (exécuté une seule fois au montage)
   */
  useEffect(() => {
    // Définit une fonction asynchrone pour récupérer les commandes
    const fetchOrders = async () => {
      try {
        // Envoie une requête GET à /user/orders en utilisant l'instance Axios configurée
        // Axios ajoute automatiquement le token JWT dans l'en-tête Authorization
        const response = await axios.get('/user/orders');

        // Met à jour l'état orders avec la liste des commandes reçue
        // response.data.orders contient un tableau d'objets (ex. : { id_achat, date_achat, ... })
        setOrders(response.data.orders);
      } catch (error) {
        // Journalise l'erreur pour débogage
        // Peut inclure des erreurs réseau, token invalide, ou serveur indisponible
        console.error('Erreur lors de la récupération des commandes:', error);
      }
    };

    // Exécute la fonction pour récupérer les commandes
    fetchOrders();
  }, []); // Tableau vide pour exécution unique au montage du composant

  /**
   * Fonction : handleViewProduct
   * Description : Redirige l'utilisateur vers la page détaillée d'un produit spécifique en utilisant son ID.
   * Arguments :
   * - id_produit : ID unique du produit à afficher
   * Retour : Aucun
   */
  const handleViewProduct = (id_produit) => {
    // Navigue vers la route /produit/:id_produit pour afficher la page du produit
    // Exemple : /produit/123
    navigate(`/produit/${id_produit}`);
  };

  // Début du rendu JSX
  return (
    // Conteneur principal de la page, centré et occupant toute la hauteur
    <PageContainer>
      {/* Bouton pour retourner à la page de profil */}
      <ReturnButton onClick={() => navigate('/profil')}>Retour</ReturnButton>
      
      {/* Titre de la page */}
      <Title>Mes Commandes</Title>
      
      {/* Vérifie si des commandes existent */}
      {orders.length === 0 ? (
        // Affiche un message si aucune commande n'est trouvée
        <NoOrdersMessage>Aucune commande trouvée.</NoOrdersMessage>
      ) : (
        // Affiche la liste des commandes
        <OrdersContainer>
          {/* Mappe chaque commande pour afficher un bloc */}
          {orders.map((order) => (
            // Bloc pour une commande individuelle, avec une clé unique basée sur id_achat
            <OrderBlock key={order.id_achat}>
              {/* En-tête de la commande avec date, total, et numéro */}
              <OrderHeader>
                {/* Date de la commande, formatée au format JJ/MM/AAAA */}
                <OrderHeaderText>
                  Commande du {new Date(order.date_achat).toLocaleDateString('fr-FR')}
                </OrderHeaderText>
                
                {/* Total de la commande, calculé comme quantité * prix unitaire */}
                <OrderHeaderText>TOTAL {(order.quantite_achat * order.prix_produit).toFixed(2)} EUR</OrderHeaderText>
                
                {/* Numéro unique de la commande */}
                <OrderHeaderText>Commande numéro : {order.id_achat}</OrderHeaderText>
              </OrderHeader>
              
              {/* Liste des produits de la commande */}
              <OrderProducts>
                {/* Élément pour un produit spécifique */}
                <ProductItem>
                  {/* Informations sur le produit */}
                  <ProductInfo>
                    {/* Nom du produit et quantité commandée */}
                    <ProductName>{order.nom_produit} (x{order.quantite_achat})</ProductName>
                  </ProductInfo>
                  {/* Bouton pour voir les détails du produit */}
                  <ViewProductButton onClick={() => handleViewProduct(order.id_produit)}>
                    Voir produit
                  </ViewProductButton>
                </ProductItem>
              </OrderProducts>
            </OrderBlock>
          ))}
        </OrdersContainer>
      )}
    </PageContainer>
  );
};

// Exporte le composant CommandesPage pour utilisation dans les routes
export default CommandesPage;