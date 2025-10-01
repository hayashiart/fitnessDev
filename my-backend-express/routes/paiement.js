/**
 * Fichier : paiement.js
 * Description : Module de routes Express pour gérer les paiements. Fournit un endpoint GET /paiement
 * qui n'est pas encore implémenté. Requiert un token JWT.
 */

const express = require('express'); // Importe Express
const router = express.Router(); // Crée un routeur
const authMiddleware = require('../middleware/auth'); // Importe le middleware d'authentification
const pool = require('../config/db'); // Importe l'instance Pool

/**
 * Route : GET /paiement
 * Description : Endpoint prévu pour récupérer les informations de paiement de l'utilisateur.
 * Non implémenté (corps vide). Requiert un token JWT.
 */
router.get('/paiement', authMiddleware, async (req, res) => {
    // Corps vide : aucune logique implémentée
});

// Exporte le routeur
module.exports = router;