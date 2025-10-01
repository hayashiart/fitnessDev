import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  background-color: #2A2A2A;
  min-height: 100vh;

  @media (max-width: 768px) {
    min-height: auto; /* Permet un défilement naturel */
  }
`;

export const LeftBlock = styled.div`
  width: 20%;
  margin-left: 100px;
  margin-top: 300px;
  z-index: 2;
  min-height: 200px;

  @media (max-width: 768px) {
    width: 100%;
    margin-left: 0;
    margin-top: 150px; /* Réduit l'espace */
    padding: 0 20px;
  }
`;

export const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  height: 350px;
  overflow: hidden;

  @media (max-width: 768px) {
    height: auto; /* Ajuste à contenu */
    padding-bottom: 20px;
  }
`;

export const Title = styled.h1`
  font-family: 'Enriqueta', sans-serif;
  font-size: 32px;
  font-weight: bold;
  color: #ffffff;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const Subtitle = styled.p`
  font-family: 'Hind Siliguri', sans-serif;
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
  margin: 0.5rem 0;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const EnrollButton = styled.button`
  display: inline-block;
  padding: 10px 20px;
  background-color: #d9d9d9;
  color: #000000;
  font-family: 'Enriqueta', sans-serif;
  font-weight: bold;
  text-decoration: none;
  border-radius: 5px;
  margin-top: 1rem;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #c0c0c0;
  }

  @media (max-width: 768px) {
    padding: 8px 15px;
    font-size: 14px;
    margin-top: 0.5rem;
  }
`;

export const CoursesSection = styled.div`
  width: 100%;
  margin: 20px 0;
  padding-top: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  background-color: transparent;
  padding: 0;
  position: relative;
  box-sizing: border-box;

  &:last-of-type {
    margin-bottom: 200px;
  }

  @media (max-width: 768px) {
    padding-top: 60px; /* Réduit l'espace */
    margin: 10px 0;

    &:last-of-type {
      margin-bottom: 100px;
    }
  }
`;

export const CoursesTitle = styled.h2`
  font-family: 'Enriqueta', sans-serif;
  font-size: 12px;
  color: #ffffff;
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    font-size: 10px;
    margin-bottom: 0.5rem;
  }
`;

export const CourseGrid = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  padding: 0 40px;
  box-sizing: border-box;
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 10px;
  position: relative;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  @media (max-width: 768px) {
    padding: 0 10px;
    gap: 10px;
  }
`;

export const CourseBlock = styled.div`
  flex: 0 0 auto;
  width: 320px;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  border: ${({ $isSelected }) => ($isSelected ? '2px solid #ffffff' : 'none')};

  @media (max-width: 768px) {
    width: 200px; /* Réduit la largeur */
    height: 120px;
  }
`;

export const CourseImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;

  @media (max-width: 768px) {
    object-fit: cover;
  }
`;

export const CourseName = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7);
  color: #ffffff;
  font-family: 'Enriqueta', sans-serif;
  font-size: 20px;
  font-weight: bold;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;

  ${CourseBlock}:hover & {
    opacity: 1;
  }

  ${CourseBlock}:hover ${CourseImage} {
    opacity: 0.3;
  }

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const CourseDate = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: white;
  font-size: 14px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);

  @media (max-width: 768px) {
    font-size: 12px;
    bottom: 5px;
    right: 5px;
  }
`;

export const LargeImageContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 120%;
  z-index: 0;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 80%; /* Réduit la hauteur */
  }
`;

export const LargeImage = styled.img`
  width: 100%;
  height: 120%;
  object-fit: cover;
  object-position: center 40%;
  display: block;
  loading: lazy;

  @media (max-width: 768px) {
    height: 100%;
    object-position: center 50%;
  }
`;

export const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, transparent 0%, rgba(42, 42, 42, 0.63) 45%, #2A2A2A 90%);

  @media (max-width: 768px) {
    background: linear-gradient(to bottom, transparent 0%, rgba(42, 42, 42, 0.63) 50%, #2A2A2A 85%);
  }
`;

export const ChevronButton = styled.button`
  position: absolute;
  top: calc(100% - 180px / 2);
  transform: translateY(-50%);
  ${({ direction }) => (direction === 'left' ? 'left: 10px;' : 'right: 10px;')}
  background: rgba(0, 0, 0, 0.8);
  border: none;
  cursor: pointer;
  padding: 10px;
  z-index: 3;
  display: ${({ $visible }) => ($visible ? 'block' : 'none')};
  transition: opacity 0.3s ease;
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }

  @media (max-width: 768px) {
    top: calc(100% - 120px / 2); /* Ajuste pour la hauteur réduite */
    padding: 8px;
  }
`;

export const ChevronImage = styled.img`
  width: 30px;
  height: 30px;

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
  }
`;

export const ErrorMessage = styled.p`
  font-family: 'Hind Siliguri', sans-serif;
  font-size: 1rem;
  color: #ff0000;
  text-align: center;
  margin: 1rem 0;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

export const NoCoursesMessage = styled.p`
  font-family: 'Hind Siliguri', sans-serif;
  font-size: 1rem;
  color: #666;
  text-align: center;
  margin: 1rem 0;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;