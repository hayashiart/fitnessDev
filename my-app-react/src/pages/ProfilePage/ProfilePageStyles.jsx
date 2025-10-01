import styled from 'styled-components';

export const Main = styled.main`
  min-height: 100vh;
  padding-top: 124px;
  background-color: #ffffff;

  @media (max-width: 768px) {
    padding-top: 80px; /* Réduit l'espace */
  }
`;

export const Offset = styled.div`
  display: none;
  width: 100%;
  height: 84px;
  background-color: #000000;

  @media (max-width: 768px) {
    display: flex;
    height: 60px; /* Réduit pour mobile */
  }
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;

  @media (max-width: 768px) {
    padding: 20px 10px; /* Moins de padding */
  }
`;

export const Title = styled.h1`
  font-size: 45px;
  text-align: center;
  margin-bottom: 40px;
  color: #000000;

  @media (max-width: 768px) {
    font-size: 30px; /* Taille réduite */
    margin-bottom: 20px;
  }
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Une colonne */
    gap: 20px;
    margin-bottom: 20px;
  }
`;

export const SmallGridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Une colonne */
    gap: 20px;
  }
`;

export const Block = styled.div`
  background-color: #ececec;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 768px) {
    padding: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Ombre plus légère */
  }
`;

export const LargeBlock = styled(Block)`
  min-height: 400px;

  @media (max-width: 768px) {
    min-height: 250px; /* Réduit pour mobile */
  }
`;

export const SmallBlock = styled(Block)`
  min-height: 150px;

  @media (max-width: 768px) {
    min-height: 120px;
  }
`;

export const BlockTitle = styled.h2`
  font-size: 24px;
  color: #000000;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 15px;
  }
`;

export const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;

  @media (max-width: 768px) {
    margin-bottom: 15px;
  }
`;

export const InfoItem = styled.li`
  font-size: 16px;
  color: #333333;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 8px;
  }
`;

export const RedButton = styled.button`
  width: 120px;
  height: 40px;
  background-color: #9a1b14;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  align-self: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover:not(:disabled) {
    background-color: #000000;
  }

  &:disabled {
    background-color: #999999;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100px;
    height: 35px;
    font-size: 12px;
  }
`;

export const GrayButton = styled.button`
  width: 120px;
  height: 40px;
  background-color: #666666;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin-left: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background-color: #4d4d4d;
  }

  @media (max-width: 768px) {
    width: 100px;
    height: 35px;
    font-size: 12px;
    margin-left: 0; /* Pas d'espace à gauche */
  }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const Popup = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  max-width: 450px;
  width: 90%;
  text-align: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  overflow: hidden;

  @media (max-width: 768px) {
    max-width: 80%;
    padding: 15px;
  }
`;

export const PopupTitle = styled.h2`
  font-size: 24px;
  color: #000000;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 10px;
  }
`;

export const PopupText = styled.p`
  font-size: 16px;
  color: #333333;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 15px;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column; /* Empiler les boutons */
    gap: 8px;
  }
`;