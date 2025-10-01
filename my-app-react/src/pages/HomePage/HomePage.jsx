import React from "react";
import styled from 'styled-components';

import fd_homepage1 from "../../assets/images/fd_homepage1.jpg";
import fd_homepage2 from "../../assets/images/fd_homepage2.jpg";
import fd_homepage3 from "../../assets/images/fd_homepage3.jpg";
import fd_homepage_responsive1 from "../../assets/images/fd_homepage_responsive1.jpg";
import fd_homepage_responsive2 from "../../assets/images/fd_homepage_responsive2.jpg";
import fd_homepage_responsive3 from "../../assets/images/fd_homepage_responsive3.jpg";

import Carousel from "../../components/Carousel";
import Avis from "../../components/Avis";



const Offset= styled.div`
  display:none;
  width:100%;
  height:84px;
  background-color:#000000;

  @media (max-width: 768px) {
    display: flex;
  }
`;
const HeroSectionWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;

  @media (max-width: 768px) {
    height: auto;
  }
`;
const HeroSection = styled.section`
  position: relative;
  background-image: ${({ $bgdesktop }) => `url(${$bgdesktop})`};
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    background-image: none;
    position: absolute;
    height: 100%;
    width:100%;
    top:0px;
    left:0;
  }
`;



const HeroContent = styled.div`
  text-align: center;
  color: white;
  padding: 20px;
  h1 {
    font-size: 2rem;

    @media (min-width: 769px) {
      font-size: 3rem;
    }
  }

  p {
    font-size: 1rem;

    @media (min-width: 769px) {
      font-size: 1.25rem;
    }
  }
`;
const Section = styled.section`
  background-image: ${({ $bgdesktop }) => `url(${$bgdesktop})`};
  min-height: 100vh;
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  padding: 20px;

  h1 {
    font-size: 2.8rem;
    margin: 0;
    font-weight: bold;
  }

  p {
    font-size: 1.25rem;
    margin-top: 10px;
    max-width: 600px;
    text-align: center;
  }

  @media (max-width: 768px) 
  {
    min-height: auto;
    flex-direction: column;
    align-items: center;
    background-image: ${({ bgMobile }) => `url(${bgMobile})`};
    background-position : top;
    background-size: 100% auto;
    background-repeat: no-repeat;
    padding:0;


    h1 {
    font-size: 2rem;
    margin: 0;
    font-weight: bold;
  }

  p {
    font-size: 1rem;
    margin-top: 10px;
    max-width: 600px;
    text-align: center;
  }
  }
`;

const ContentBlock = styled.div`
  width: 43%; 
  @media (max-width: 768px) {
    width: 100%;
    min-height:50vh;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding:10px;
  }
`;
const MobileImage = styled.img`
  display: none;

  @media (max-width: 768px) {
    display: block;
    width: 100%;
    height: auto;
  }
`;

const DarkSection = styled(Section)`
  background-color: #000000;
  background-image: none;
  flex-direction: column;
`;




const HomePage = () => {
  return (
    <main>
      <Offset/>
      <HeroSectionWrapper>
        <MobileImage src={fd_homepage_responsive1} alt="Visuel mobile" />        
        <HeroSection $bgdesktop={fd_homepage1} >
          <HeroContent>
            <h1>DÉPASSE-TOI ET ATTEINS TES OBJECTIFS !</h1>
            <p>Retrouve ton club FitnessDev le plus proche de 6H à 23H en France</p>
          </HeroContent>
        </HeroSection>
      </HeroSectionWrapper>

      <Section   $bgdesktop={fd_homepage2} style={{ justifyContent:"flex-start" }}>
        <MobileImage src={fd_homepage_responsive2} alt="Visuel mobile" />
        <ContentBlock style={{ color: "#000000" }}>
          <h1>FITNESSDEV CLUBS DE SPORT</h1>
          <p>Trouve ton club FitnessDev le plus proche et profite d’un accès 7j/7, de 6H à 23H</p>
          <p>Avec ta carte FitnessDev, tu as accès librement à l'ensemble de nos clubs, ouverts de 6h à 23h* en France, Espagne et dans les DOM-TOM.</p>
          <p>Non-stop, 7j/7, 365 jours/an, pour t'entraîner, te surpasser et réaliser tes objectifs sans contrainte.</p>
        </ContentBlock>        
      </Section>

      <Section $bgdesktop={fd_homepage3}  style={{ justifyContent:"flex-end" }}>
        <MobileImage src={fd_homepage_responsive3} alt="Visuel mobile" />     
        <ContentBlock style={{ height: "auto" ,color: "#000000" }}>
          <h1>+120 000</h1>
          <h1>D'ADHÉRENTS</h1>
          <p>Rejoins notre communauté de passionnés qui se dépassent et se surpassent au quotidien pour atteindre leurs objectifs.</p>
          <p>Inscris-toi dès aujourd'hui et profite de tous les avantages de l’enseigne de fitness préférée des Français.</p>
        </ContentBlock>
      </Section>

      <DarkSection>
        <h1 style={{ color: "#ffffff" }}>Notre Salle</h1>
        <Carousel />
      </DarkSection>

      <Section style={{minHeight:"50vh",flexDirection:"row" }}>
        <Avis />
      </Section>
    </main>
  );
};

export default HomePage;