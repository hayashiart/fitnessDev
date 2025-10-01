/**
 * Fichier : hash.js
 * Description : Script Node.js pour tester le hachage d'un mot de passe avec bcrypt. Génère un hash sécurisé
 * à partir d'un mot de passe en clair et l'affiche dans la console. Utilisé pour démontrer ou tester bcrypt.
 */

// Importe le module bcrypt, une bibliothèque pour hacher les mots de passe
// bcrypt utilise un algorithme sécurisé (basé sur Blowfish) pour protéger les mots de passe
const bcrypt = require('bcrypt');

// Définit un mot de passe en clair à hacher
// plainPassword est une chaîne utilisée pour cet exemple
const plainPassword = 'password123';

// Appelle la fonction bcrypt.hash pour hacher le mot de passe
// Syntaxe : bcrypt.hash(password, saltRounds, callback)
// - password : Mot de passe en clair (ici, 'password123')
// - saltRounds : Nombre de tours pour générer le sel (10 est un bon compromis sécurité/performance)
// - callback : Fonction appelée avec le résultat ou une erreur
bcrypt.hash(plainPassword, 10, (err, hash) => {
    // Vérifie si une erreur s'est produite lors du hachage
    // err : Objet erreur, peut indiquer un problème avec bcrypt
    if (err) throw err; // Lance l'erreur, arrêtant l'exécution
    
    // Affiche le hash généré dans la console
    // hash : Chaîne contenant le sel et le mot de passe haché (ex. : $2b$10$...)
    console.log('Hash bcrypt :', hash);
});