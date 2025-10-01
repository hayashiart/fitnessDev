/**
 * Fichier : SignUpPage.jsx
 * Description : Composant React pour la page d'inscription de l'application.
 * Affiche un formulaire permettant aux utilisateurs d'entrer leurs informations
 * et de valider un reCAPTCHA. Appelle la fonction signup du contexte pour créer un compte.
 */

import React, { useRef, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import styled from "styled-components";
import ReCAPTCHA from "react-google-recaptcha";

const Offset = styled.div`
  display: none;
  width: 100%;
  height: 84px;
  background-color: #000000;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-self: center;
  align-items: center;
  max-width: 940px;
  width: 80%;
  gap: 20px;
  padding: 20px;
`;

const Select = styled.select`
  align-self: start;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 10px;
  width: 100px;
  height: 40px;
  line-height: 30px;
  color: rgba(0, 0, 0, 0.5);
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 10px;
  width: 100%;
  height: 40px;
`;

const Button = styled.button`
  width: 150px;
  height: 40px;
  background-color: #9a1b14;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #000000;
  }
`;

const ReCAPTCHACenterWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  width: 100%;
  box-sizing: border-box;
  overflow-x: visible;
  div {
    overflow-x: visible;
  }
  @media (max-width: 768px) {
    margin-top: 15px;
  }
`;

const SignUpPage = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const formRef = useRef();
  const inputs = useRef([]);
  const recaptchaRef = useRef();
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const addInputs = (el) => {
    if (el && !inputs.current.includes(el)) {
      inputs.current.push(el);
    }
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const handleForm = async (e) => {
    e.preventDefault();
    if (!recaptchaToken) {
      alert('Veuillez valider le reCAPTCHA.');
      return;
    }
    const data = {
      civilite: inputs.current[0]?.value,
      name: inputs.current[1]?.value,
      firstname: inputs.current[2]?.value,
      birthday: inputs.current[3]?.value,
      phone: inputs.current[4]?.value,
      email: inputs.current[5]?.value,
      emailConfirm: inputs.current[6]?.value,
      password: inputs.current[7]?.value,
      adress: inputs.current[8]?.value,
    };
    if (data.email !== data.emailConfirm) {
      alert("Les adresses e-mail ne correspondent pas.");
      return;
    }
    try {
      await signup(data, recaptchaToken);
      navigate('/');
    } catch (error) {
      alert('Inscription échouée. Veuillez réessayer.');
    }
  };

  return (
    <>
      <Offset />
      <main style={{ minHeight: "100vh", paddingTop: '124px' }}>
        <h1>Informations</h1>
        <Form ref={formRef} onSubmit={handleForm}>
          <Select ref={addInputs} required>
            <option value="">Civilité</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
          </Select>
          <Input
            ref={addInputs}
            type="text"
            placeholder="Votre nom"
            pattern="^[a-zA-Z]{2,}$"
            required
            aria-label="Entrer votre nom"
          />
          <Input
            ref={addInputs}
            type="text"
            placeholder="Votre prénom"
            pattern="^[a-zA-Z]{2,}$"
            required
            aria-label="Entrer votre prénom"
          />
          <Input
            ref={addInputs}
            type="date"
            placeholder="Votre date de naissance"
            required
            aria-label="Entrer votre date de naissance"
          />
          <Input
            ref={addInputs}
            type="number"
            placeholder="Votre numéro de téléphone"
            required
            aria-label="Entrer votre numéro de téléphone"
          />
          <Input
            ref={addInputs}
            type="email"
            placeholder="Adresse e-mail"
            pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            required
            aria-label="Entrez votre adresse e-mail"
          />
          <Input
            ref={addInputs}
            type="email"
            placeholder="Confirmation adresse e-mail"
            pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            required
            aria-label="Entrez votre adresse e-mail"
          />
          <Input
            ref={addInputs}
            type="password"
            placeholder="Mot de passe"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{12,50}$"
            required
            aria-label="Entrez votre mot de passe"
          />
          <Input
            ref={addInputs}
            type="text"
            placeholder="Adresse"
            required
            aria-label="Entrez votre adresse"
          />
          <ReCAPTCHACenterWrapper>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={handleRecaptchaChange}
              size="normal"
            />
          </ReCAPTCHACenterWrapper>
          <div>
            <Button type="submit" disabled={!recaptchaToken}>
              JE CONFIRME
            </Button>
          </div>
        </Form>
      </main>
    </>
  );
};

export default SignUpPage;