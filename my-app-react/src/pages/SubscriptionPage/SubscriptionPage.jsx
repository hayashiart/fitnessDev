/**
 * Fichier : SubscriptionPage.jsx
 * Description : Composant React pour la page des abonnements de l'application FitnessDev. Affiche une liste
 * de trois formules d'abonnement (ESSENTIAL, ORIGINAL, ULTRA) avec leurs options, une section décrivant
 * les équipements et services des salles de sport, et les logos des partenaires (marques d'équipements).
 * Utilise le composant Subscription pour afficher chaque formule d'abonnement.
 */

import React from "react"; // Importe React pour créer un composant fonctionnel
import styled from "styled-components"; // Importe styled-components pour définir des styles CSS spécifiques au composant
import Subscription from "../../components/Subscription.jsx"; // Importe le composant Subscription pour afficher chaque formule d'abonnement
import SubscriptionItem1 from "../../assets/icons/Subscription_Item1.png"; // Importe l'icône pour l'option "Abonnement sans engagement"
import SubscriptionItem2 from "../../assets/icons/Subscription_Item2.png"; // Importe l'icône pour l'option "Accès réseau illimité"
import SubscriptionItem3 from "../../assets/icons/Subscription_Item3.png"; // Importe l'icône pour l'option "Fontaine à boissons fruitées"
import SubscriptionItem4 from "../../assets/icons/Subscription_Item4.png"; // Importe l'icône pour l'option "Plateforme oscillante"
import SubscriptionItem5 from "../../assets/icons/Subscription_Item5.png"; // Importe l'icône pour l'option "Carte d’abonnement partageable"
import FdEquipment1 from "../../assets/images/fd_equipment1.png"; // Importe la première image d'équipement pour la section équipements
import FdEquipment2 from "../../assets/images/fd_equipment2.png"; // Importe la deuxième image d'équipement
import PartenerIcon1 from "../../assets/icons/logo_gym80.png"; // Importe le logo du partenaire GYM80
import PartenerIcon2 from "../../assets/icons/logo_hammer.png"; // Importe le logo du partenaire Hammer Strength
import PartenerIcon3 from "../../assets/icons/logo_technogym.png"; // Importe le logo du partenaire Technogym
import PartenerIcon4 from "../../assets/icons/logo-life-fitness-1.png"; // Importe le logo du partenaire Life Fitness
import PartenerIcon5 from "../../assets/icons/logo_eleiko.png"; // Importe le logo du partenaire Eleiko

const Main = styled.main`
  min-height: 100vh;
  padding-top: 124px;
`;

const Offset = styled.div`
  display: none;
  width: 100%;
  height: 84px;
  background-color: #000000;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const Title = styled.h1`
  font-size: 45px;
  width: 60%;
  margin: 0 auto;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 35px;
    width: 80%;
  }
`;

const Description = styled.p`
  font-size: 22px;
  width: 80%;
  margin: 20px auto 40px auto;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
  margin: 0 40px;
  justify-items: center;
  align-items: start;
  padding-bottom: 60px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SectionDark = styled.section`
  padding-top: 20px;
  background-color: #000000;
  color: #ffffff;
`;

const EquipmentWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 20px;
  margin: 20px;
`;

const EquipmentSectionContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  align-items: flex-start;
  padding: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding: 20px 10px;
  }
`;

const EquipmentText = styled.div`
  flex: 1;
  min-width: 300px;

  h2 {
    font-size: 32px;

    @media (max-width: 768px) {
      font-size: 24px;
      text-align: center;
    }
  }

  p {
    font-size: 16px;

    @media (max-width: 768px) {
      text-align: justify;
    }
  }
`;

const EquipmentImages = styled(EquipmentWrapper)`
  flex: 1;
  min-width: 300px;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const EquipmentImage = styled.img`
  width: 100%;
  max-width: 400px;
  border-radius: 10px;

  @media (max-width: 768px) {
    width: 90%;
    margin-bottom: 20px;
  }
`;

const PartnersWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  margin: 40px;
`;

const PartnerLogo = styled.img`
  height: 50px;
  object-fit: contain;
`;

/**
 * Composant : SubscriptionPage
 * Description : Affiche une page présentant les formules d'abonnement (ESSENTIAL, ORIGINAL, ULTRA) sous forme
 * de grille, une section sombre détaillant les équipements et services des salles FitnessDev, et une liste
 * des logos des partenaires. Chaque formule est rendue via le composant Subscription.
 * Retour : JSX contenant les sections de la page des abonnements
 */
