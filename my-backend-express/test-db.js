/**
 * Fichier : test-db.js
 * Description : Script Node.js pour tester la connexion à une base de données PostgreSQL en utilisant le module pg.
 * Exécute une requête simple (SELECT NOW()) pour vérifier que la connexion fonctionne et affiche l'heure actuelle
 * du serveur de base de données. Ferme la connexion après l'exécution.
 */

// Importe l'instance Pool depuis le fichier ./config/db.js
// Pool est configuré pour gérer les connexions à PostgreSQL (voir db.js)
const pool = require('./config/db');

// Exécute une requête SQL sur la base de données en utilisant la méthode pool.query
// Syntaxe : pool.query(queryText, callback)
// - queryText : La requête SQL à exécuter (ici, 'SELECT NOW()' pour obtenir l'heure actuelle)
// - callback : Fonction appelée avec les résultats ou une erreur
pool.query('SELECT NOW()', (err, res) => {
    // Vérifie si une erreur s'est produite lors de la connexion ou de l'exécution
    // err : Objet erreur, contient des détails comme err.stack (pile d'erreurs)
    if (err) {
        // Affiche l'erreur dans la console avec la pile pour débogage
        // Exemple : "Erreur de connexion : Error: connect ECONNREFUSED 127.0.0.1:5432"
        console.error('Erreur de connexion :', err.stack);
    } else {
        // Si aucune erreur, affiche un message de succès avec le résultat
        // res.rows[0] contient la première ligne du résultat (ici, { now: "2025-04-20T12:34:56.789Z" })
        console.log('Connexion réussie, heure actuelle :', res.rows[0]);
    }
    
    // Ferme le pool de connexions pour libérer les ressources
    // pool.end() termine toutes les connexions actives
    pool.end();
});