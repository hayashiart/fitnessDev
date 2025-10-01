/**
 * Fichier : speed.js
 * Description : Ce fichier JavaScript gère les raccourcis clavier pour contrôler la vitesse de lecture d'une vidéo HTML5 dans la page.
 * Il écoute les événements de touches (flèches directionnelles et barre d'espace) et ajuste la propriété `playbackRate` de l'élément vidéo.
 * Utilisé dans un contexte où une vidéo est présente dans le DOM (ex. : page avec contenu multimédia).
 */

// Ajoute un écouteur d'événements pour les touches du clavier sur tout le document
// Syntaxe : document.addEventListener(type, listener) où type est l'événement ('keydown') et listener est la fonction à exécuter
document.addEventListener('keydown', function(event) {
    // Récupère l'élément vidéo dans le DOM avec querySelector
    // Syntaxe : document.querySelector(selector) retourne le premier élément correspondant au sélecteur CSS
    const video = document.querySelector('video');
    
    // Vérifie si une vidéo existe dans le DOM
    // Si aucune vidéo n'est trouvée, la fonction s'arrête pour éviter des erreurs
    if (!video) return;

    // Structure conditionnelle pour gérer les touches pressées
    // `event.key` contient le nom de la touche (ex. : 'ArrowRight', 'ArrowLeft', etc.)
    if (event.key === 'ArrowRight') {
        // Flèche droite : augmente la vitesse de lecture
        incSpeed();
    }
    if (event.key === 'ArrowLeft') {
        // Flèche gauche : diminue la vitesse de lecture
        decSpeed();
    }
    if (event.key === 'ArrowUp') {
        // Flèche haut : double la vitesse de lecture (2x)
        twoXSpeed();
    }
    if (event.key === 'ArrowDown') {
        // Flèche bas : réduit la vitesse de lecture à la moitié (0.5x)
        halfSpeed();
    }
    if (event.key === ' ') {
        // Barre d'espace : réinitialise la vitesse à normale (1x)
        normalSpeed();
    }
});

/**
 * Fonction : halfSpeed
 * Description : Réduit la vitesse de lecture de la vidéo à 0.5x (moitié de la vitesse normale).
 * Arguments : Aucun
 * Retour : Aucun (modifie directement la propriété `playbackRate` de la vidéo)
 */
function halfSpeed() {
    // Récupère l'élément vidéo
    const video = document.querySelector('video');
    // Vérifie si la vidéo existe
    if (video) {
        // Définit la vitesse de lecture à 0.5
        // Syntaxe : video.playbackRate = valeur (1.0 est la vitesse normale)
        video.playbackRate = 0.5;
    }
}

/**
 * Fonction : normalSpeed
 * Description : Réinitialise la vitesse de lecture de la vidéo à 1.0x (vitesse normale).
 * Arguments : Aucun
 * Retour : Aucun
 */
function normalSpeed() {
    const video = document.querySelector('video');
    if (video) {
        video.playbackRate = 1.0;
    }
}

/**
 * Fonction : twoXSpeed
 * Description : Double la vitesse de lecture de la vidéo à 2.0x.
 * Arguments : Aucun
 * Retour : Aucun
 */
function twoXSpeed() {
    const video = document.querySelector('video');
    if (video) {
        video.playbackRate = 2.0;
    }
}

/**
 * Fonction : incSpeed
 * Description : Augmente la vitesse de lecture de la vidéo de 0.1.
 * Arguments : Aucun
 * Retour : Aucun
 */
function incSpeed() {
    const video = document.querySelector('video');
    if (video) {
        // Incrémente la vitesse actuelle de 0.1
        video.playbackRate += 0.1;
    }
}

/**
 * Fonction : decSpeed
 * Description : Diminue la vitesse de lecture de la vidéo de 0.1.
 * Arguments : Aucun
 * Retour : Aucun
 */
function decSpeed() {
    const video = document.querySelector('video');
    if (video) {
        // Décrémente la vitesse actuelle de 0.1
        video.playbackRate -= 0.1;
    }
}