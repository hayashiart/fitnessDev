/**
 * Fichier : verifyRecaptcha.js
 * Description : Middleware Express pour vérifier un token reCAPTCHA envoyé par le frontend. Envoie une requête
 * POST à l'API Google reCAPTCHA pour valider le token et passe au middleware suivant si la vérification réussit.
 * Gère les erreurs (ex. : token manquant, échec de vérification) avec des réponses HTTP appropriées.
 */

// Importe le module node-fetch pour effectuer des requêtes HTTP
// node-fetch permet d'utiliser l'API fetch dans Node.js, similaire à celle des navigateurs
const fetch = require('node-fetch');

/**
 * Middleware : verifyRecaptcha
 * Description : Vérifie un token reCAPTCHA inclus dans le corps de la requête en envoyant une requête POST
 * à l'API Google reCAPTCHA. Si la vérification réussit, passe au middleware suivant ; sinon, renvoie une erreur.
 * Arguments :
 * - req : Objet requête, contient le corps avec recaptchaToken
 * - res : Objet réponse, pour envoyer des erreurs
 * - next : Fonction pour passer au middleware suivant
 */
const verifyRecaptcha = async (req, res, next) => {
    // Extrait le token reCAPTCHA du corps de la requête
    // req.body est l'objet JSON envoyé par le client (ex. : { recaptchaToken: "abc123..." })
    const { recaptchaToken } = req.body;

    // Vérifie si un token reCAPTCHA a été fourni
    // Si recaptchaToken est absent, renvoie une erreur HTTP 400 (Bad Request)
    if (!recaptchaToken) {
        // res.status(400) définit le code HTTP 400
        // res.json envoie un objet JSON avec un message d'erreur
        return res.status(400).json({ error: 'Token reCAPTCHA manquant' });
    }

    try {
        // Envoie une requête POST à l'API de vérification reCAPTCHA de Google
        // URL : https://www.google.com/recaptcha/api/siteverify
        // Syntaxe : fetch(url, options)
        // - url : Endpoint de l'API
        // - options : Objet avec méthode, en-têtes, et corps
        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            // Méthode HTTP POST pour envoyer des données
            method: 'POST',
            
            // En-têtes de la requête
            // Content-Type indique que le corps est au format URL-encoded
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            
            // Corps de la requête, formaté comme URL-encoded
            // URLSearchParams crée une chaîne comme "secret=xxx&response=yyy"
            // - secret : Clé secrète reCAPTCHA (RECAPTCHA_SECRET_KEY dans .env)
            // - response : Token reCAPTCHA envoyé par le client
            body: new URLSearchParams({
                secret: process.env.RECAPTCHA_SECRET_KEY, // Clé secrète depuis .env
                response: recaptchaToken, // Token à vérifier
            }),
        });

        // Convertit la réponse HTTP en objet JSON
        // data contient le résultat de la vérification (ex. : { success: true } ou { success: false, "error-codes": [...] })
        const data = await response.json();

        // Journalise la réponse pour débogage
        // Aide à diagnostiquer les erreurs (ex. : "error-codes": ["invalid-input-secret"])
        console.log('reCAPTCHA response:', data);

        // Vérifie si la vérification a échoué
        // data.success est true si le token est valide, false sinon
        if (!data.success) {
            // Renvoie une erreur HTTP 400 avec les codes d'erreur de Google
            // errorCodes contient des détails (ex. : ["timeout-or-duplicate"])
            return res.status(400).json({
                error: 'Échec de la vérification reCAPTCHA',
                errorCodes: data['error-codes'] || ['unknown'], // Fallback si pas de codes
            });
        }

        // Si la vérification réussit, passe au middleware suivant
        next();
    } catch (error) {
        // Journalise l'erreur pour débogage
        // Peut inclure des erreurs réseau ou des problèmes avec fetch
        console.error('Erreur reCAPTCHA:', error);
        
        // Renvoie une erreur HTTP 500 (Internal Server Error) avec les détails
        return res.status(500).json({ error: 'Erreur lors de la vérification reCAPTCHA', details: error.message });
    }
};

// Exporte le middleware pour utilisation dans les routes
// Exemple : Dans auth.js pour protéger /auth/signup
module.exports = verifyRecaptcha;