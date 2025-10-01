/**
 * Fichier : index.js
 * Description : Point d'entrée principal du serveur backend Node.js avec Express. Configure le serveur HTTP,
 * définit les middlewares (CORS, JSON), monte les routes pour différentes fonctionnalités (authentification,
 * utilisateur, abonnements, produits, achats, réservations), et lance le serveur sur le port 3000.
 */

// Importe le module express, une bibliothèque pour créer des serveurs HTTP en Node.js
// Express simplifie la gestion des routes, des requêtes, et des réponses
const express = require('express');

// Importe le module cors, qui permet de gérer les requêtes cross-origin
// Autorise le frontend (ex. : http://localhost:5173) à communiquer avec le backend
const cors = require('cors');
const helmet = require('helmet');
const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Crée une instance Express
const app = express();

// Middleware de sécurité
app.use(cors({
    origin: ['https://localhost:5173', 'https://backend:5173'],
    credentials: true,
}));
app.use(helmet());
app.use(helmet.hsts({
  maxAge: 63072000, // 2 ans
  includeSubDomains: true,
  preload: true
}));
app.use(express.json()); // Parse JSON

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

// Importe les routes pour la gestion des abonnements utilisateur (ex. : /user/abonnement/check)
const userAbonnementRoutes = require('./routes/abonnement');

// Importe les routes pour les types d'abonnements (ex. : /type_abonnement)
const typeAbonnementRoutes = require('./routes/typeAbonnement');

// Importe les routes pour les produits (ex. : /produit)
const produitRoutes = require('./routes/produit');

// Importe les routes pour les achats (ex. : /user/achat)
const achatRoutes = require('./routes/achat');

app.use('/auth', authRoutes);

// Importe les routes pour les réservations de cours (ex. : /bookings)
const bookingsRoutes = require('./routes/bookings');
// Monte les routes utilisateur sous /user
// Exemple : /user/profil, /user/previous-courses
app.use('/user', userRoutes);

// Monte les routes des abonnements utilisateur sous /user/abonnement
// Exemple : /user/abonnement/check
app.use('/user/abonnement', userAbonnementRoutes);

// Monte les routes des types d'abonnements sous /type_abonnement
// Exemple : /type_abonnement
app.use('/type_abonnement', typeAbonnementRoutes);

// Monte les routes des produits sous /produit
// Exemple : /produit/:id
app.use("/produit", produitRoutes);

// Monte les routes des achats sous /user/achat
// Exemple : /user/achat
app.use("/user/achat", achatRoutes);
// Monte les routes des réservations sous /bookings
// Exemple : /bookings
app.use('/bookings', bookingsRoutes);
// Route de test
app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API Express sécurisée !');
});

// Lecture des certificats SSL
const keyPath = path.join(__dirname, 'certs', 'localhost-key.pem');
const certPath = path.join(__dirname, 'certs', 'localhost.pem');

const privateKey = fs.readFileSync(keyPath, 'utf8');
const certificate = fs.readFileSync(certPath, 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Lancer le serveur HTTPS
const PORT = 3001;
https.createServer(credentials, app).listen(PORT, () => {
  console.log(`✅ Serveur HTTPS démarré sur https://localhost:${PORT}`);
});
