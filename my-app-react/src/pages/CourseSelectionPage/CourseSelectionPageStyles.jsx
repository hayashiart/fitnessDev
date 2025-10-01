import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const shouldForwardProp = (prop) => prop !== 'isVisible';

export const Container = styled.div`
  max-width: 800px;
  margin: 6rem auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    margin: 3rem auto; /* Réduit la marge */
    padding: 0 10px;
  }
`;

export const Title = styled.h1`
  font-family: 'Enriqueta', sans-serif;
  font-size: 2.5rem;
  color: #000000;
  text-align: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
`;

export const CourseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 0.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    gap: 1rem;
    max-width: 100%;
  }
`;

export const ReturnLink = styled(Link)`
  display: block;
  color: #9a1b14;
  font-size: 1rem;
  text-align: left;
  margin-bottom: 1rem;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
`;

export const CourseItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column; /* Empiler les éléments */
    padding: 0.8rem;
    gap: 0.8rem;
  }
`;

export const CourseInfo = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
  }
`;

export const CourseName = styled.h2`
  font-family: 'Rufina', serif;
  font-size: 1.5rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

export const CourseDetails = styled.p`
  font-family: 'Hind Siliguri', sans-serif;
  font-size: 1rem;
  color: #666;
  margin: 0.25rem 0 0;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

export const Confirmation = styled.p`
  font-family: 'Hind Siliguri', sans-serif;
  font-size: 1rem;
  color: #ae2119;
  text-align: center;
  margin-top: 1rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

export const ErrorMessage = styled.p`
  font-family: 'Hind Siliguri', sans-serif;
  font-size: 1rem;
  color: #ff0000;
  text-align: center;
  margin-top: 1rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

export const CustomReserveButton = styled.button`
  display: inline-block;
  width: 200px;
  height: 70px;
  line-height: 70px;
  background-color: ${({ disabled }) => (disabled ? '#cccccc' : '#9a1b14')};
  color: ${({ disabled }) => (disabled ? '#666666' : '#ffffff')};
  border: none;
  border-radius: 5px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-size: 20px;
  font-weight: 700;
  padding: 0 20px;
  box-sizing: border-box;
  z-index: 1;
  text-align: center;

  &:hover:not(:disabled) {
    background-color: #000000;
  }

  @media (max-width: 768px) {
    width: 150px;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    padding: 0 15px;
  }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

export const ConfirmationPopup = styled.div.withConfig({ shouldForwardProp })`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(${({ isVisible }) => (isVisible ? 1 : 0.8)});
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  text-align: center;
  max-width: 400px;
  width: 90%;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transition: transform 0.3s ease, opacity 0.3s ease;
  animation: fadeIn 0.3s ease forwards;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.8);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }

  @media (max-width: 768px) {
    max-width: 80%;
    padding: 1.5rem;
  }
`;

export const PopupMessage = styled.p`
  font-family: 'Hind Siliguri', sans-serif;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1rem;
  }
`;

export const PopupButton = styled.button`
  background-color: #9a1b14;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;

  &:hover {
    background-color: #000000;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
    margin: 0 0.3rem;
  }
`;