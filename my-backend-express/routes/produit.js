/**
 * Fichier : produit.js
 * Description : Module de routes Express pour gérer les produits. Fournit des endpoints pour récupérer
 * tous les produits ou un produit par nom, et pour ajouter de nouveaux produits en évitant les doublons.
 */

const express = require('express'); // Importe Express
const router = express.Router(); // Crée un routeur
const pool = require('../config/db'); // Importe l'instance Pool

/**
 * Route : GET /
 * Description : Récupère tous les produits ou un produit spécifique par nom.
 * Retourne une liste de produits ou une erreur 404 si non trouvé.
 */
router.get('/', async (req, res) => {
    // Extrait le paramètre nom depuis req.query
    const { nom } = req.query;

    try {
        // Déclare une variable pour le résultat
        let result;

        // Vérifie si un nom est fourni
        if (nom) {
            // Recherche un produit par nom exact
            result = await pool.query(
                'SELECT * FROM produit WHERE nom_produit = $1',
                [nom]
            );
            // Si aucun produit trouvé, renvoie une erreur 404
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Produit non trouvé' });
            }
        } else {
            // Récupère tous les produits
            result = await pool.query('SELECT * FROM produit');
        }

        // Renvoie la liste des produits
        res.json(result.rows);
    } catch (err) {
        // Journalise l'erreur
        console.error(err);
        // Renvoie une erreur 500
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

/**
 * Route : POST /add
 * Description : Ajoute un ou plusieurs nouveaux produits à la table produit.
 * Vérifie les doublons et ignore les produits invalides.
 */
router.post('/add', async (req, res) => {
    try {
        // Récupère les produits du corps de la requête
        let produits = req.body;

        // Convertit en tableau si un seul produit est envoyé
        if (!Array.isArray(produits)) {
            produits = [produits];
        }

        // Tableau pour stocker les produits insérés
        const inserted = [];

        // Boucle sur chaque produit
        for (const prod of produits) {
            // Extrait nom et prix
            const { nom_produit, prix_produit } = prod;

            // Ignore les produits invalides (nom vide ou manquant, prix manquant)
            if (!nom_produit || !prix_produit || nom_produit.trim() === "") {
                continue;
            }

            // Vérifie si le produit existe déjà
            const produitCheck = await pool.query(
                'SELECT * FROM produit WHERE nom_produit = $1',
                [nom_produit]
            );

            // Ignore si le produit existe
            if (produitCheck.rows.length > 0) {
                continue;
            }

            // Insère le nouveau produit
            const newProduit = await pool.query(
                `INSERT INTO produit (nom_produit, prix_produit)
                 VALUES ($1, $2) RETURNING *`,
                [nom_produit, prix_produit]
            );

            // Ajoute le produit inséré à la liste
            inserted.push(newProduit.rows[0]);
        }

        // Renvoie une réponse 201 avec les produits ajoutés
        res.status(201).json({
            message: `${inserted.length} produit(s) ajouté(s)`,
            produits: inserted
        });

    } catch (err) {
        // Journalise l'erreur
        console.error(err);
        // Renvoie une erreur 500
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Exporte le routeur
module.exports = router;