/**
 * Fichier : Carousel.jsx
 * Description : Composant React pour un carrousel d'images avec défilement automatique et navigation par points.
 * Affiche une image à la fois, avec un changement toutes les 3 secondes, et permet de sélectionner une image via des points.
 */

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import fd_carousel1 from "../assets/images/fd_carousel1.jpg";
import fd_carousel2 from "../assets/images/fd_carousel2.jpg";
import fd_carousel3 from "../assets/images/fd_carousel3.jpg";
import fd_carousel4 from "../assets/images/fd_carousel4.jpg";
import fd_carousel5 from "../assets/images/fd_carousel5.jpg";
import fd_carousel6 from "../assets/images/fd_carousel6.jpg";

const CarouselContainer = styled.div`
    border-radius: 20px;
    height: 500px;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
`;

const CarouselWrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: auto;
    height: 100%;
    overflow: hidden;
`;

const CarouselItem = styled.div`
    width: 80%;
    height: 80%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color5);
    border-radius: 20px;
`;

const CarouselImg = styled.div`
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    background-image: ${({ $img }) => `url(${$img})`};
`;

const CarouselDots = styled.div`
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
`;

const Dot = styled.div`
    width: 15px;
    height: 15px;
    background-color: #ffffff;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &.active {
        background-color: #9a1b14;
    }
`;

/**
 * Composant : Carousel
 * Description : Affiche un carrousel d'images avec défilement automatique (toutes les 3 secondes)
 * et navigation par points cliquables.
 * Retour : JSX avec le carrousel et les points de navigation
 */
const Carousel = () => {
  // Définit la liste des images du carrousel avec leurs ID et chemins
  const items = [
    { id: 1, img: fd_carousel1 },
    { id: 2, img: fd_carousel2 },
    { id: 3, img: fd_carousel3 },
    { id: 4, img: fd_carousel4 },
    { id: 5, img: fd_carousel5 },
    { id: 6, img: fd_carousel6 },
  ];

  // État pour suivre l'index de l'image actuellement affichée
  const [currentIndex, setCurrentIndex] = useState(0);

  /**
   * Effet : Défilement automatique
   * Description : Change l'image affichée toutes les 3 secondes en incrémentant l'index.
   * Revient à la première image après la dernière.
   * Dépendances : [items.length] (relance si la liste change)
   */
  useEffect(() => {
    // Crée un intervalle pour changer l'image toutes les 3 secondes
    const interval = setInterval(() => {
      // Met à jour currentIndex : passe à l'image suivante ou revient à 0
      setCurrentIndex((prevIndex) =>
        prevIndex === items.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    
    // Nettoie l'intervalle lors du démontage pour éviter les fuites mémoire
    return () => clearInterval(interval);
  }, [items.length]); // Dépendance : longueur de la liste d'images

  // Début du rendu JSX
  return (
    // Conteneur principal du carrousel
    <CarouselContainer>
      {/* Enveloppe pour centrer l'image et les points */}
      <CarouselWrapper>
        {/* Élément du carrousel pour l'image actuelle */}
        <CarouselItem>
          {/* Image avec style inline pour afficher l'image actuelle */}
          <CarouselImg style={{ backgroundImage: `url(${items[currentIndex].img})` }} />
        </CarouselItem>
        
        {/* Conteneur pour les points de navigation */}
        <CarouselDots>
          {/* Mappe chaque image à un point cliquable */}
          {items.map((item, index) => (
            // Point avec classe active si c'est l'image actuelle
            <Dot
              key={item.id}
              className={currentIndex === index ? "active" : ""}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </CarouselDots>
      </CarouselWrapper>
    </CarouselContainer>
  );
};

// Exporte le composant Carousel pour utilisation ailleurs
export default Carousel;