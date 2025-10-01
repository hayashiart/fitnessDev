/**
 * Fichier : bookings.js
 * Description : Module de routes Express pour gérer les réservations de cours. Fournit un endpoint POST
 * pour créer une réservation, en vérifiant ou en créant un cours si nécessaire, et en enregistrant l'inscription.
 * Requiert un token JWT.
 */

const express = require('express'); // Importe Express
const router = express.Router(); // Crée un routeur
const authMiddleware = require('../middleware/auth'); // Importe le middleware d'authentification
const pool = require('../config/db'); // Importe l'instance Pool

/**
 * Route : POST /
 * Description : Crée une réservation pour un cours en vérifiant si le cours existe, en le créant si nécessaire,
 * et en enregistrant l'inscription dans la table INSCRIPTION. Requiert un token JWT.
 */
router.post('/', authMiddleware, async (req, res) => {
    // Extrait les données du corps de la requête
    const { courseName, date, time, duration } = req.body;
    console.log(req.body);
    // Récupère l'ID de l'utilisateur depuis le token JWT
    const id_inscrit = req.user.id_inscrit;
    
    // Vérifie si l'utilisateur est authentifié
    if (!id_inscrit) {
        // Renvoie une erreur 401 si aucun ID
        return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    // Vérifie que toutes les données requises sont fournies
    if (!courseName || !date || !time || !duration) {
        // Renvoie une erreur 400 si des données manquent
        return res.status(400).json({ error: 'Données manquantes : courseName, date, time, ou duration requis' });
    }

    try {
        // Vérifie si le cours existe dans la table COURS
        // TO_TIMESTAMP convertit la date et l'heure en timestamp PostgreSQL
        let { rows } = await pool.query(
            'SELECT id_cours FROM COURS WHERE nom_cours = $1 AND datetime_cours = TO_TIMESTAMP($2 || \' \' || $3, \'DD/MM/YYYY HH24:MI\')',
            [courseName, date, time]
        );

        let id_cours;
        if (rows.length === 0) {
            // Si le cours n'existe pas, crée un nouveau cours
            // Définit un mappage des cours aux IDs des coachs
            const coachMap = {
                'Cours Collectifs': 1, // Anna
                'Pole Dance': 2, // Marc
                'Crosstraining': 3, // Léa
                'Boxe': 4, // Paul
                'Haltérophilie': 5, // Sophie
                'MMA': 6 // Lucas
            };

            // Vérifie si le nom du cours est valide
            if (!coachMap[courseName]) {
                // Renvoie une erreur 400 si le cours n'est pas reconnu
                return res.status(400).json({ error: 'Nom de cours invalide' });
            }

            // Insère un nouveau cours dans la table COURS
            const result = await pool.query(
                'INSERT INTO COURS (nom_cours, duree_cours, datetime_cours, prix_cours, id_coach) VALUES ($1, $2, TO_TIMESTAMP($3 || \' \' || $4, \'DD/MM/YYYY HH24:MI\'), $5, $6) RETURNING id_cours',
                [courseName, 120, date, time, 0, coachMap[courseName]]
            );
            // Récupère l'ID du cours créé
            id_cours = result.rows[0].id_cours;
        } else {
            // Si le cours existe, récupère son ID
            id_cours = rows[0].id_cours;
        }

        // Insère l'inscription dans la table INSCRIPTION
        await pool.query(
            'INSERT INTO INSCRIPTION (date_inscription, id_inscrit, id_cours) VALUES (NOW(), $1, $2)',
            [id_inscrit, id_cours]
        );

        // Renvoie une réponse 201 avec un message de succès
        res.status(201).json({ message: 'Réservation enregistrée' });
    } catch (error) {
        // Journalise l'erreur
        console.error('Erreur lors de la réservation :', error);
        // Renvoie une erreur 500 avec le message
        res.status(500).json({ error: error.message });
    }
});

// Exporte le routeur
module.exports = router;