const SubscriptionPage = () => {
  // Définit un tableau contenant les trois formules d'abonnement disponibles
  // Chaque formule a un nom, un prix hebdomadaire, et un nombre d'options incluses
  const formulas = [
    {
      name: "ESSENTIAL", // Nom de la formule
      price: 7.99, // Prix hebdomadaire affiché (remplacé par une requête API dans Subscription)
      options: 2, // Nombre d'options incluses (2 premières options)
    },
    {
      name: "ORIGINAL",
      price: 9.99,
      options: 4, // Inclut les 4 premières options
    },
    {
      name: "ULTRA",
      price: 10.99,
      options: 5, // Inclut toutes les options
    },
  ];

  // Définit un tableau contenant les options disponibles pour les abonnements
  // Chaque option a un nom et une icône associée
  const Options = [
    { name: "Abonnement sans engagement annuel", img: SubscriptionItem1 }, // Option 1 : Pas d'engagement annuel
    { name: "Accès réseau illimité", img: SubscriptionItem2 }, // Option 2 : Accès à tous les clubs
    { name: "Fontaine à boissons fruitées", img: SubscriptionItem3 }, // Option 3 : Boissons disponibles
    { name: "Plateforme oscillante**", img: SubscriptionItem4 }, // Option 4 : Équipement spécifique
    { name: "Carte d’abonnement partageable", img: SubscriptionItem5 }, // Option 5 : Partage de l'abonnement
  ];

  // Début du rendu JSX
  return (
    // Fragment pour regrouper les éléments sans conteneur supplémentaire
    <>
      {/* Conteneur de compensation pour le menu burger en mobile, visible sur écrans < 768px */}
      <Offset />
      
      {/* Balise principale pour la structure sémantique, avec un minimum de hauteur */}
      <Main>
        {/* Section présentant les formules d'abonnement */}
        <section style={{ paddingBottom: "20px" }}>
          {/* Titre principal incitant à choisir une formule */}
          <Title>SÉLECTIONNE L’ABONNEMENT QUI TE CORRESPOND</Title>
          
          {/* Description des avantages des abonnements et des clubs */}
          <Description>
            Avec plus de 60 clubs partout dans le monde, retrouve : Cardio,
            Musculation, Cross-training, espace Femme, Boxe et MMA pour effectuer
            tous tes entraînements ! Découvre nos trois options de forfaits sans
            engagement annuel, à partir de 7,99€ par semaine ! 🔥
          </Description>
          
          {/* Grille contenant les formules d'abonnement */}
          <GridContainer>
            {/* Mappe chaque formule pour afficher un composant Subscription */}
            {formulas.map((formula) => (
              // Composant Subscription pour chaque formule
              // key : Utilise le nom pour une clé unique
              <Subscription
                key={formula.name}
                name={formula.name} // Nom de la formule (ex. : "ESSENTIAL")
                price={formula.price} // Prix affiché (remplacé par API)
                list={Options.slice(0, formula.options)} // Liste des options incluses
              />
            ))}
          </GridContainer>
        </section>

        {/* Section sombre pour les équipements et partenaires */}
        <SectionDark>
          {/* Titre de la section équipements */}
          <Title>SALLES DE SPORT FITNESSDEV</Title>
          
          {/* Conteneur pour le texte et les images des équipements */}
          <EquipmentSectionContent>
            {/* Texte décrivant les équipements et services */}
            <EquipmentText>
              {/* Sous-titre pour la section */}
              <h2>Nos Équipements et Services Uniques</h2>
              
              {/* Description détaillée des équipements et services */}
              <Description>
                Tes salles de sport ON AIR FITNESS sont exclusivement composées de
                matériel haut de gamme et connecté des marques TECHNOGYM, HAMMER
                STRENGTH, ELEIKO, LIFE FITNESS et GYM 80. Avec des espaces force,
                musculation guidée, cardio-training, espace boxing, haltérophilie…
                mais aussi un espace dédié aux femmes avec des machines conçues pour
                répondre aux besoins spécifiques de nos FITGIRLS.
                <br />
                Certaines de nos salles de sport te permettent d’accéder à des cours
                collectifs, de zumba, yoga, pilates, body pump, RPM, des cours Les
                Mills…
                <br />
                Retrouve une salle de sport ON AIR FITNESS à proximité de chez toi et
                découvre les espaces dont dispose ton futur club. Tu peux te rendre
                directement sur sa page.
                <br />
                Plus d'excuses, rejoins-nous pour ton entraînement et plonge au
                cœur de l'action avec ON AIR FITNESS !
              </Description>
            </EquipmentText>
            
            {/* Conteneur pour les images des équipements */}
            <EquipmentImages>
              {/* Première image d'équipement */}
              <EquipmentImage src={FdEquipment1} alt="Équipement 1" />
              {/* Deuxième image d'équipement */}
              <EquipmentImage src={FdEquipment2} alt="Équipement 2" />
            </EquipmentImages>
          </EquipmentSectionContent>
          
          {/* Conteneur pour les logos des partenaires */}
          <PartnersWrapper>
            {/* Logo du partenaire GYM80 */}
            <PartnerLogo src={PartenerIcon1} alt="GYM80" />
            {/* Logo du partenaire Hammer Strength */}
            <PartnerLogo src={PartenerIcon2} alt="Hammer Strength" />
            {/* Logo du partenaire Technogym */}
            <PartnerLogo src={PartenerIcon3} alt="Technogym" />
            {/* Logo du partenaire Life Fitness */}
            <PartnerLogo src={PartenerIcon4} alt="Life Fitness" />
            {/* Logo du partenaire Eleiko */}
            <PartnerLogo src={PartenerIcon5} alt="Eleiko" />
          </PartnersWrapper>
        </SectionDark>
      </Main>
    </>
  );
};

// Exporte le composant SubscriptionPage pour utilisation dans les routes
export default SubscriptionPage;