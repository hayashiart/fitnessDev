/**
 * Fichier : db.js
 * Description : Module Node.js pour configurer et exporter une instance Pool de connexion à une base de données
 * PostgreSQL en utilisant le module pg. Lit les paramètres de connexion depuis .env pour une configuration sécurisée.
 * L'instance Pool est utilisée dans d'autres fichiers pour exécuter des requêtes SQL.
 */

// Importe la classe Pool du module pg (node-postgres)
// Pool gère un ensemble de connexions réutilisables pour éviter d'ouvrir/fermer des connexions à chaque requête
const { Pool } = require('pg');

// Charge les variables d'environnement depuis le fichier .env
// Exemple : DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT
// dotenv lit .env et les stocke dans process.env
require('dotenv').config();

// Crée une nouvelle instance de Pool avec les paramètres de connexion
// Syntaxe : new Pool(config)
// config : Objet contenant les paramètres de connexion à PostgreSQL
const pool = new Pool({
    // Utilisateur de la base (ex. : postgres), lu depuis .env.
    // process.env.DB_USER récupère la valeur de DB_USER dans .env.
    user: process.env.DB_USER || 'postgres',
    // Hôte de la base (ex. : localhost), où PostgreSQL est exécuté.
    host: process.env.DB_HOST || 'postgres',
    // Nom de la base (ex. : fitness_dev).
    database: process.env.DB_NAME || 'FitnessDev_db',
    // Mot de passe de l'utilisateur PostgreSQL.
    password: process.env.DB_PASSWORD || 'Dgp7.dgp7',
    // Port de PostgreSQL (par défaut 5432).
    port: process.env.DB_PORT || 5432,
});

// Exporte l'instance pool pour qu'elle soit utilisée dans d'autres fichiers
// module.exports permet à d'autres modules d'importer pool via require('./db')
module.exports = pool;