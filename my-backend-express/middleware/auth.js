/**
 * Fichier : auth.js
 * Description : Module Node.js définissant un middleware Express pour authentifier les requêtes en vérifiant
 * un token JWT (JSON Web Token) inclus dans l'en-tête Authorization. Si le token est valide, les données
 * décodées sont ajoutées à req.user pour les routes protégées.
 */

// Importe le module jsonwebtoken pour créer, vérifier et décoder les tokens JWT
// JWT est un standard pour transmettre des informations signées (ex. : identité utilisateur)
const jwt = require('jsonwebtoken');

// Charge les variables d'environnement depuis .env
// JWT_SECRET est la clé secrète utilisée pour signer/vérifier les tokens
require('dotenv').config();

// Définit une fonction middleware authenticateToken pour vérifier les tokens JWT
// Arguments :
// - req : Objet requête, contient les en-têtes (ex. : Authorization)
// - res : Objet réponse, pour envoyer des erreurs ou réponses
// - next : Fonction pour passer au middleware ou à la route suivante
const authenticateToken = (req, res, next) => {
    // Récupère l'en-tête Authorization depuis req.headers
    // Format attendu : "Authorization: Bearer <token>"
    // req.headers['authorization'] accède à l'en-tête en minuscules (HTTP headers sont case-insensitive)
    const authHeader = req.headers['authorization'];

    // Extrait le token de l'en-tête
    // Syntaxe : authHeader && authHeader.split(' ')[1]
    // - authHeader : Vérifie que l'en-tête existe pour éviter les erreurs
    // - split(' ') : Divise la chaîne en tableau (ex. : ["Bearer", "<token>"])
    // - [1] : Prend le deuxième élément, le token lui-même
    const token = authHeader && authHeader.split(' ')[1];

    // Vérifie si un token a été fourni
    // Si token est undefined ou null, renvoie une erreur HTTP 401 (Unauthorized)
    if (!token) return res.status(401).json({ message: 'Token manquant' });

    // Vérifie la validité du token avec jwt.verify
    // Syntaxe : jwt.verify(token, secret, callback)
    // - token : La chaîne JWT à vérifier
    // - secret : La clé secrète (process.env.JWT_SECRET) utilisée pour la signature
    // - callback : Fonction appelée avec err (erreur) ou user (données décodées)
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        // Vérifie si une erreur s'est produite (ex. : token expiré, invalide)
        // Si err existe, renvoie une erreur HTTP 403 (Forbidden)
        if (err) return res.status(403).json({ message: 'Token invalide' });

        // Ajoute les données décodées du token à req.user
        // user contient les informations encodées (ex. : { id_inscrit: 1, email_inscrit: "user@example.com" })
        req.user = user;

        // Appelle next() pour passer au middleware ou à la route suivante
        // Sans next(), la requête reste bloquée
        next();
    });
};

// Exporte le middleware pour qu'il soit utilisé dans les routes
// Exemple : Dans user.js pour protéger /user/profil
module.exports = authenticateToken;