const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const pool = require('../config/db');



router.get('/check', authMiddleware, async (req, res) => {
    const id_inscrit = req.user.id_inscrit;

    try {
        const result = await pool.query(
            `SELECT a.*, t.nom_type_abonnement 
             FROM abonnement a
             JOIN type_abonnement t ON a.id_type_abonnement = t.id_type_abonnement
             WHERE a.id_inscrit = $1 AND a.actif_abonnement = true`,
            [id_inscrit]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Aucun abonnement actif trouvé" });
        }

        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});



router.post('/subscribe', authMiddleware, async (req, res) => {
    const { 
        duree_abonnement,
        datedebut_abonnement,
        datefin_abonnement,
        prix_abonnement,
        actif_abonnement = true,
        id_type_abonnement,
        type_paiement,
    } = req.body;

    const id_inscrit = req.user.id_inscrit;
    console.log(id_inscrit)
    try {
        
        const check = await pool.query(
            `SELECT * FROM abonnement WHERE id_inscrit = $1 AND actif_abonnement = true`,
            [id_inscrit]
        );

        if (check.rows.length > 0) {
            return res.status(400).json({ message: "Un abonnement actif existe déjà" });
        }

        
        const newAbonnement = await pool.query(
            `INSERT INTO abonnement (
                duree_abonnement, datedebut_abonnement, datefin_abonnement, 
                prix_abonnement, actif_abonnement, id_type_abonnement, id_inscrit
            ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [
                duree_abonnement,
                datedebut_abonnement,
                datefin_abonnement,
                prix_abonnement,
                actif_abonnement,
                id_type_abonnement,
                id_inscrit      
            ]   
        );

        const abonnement = newAbonnement.rows[0];

        
        const newPaiement = await pool.query(`
            INSERT INTO paiement (
                montant_paiement, date_paiement, type_paiement,
                id_abonnement, id_inscrit
            ) VALUES ($1, CURRENT_DATE, $2, $3, $4) RETURNING *`,
            [
                prix_abonnement,
                type_paiement,
                abonnement.id_abonnement,
                id_inscrit
            ]
        );

        res.status(201).json({
            message: "Abonnement et paiement créés avec succès",
            abonnement,
            paiement: newPaiement.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});



router.put('/cancel', authMiddleware, async (req, res) => {
    const id_inscrit = req.user.id_inscrit;

    try {
        const result = await pool.query(
            `UPDATE abonnement 
             SET actif_abonnement = false 
             WHERE id_inscrit = $1 AND actif_abonnement = true 
             RETURNING *`,
            [id_inscrit]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Aucun abonnement actif à annuler" });
        }

        res.json({
            message: "Abonnement annulé avec succès",
            abonnement: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});


module.exports = router;
