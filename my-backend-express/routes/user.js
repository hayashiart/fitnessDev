/**
 * Fichier : user.js
 * Description : Module de routes Express pour gérer les opérations liées aux utilisateurs.
 * Fournit des endpoints pour récupérer le profil, les cours précédents, mettre à jour le profil,
 * annuler une inscription à un cours, et récupérer les achats.
 */

const express = require('express'); // Importe Express
const router = express.Router(); // Crée un routeur
const authMiddleware = require('../middleware/auth'); // Importe le middleware d'authentification
const pool = require('../config/db'); // Importe l'instance Pool
const bcrypt = require('bcrypt'); // Importe bcrypt pour hacher les mots de passe

/**
 * Route : GET /profil
 * Description : Récupère les informations du profil de l'utilisateur authentifié.
 * Exclut le mot de passe de la réponse.
 */
router.get('/profil', authMiddleware, async (req, res) => {
    try {
        // Récupère l'ID de l'utilisateur depuis le token JWT
        const userId = req.user.id_inscrit;
        
        // Recherche l'utilisateur dans la table INSCRIT
        const result = await pool.query('SELECT * FROM inscrit WHERE id_inscrit = $1', [userId]);
        
        // Vérifie si l'utilisateur existe
        if (result.rows.length > 0) {
            // Extrait les données de l'utilisateur
            const user = result.rows[0];
            // Exclut le mot de passe de la réponse
            const { mdp_inscrit, ...userWithout } = user;
            // Renvoie les données
            res.json({
                message: 'Profil récupéré avec succès',
                user: userWithout,
            });
        } else {
            // Renvoie une erreur 404 si non trouvé
            res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
    } catch (error) {
        // Journalise l'erreur
        console.error(error);
        // Renvoie une erreur 500
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

/**
 * Route : GET /previous-courses
 * Description : Récupère la liste des cours auxquels l'utilisateur est inscrit.
 * Trie les cours par date décroissante.
 */
router.get('/previous-courses', authMiddleware, async (req, res) => {
    try {
        // Récupère l'ID de l'utilisateur
        const userId = req.user.id_inscrit;
        console.log('Utilisateur connecté :', req.user);
        console.log('ID utilisateur dans la requête :', req.user.id_inscrit);
        console.log('Exécution de la requête SQL pour id_inscrit:', userId);
        // Requête SQL pour joindre INSCRIPTION et COURS
        const result = await pool.query(
            `
            SELECT c.nom_cours, c.datetime_cours, c.id_cours
            FROM INSCRIPTION i
            JOIN COURS c ON i.id_cours = c.id_cours
            WHERE i.id_inscrit = $1
            ORDER BY c.datetime_cours DESC
            `,
            [userId]
        );
        
        // Journalise les cours pour débogage
        console.log('Cours envoyés:', result.rows);
        
        // Renvoie la liste des cours
        res.json({
            message: 'Inscriptions récupérées avec succès',
            courses: result.rows,
        });
    } catch (error) {
        // Journalise l'erreur
        console.error(error);
        // Renvoie une erreur 500
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

/**
 * Route : PUT /profil
 * Description : Met à jour les informations du profil de l'utilisateur.
 * Construit dynamiquement la requête SQL pour mettre à jour uniquement les champs fournis.
 */
router.put('/profil', authMiddleware, async (req, res) => {
    // Extrait les données du corps de la requête
    const {
        civilite,
        name,
        firstname,
        phone,
        email,
        password,
        adress,
        recaptchaToken,
    } = req.body;

    try {
        // Vérifie le token reCAPTCHA
        if (!recaptchaToken) {
            return res.status(400).json({ message: 'reCAPTCHA requis' });
        }

        // Construit la requête SQL dynamiquement
        let query = 'UPDATE INSCRIT SET ';
        const values = [];
        let paramIndex = 1;

        // Ajoute chaque champ s'il est fourni
        if (civilite) {
            query += `type_inscrit = $${paramIndex}, `;
            values.push(civilite);
            paramIndex++;
        }
        if (name) {
            query += `nom_inscrit = $${paramIndex}, `;
            values.push(name);
            paramIndex++;
        }
        if (firstname) {
            query += `prenom_inscrit = $${paramIndex}, `;
            values.push(firstname);
            paramIndex++;
        }
        if (phone) {
            query += `telephone_inscrit = $${paramIndex}, `;
            values.push(phone);
            paramIndex++;
        }
        if (email) {
            query += `email_inscrit = $${paramIndex}, `;
            values.push(email);
            paramIndex++;
        }
        if (password) {
            // Hache le nouveau mot de passe
            const hashedPassword = await bcrypt.hash(password, 10);
            query += `mdp_inscrit = $${paramIndex}, `;
            values.push(hashedPassword);
            paramIndex++;
        }
        if (adress) {
            query += `adresse_inscrit = $${paramIndex}, `;
            values.push(adress);
            paramIndex++;
        }

        // Journalise la requête et les valeurs pour débogage
        console.log('Requête SQL:', query);
        console.log('Valeurs SQL:', values);

        // Supprime la virgule finale et ajoute la condition WHERE
        query = query.slice(0, -2);
        query += ` WHERE id_inscrit = $${paramIndex} RETURNING *`;
        values.push(req.user.id_inscrit);

        // Exécute la requête
        const result = await pool.query(query, values);
        
        // Vérifie si l'utilisateur a été trouvé
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Exclut le mot de passe de la réponse
        const user = result.rows[0];
        const { mdp_inscrit, ...userWithout } = user;

        // Renvoie les données mises à jour
        res.json({
            message: 'Profil mis à jour avec succès',
            user: userWithout,
        });
    } catch (err) {
        // Journalise l'erreur
        console.error('Erreur lors de la mise à jour du profil:', err);
        // Renvoie une erreur 500
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

/**
 * Route : DELETE /course/:id_cours
 * Description : Annule l'inscription de l'utilisateur à un cours spécifique.
 */
router.delete('/course/:id_cours', authMiddleware, async (req, res) => {
    try {
        // Récupère l'ID de l'utilisateur et du cours
        const userId = req.user.id_inscrit;
        const courseId = req.params.id_cours;
        
        // Journalise pour débogage
        console.log('Tentative de suppression - id_inscrit:', userId, 'id_cours:', courseId);
        
        // Supprime l'inscription
        const result = await pool.query(
            `
            DELETE FROM INSCRIPTION
            WHERE id_inscrit = $1 AND id_cours = $2
            RETURNING *
            `,
            [userId, courseId]
        );

        // Vérifie si une inscription a été supprimée
        if (result.rowCount === 0) {
            console.log('Aucune inscription trouvée pour id_inscrit:', userId, 'id_cours:', courseId);
            return res.status(404).json({ message: 'Inscription non trouvée' });
        }

        // Journalise la suppression
        console.log('Inscription supprimée:', result.rows[0]);
        
        // Renvoie un message de succès
        res.json({
            message: 'Inscription annulée avec succès',
        });
    } catch (error) {
        // Journalise l'erreur
        console.error('Erreur lors de l\'annulation de l\'inscription:', error);
        // Renvoie une erreur 500
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

/**
 * Route : GET /orders
 * Description : Récupère l'historique des achats de l'utilisateur.
 */
router.get('/orders', authMiddleware, async (req, res) => {
    try {
        // Récupère l'ID de l'utilisateur
        const userId = req.user.id;
        
        // Requête SQL pour joindre ACHAT et PRODUIT
        const result = await pool.query(
            `
            SELECT 
                a.id_achat,
                a.date_achat,
                a.quantite_achat,
                p.id_produit,
                p.nom_produit,
                p.prix_produit
            FROM ACHAT a
            JOIN PRODUIT p ON a.id_produit = p.id_produit
            WHERE a.id_inscrit = $1
            ORDER BY a.date_achat DESC
            `,
            [userId]
        );

        // Journalise les achats
        console.log('Achats envoyés:', result.rows);
        
        // Renvoie la liste des achats
        res.json({
            message: 'Achats récupérés avec succès',
            orders: result.rows,
        });
    } catch (error) {
        // Journalise l'erreur
        console.error('Erreur lors de la récupération des achats:', error);
        // Renvoie une erreur 500
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Exporte le routeur
module.exports = router;