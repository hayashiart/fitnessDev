/**
 * Fichier : typeAbonnement.js
 * Description : Module de routes Express pour gérer les types d'abonnements (ex. : ESSENTIAL, ORIGINAL, ULTRA).
 * Fournit un endpoint GET pour récupérer tous les types d'abonnements ou un type spécifique par nom.
 * Interagit avec la table type_abonnement dans PostgreSQL.
 */

const express = require('express'); // Importe Express pour créer un routeur
const router = express.Router(); // Crée une instance de routeur Express
const pool = require('../config/db'); // Importe l'instance Pool pour PostgreSQL

/**
 * Route : GET /
 * Description : Récupère tous les types d'abonnements ou un type spécifique si un paramètre nom est fourni.
 * Le nom est insensible à la casse (ex. : "essential" ou "ESSENTIAL").
 * Retourne une liste de types ou un message d'erreur si non trouvé.
 */
router.get('/', async (req, res) => {
    // Extrait le paramètre nom depuis req.query (ex. : /?nom=ESSENTIAL)
    // req.query est un objet contenant les paramètres de l'URL
    const { nom } = req.query;

    try {
        // Déclare une variable pour stocker le résultat de la requête
        let result;

        // Vérifie si un paramètre nom a été fourni
        if (nom) {
            // Si nom existe, exécute une requête pour trouver un type spécifique
            // LOWER convertit les chaînes en minuscules pour une comparaison insensible à la casse
            result = await pool.query(
                'SELECT * FROM type_abonnement WHERE LOWER(nom_type_abonnement) = LOWER($1)',
                [nom] // $1 est remplacé par la valeur de nom
            );
            
            // Vérifie si aucun type n'a été trouvé
            if (result.rows.length === 0) {
                // Renvoie une erreur 404 avec un message
                return res.status(404).json({ message: 'Type d’abonnement non trouvé' });
            }
        } else {
            // Si aucun nom n'est fourni, récupère tous les types d'abonnements
            result = await pool.query('SELECT * FROM type_abonnement');
        }

        // Renvoie la liste des types d'abonnements
        // result.rows est un tableau d'objets (ex. : [{ id_type_abonnement: 1, nom_type_abonnement: "ESSENTIAL" }])
        res.json(result.rows);
    } catch (err) {
        // Journalise l'erreur pour débogage
        console.error(err);
        // Renvoie une erreur 500 avec le message et les détails
        res.status(500).json({ message: 'Erreur serveur', error: err.message });
    }
});

// Exporte le routeur pour qu'il soit monté dans index.js
module.exports = router;