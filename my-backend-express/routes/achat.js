/**
 * Fichier : achat.js
 * Description : Module de routes Express pour gérer les achats des utilisateurs. Fournit un endpoint POST
 * pour créer un achat (panier) avec des produits associés et enregistrer un paiement. Requiert un token JWT.
 */

const express = require('express'); // Importe Express
const router = express.Router(); // Crée un routeur
const authMiddleware = require('../middleware/auth'); // Importe le middleware d'authentification
const pool = require('../config/db'); // Importe l'instance Pool

/**
 * Route : POST /
 * Description : Crée un nouvel achat (panier) pour l'utilisateur, associe des produits à l'achat,
 * calcule le montant total, et enregistre un paiement. Requiert un token JWT.
 */
router.post('/', authMiddleware, async (req, res) => {
    // Récupère l'ID de l'utilisateur depuis le token JWT
    const id_inscrit = req.user.id;

    try {
        // Extrait type_paiement et produits du corps de la requête
        // produits est un tableau d'objets { id_produit, quantite }
        const { type_paiement, produits } = req.body;
        
        // Vérifie si produits est un tableau, sinon le convertit en tableau
        // Permet de gérer un seul produit ou plusieurs
        if (!Array.isArray(produits)) {
            produits = [produits];
        }

        // Crée un nouvel achat dans la table achat
        const panier = await pool.query(
            `INSERT INTO achat(date_achat, id_inscrit)
             VALUES ($1, $2) RETURNING *`,
            [new Date(), id_inscrit] // Date actuelle et ID utilisateur
        );

        // Récupère l'ID de l'achat créé
        const id_achat = panier.rows[0].id_achat;

        // Boucle sur chaque produit pour l'associer à l'achat
        for (const produit of produits) {
            // Extrait l'ID et la quantité du produit
            const { id_produit, quantite } = produit;
            
            // Insère l'association dans la table achat_produit
            const newProduit = await pool.query(
                `INSERT INTO achat_produit (id_achat, id_produit, quantite)
                 VALUES ($1, $2, $3) RETURNING *`,
                [id_achat, id_produit, quantite]
            );
        }

        // Calcule le montant total du panier
        // Joint achat_produit et produit pour multiplier quantité par prix
        const sommePanier = await pool.query(
            `SELECT 
                SUM(ap.quantite * p.prix_produit) AS montant_total
            FROM 
                achat_produit ap
            JOIN 
                produit p ON ap.id_produit = p.id_produit
            WHERE 
                ap.id_achat = $1`,
            [id_achat]
        );

        // Récupère le montant total
        const montant = sommePanier.rows[0].montant_total;

        // Enregistre un paiement dans la table paiement
        const newPaiement = await pool.query(`
            INSERT INTO paiement (
                montant_paiement, date_paiement, type_paiement,
                id_achat, id_inscrit
            ) VALUES ($1, CURRENT_DATE, $2, $3, $4) RETURNING *`,
            [
                montant, // Montant total
                type_paiement, // Type de paiement
                id_achat, // ID de l'achat
                id_inscrit // ID utilisateur
            ]
        );

        // Renvoie une réponse 201 avec les détails
        res.status(201).json({
            message: "Panier et paiement créés avec succès",
            panier: `La somme est de ${montant}`,
            paiement: newPaiement.rows[0]
        });

    } catch (err) {
        // Journalise l'erreur
        console.error(err);
        // Renvoie une erreur 500
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Exporte le routeur
module.exports = router;