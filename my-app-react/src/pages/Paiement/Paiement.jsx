/**
 * Fichier : Paiement.jsx
 * Description : Composant React pour la page de paiement dans FitnessDev. Fournit un formulaire pour collecter l'adresse de livraison
 * (adresse principale, ville, code postal, région) et les détails de la carte bancaire (numéro, date d'expiration, CVV). Valide les
 * entrées à l'aide d'expressions régulières, affiche des messages d'erreur pour les champs non valides, et journalise les données lors
 * de la soumission. Inclut des styles responsifs pour les écrans mobiles afin d'assurer une expérience utilisateur optimale sur tous les
 * appareils. Intégré dans le flux de commande de la branche Trey avec Panier.jsx, Produit.jsx, et Checkout.jsx.
 * Contexte : Projet FitnessDev, aligné avec la branche Trey pour un flux de commande cohérent.
 * Dépendances : react (composant, hook useState pour gérer l'état), styled-components (styles dynamiques).
 */

/** Importation des dépendances nécessaires */
import React, { useState } from 'react'; // React est la bibliothèque principale pour créer des composants, useState est un hook pour gérer l'état local
import styled from 'styled-components'; // styled-components permet de créer des styles CSS encapsulés dans des composants JavaScript

/** Définition des composants stylisés avec styled-components */
const PaiementContainer = styled.div`
  background-color: #000000;
  min-height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 600px) {
    padding: 10px;
  }
`;

const FormSection = styled.div`
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
  @media (max-width: 600px) {
    max-width: 100%;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  @media (max-width: 600px) {
    margin-bottom: 10px;
  }
`;

const Label = styled.label`
  color: #ffffff;
  font-size: 14px;
  margin-bottom: 5px;
  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  background-color: #ffffff;
  color: #000000;
  width: 100%;
  box-sizing: border-box;
  &::placeholder {
    color: #999;
  }
  @media (max-width: 600px) {
    font-size: 14px;
    padding: 8px;
  }
`;

const InputRow = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  @media (max-width: 600px) {
    gap: 10px;
  }
`;

const InputHalf = styled(Input)`
  flex: 1;
  min-width: 150px;
  @media (max-width: 600px) {
    min-width: 120px;
  }
`;

const ErrorMessage = styled.span`
  color: #ff0000;
  font-size: 12px;
  margin-top: 5px;
  @media (max-width: 600px) {
    font-size: 10px;
  }
`;

const Divider = styled.hr`
  width: 100%;
  max-width: 600px;
  border: none;
  border-top: 2px solid #333333;
  margin: 20px 0;
  @media (max-width: 600px) {
    margin: 15px 0;
  }
`;

const VisaLogo = styled.img`
  height: 30px;
  margin-bottom: 10px;
  @media (max-width: 600px) {
    height: 25px;
  }
`;

const SubmitButton = styled.button`
  background-color: #ff0000;
  color: #ffffff;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #cc0000;
  }
  @media (max-width: 600px) {
    font-size: 14px;
    padding: 8px 15px;
  }
`;

/**
 * Composant : Paiement
 * Description : Rend un formulaire interactif pour collecter et valider les informations de livraison et de paiement.
 * Gère l'état des champs via useState, valide les entrées avec des expressions régulières, et affiche des messages d'erreur
 * dynamiques. Journalise les données lors de la soumission pour débogage, avec un emplacement prévu pour une logique de paiement future.
 * Paramètres : Aucun
 * Retour : JSX contenant le formulaire de paiement avec sections pour l'adresse et la carte bancaire
 */
const Paiement = () => {
  // Crée un état local formData avec useState pour stocker les valeurs des champs du formulaire
  // useState est un hook React qui retourne un tableau avec l'état actuel et une fonction pour le mettre à jour
  // Syntaxe : const [state, setState] = useState(initialValue)
  // initialValue est un objet avec les champs addressLine1, city, postalCode, region, cardNumber, expiryDate, cvv, tous initialisés à des chaînes vides
  // formData stocke les valeurs saisies par l'utilisateur (ex. { addressLine1: '123 Rue Exemple', city: 'Paris', ... })
  // setFormData est la fonction pour mettre à jour cet état
  const [formData, setFormData] = useState({
    addressLine1: '', // Chaîne pour l'adresse principale
    city: '', // Chaîne pour la ville
    postalCode: '', // Chaîne pour le code postal
    region: '', // Chaîne pour la région
    cardNumber: '', // Chaîne pour le numéro de carte bancaire
    expiryDate: '', // Chaîne pour la date d'expiration (format MM/YYYY)
    cvv: '', // Chaîne pour le code CVV
  });

  // Crée un état local errors avec useState pour stocker les messages d'erreur associés à chaque champ
  // Initialisé avec un objet vide, car aucun champ n'a d'erreur au départ
  // errors contient des paires clé-valeur où la clé est le nom du champ et la valeur est le message d'erreur
  // Exemple : { addressLine1: 'Ce champ est requis', cardNumber: 'Format invalide' }
  // setErrors est la fonction pour mettre à jour cet état
  const [errors, setErrors] = useState({});

  // Définit un objet statique regexPatterns contenant des expressions régulières (RegExp) pour valider chaque champ
  // Chaque propriété correspond à un champ et contient un RegExp pour tester la conformité de la valeur saisie
  // Les RegExp sont des objets JavaScript utilisés pour faire correspondre des motifs dans des chaînes
  const regexPatterns = {
    addressLine1: /.+/, // RegExp : Correspond à n'importe quelle chaîne non vide (au moins un caractère)
    city: /^[A-Za-z\s]+$/, // RegExp : Correspond aux lettres (majuscules ou minuscules) et espaces uniquement
    postalCode: /^\d{5}$/, // RegExp : Correspond à exactement 5 chiffres (ex. 75001 pour un code postal français)
    region: /^[A-Za-z\s]+$/, // RegExp : Identique à city, lettres et espaces uniquement
    cardNumber: /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, // RegExp : Correspond à 16 chiffres, avec espaces optionnels tous les 4 chiffres (ex. 1234 5678 9012 3456)
    expiryDate: /^(0[1-9]|1[0-2])\/\d{4}$/, // RegExp : Correspond au format MM/YYYY (mois 01-12, année à 4 chiffres, ex. 12/2025)
    cvv: /^\d{3,4}$/, // RegExp : Correspond à 3 ou 4 chiffres (ex. 123 ou 1234)
  };

  /**
   * Fonction : handleChange
   * Description : Gère les changements dans les champs du formulaire en mettant à jour l'état formData avec la nouvelle
   * valeur saisie par l'utilisateur. Déclenchée par l'événement onChange des éléments <input>.
   * Paramètres :
   * - e : Objet d'événement (Event) généré par l'interaction avec l'input, contenant les propriétés de l'élément (ex. e.target)
   * Retour : Aucun (effet secondaire : mise à jour de l'état formData)
   */
  const handleChange = (e) => {
    // Déstructure l'objet e.target pour extraire name (nom du champ, ex. 'addressLine1') et value (valeur saisie, ex. '123 Rue Exemple')
    // Syntaxe : const { prop1, prop2 } = objet
    // e.target est l'élément DOM déclenchant l'événement (ex. <input name="addressLine1" value="123 Rue Exemple">)
    const { name, value } = e.target;

    // setFormData met à jour l'état formData en créant un nouvel objet
    // Syntaxe : setState(newState)
    // ...formData utilise l'opérateur spread pour copier toutes les propriétés actuelles de formData
    // [name]: value utilise une propriété calculée pour mettre à jour le champ spécifié (ex. { addressLine1: '123 Rue Exemple' })
    // Exemple : Si name='city' et value='Paris', formData devient { ..., city: 'Paris' }
    setFormData({ ...formData, [name]: value });
  };

  /**
   * Fonction : validateForm
   * Description : Valide tous les champs du formulaire en vérifiant s'ils sont non vides et conformes aux expressions
   * régulières définies dans regexPatterns. Construit un objet d'erreurs pour les champs invalides, met à jour l'état errors,
   * et retourne un booléen indiquant si le formulaire est valide (aucune erreur).
   * Paramètres : Aucun
   * Retour : Booléen (true si le formulaire est valide, false s'il y a des erreurs)
   */
  const validateForm = () => {
    // Crée un objet vide pour stocker les messages d'erreur pour chaque champ invalide
    // newErrors sera rempli avec des paires clé-valeur (ex. { addressLine1: 'Ce champ est requis' })
    const newErrors = {};

    // Object.keys(formData) retourne un tableau des clés de l'objet formData
    // Syntaxe : Object.keys(objet)
    // Retour : Tableau de chaînes représentant les noms des champs (ex. ['addressLine1', 'city', 'postalCode', ...])
    // forEach est une méthode de tableau qui exécute une fonction pour chaque élément
    // Syntaxe : array.forEach(callback)
    // Callback arguments : key (nom du champ, ex. 'addressLine1'), index (position), array (tableau des clés)
    Object.keys(formData).forEach((key) => {
      // Vérifie si le champ est vide
      // !formData[key] retourne true si la valeur est une chaîne vide (''), null, ou undefined
      // formData[key] accède à la valeur du champ (ex. formData.addressLine1)
      if (!formData[key]) {
        // Si vide, ajoute un message d'erreur générique pour le champ
        // Syntaxe : objet[clé] = valeur
        newErrors[key] = 'Ce champ est requis';
      } else if (!regexPatterns[key].test(formData[key])) {
        // regexPatterns[key] récupère l'expression régulière pour le champ (ex. /.+/ pour addressLine1)
        // test est une méthode de RegExp qui vérifie si une chaîne correspond au motif
        // Syntaxe : RegExp.test(string)
        // Retour : Booléen (true si la chaîne correspond, false sinon)
        // Exemple : /^[A-Za-z\s]+$/.test('Paris') retourne true, mais false pour 'Paris123'
        // Si le test échoue, ajoute un message d'erreur spécifique selon le champ
        switch (key) {
          // Cas pour les champs city et region
          case 'city':
          case 'region':
            newErrors[key] = 'Seules les lettres et les espaces sont autorisés';
            break;
          // Cas pour le code postal
          case 'postalCode':
            newErrors[key] = 'Le code postal doit contenir 5 chiffres';
            break;
          // Cas pour le numéro de carte
          case 'cardNumber':
            newErrors[key] = 'Le numéro de carte doit contenir 16 chiffres';
            break;
          // Cas pour la date d'expiration
          case 'expiryDate':
            newErrors[key] = 'La date doit être au format MM/YYYY';
            break;
          // Cas pour le CVV
          case 'cvv':
            newErrors[key] = 'Le CVV doit contenir 3 ou 4 chiffres';
            break;
          // Cas par défaut pour addressLine1 ou autres
          default:
            newErrors[key] = 'Format invalide';
        }
      }
    });

    // setErrors met à jour l'état errors avec le nouvel objet d'erreurs
    // Syntaxe : setState(newState)
    // newErrors est un objet contenant les erreurs (ex. { city: 'Seules les lettres...' })
    setErrors(newErrors);

    // Object.keys(newErrors).length retourne le nombre de clés dans newErrors
    // Syntaxe : Object.keys(objet).length
    // Retour : Nombre (ex. 0 si aucune erreur, 2 si deux champs ont des erreurs)
    // Comparaison === 0 vérifie s'il n'y a aucune erreur
    // Retourne true si le formulaire est valide (aucune erreur), false sinon
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Fonction : handleSubmit
   * Description : Gère la soumission du formulaire en empêchant le rechargement par défaut de la page, appelle validateForm
   * pour vérifier la validité des champs, et journalise les données si le formulaire est valide ou les erreurs sinon.
   * Prévu pour accueillir une future logique de traitement des paiements (ex. appel API).
   * Paramètres :
   * - e : Objet d'événement (Event) représentant la soumission du formulaire, contient des informations sur l'événement
   * Retour : Aucun (effet secondaire : journalisation, mise à jour des erreurs)
   */
  const handleSubmit = (e) => {
    // e.preventDefault() empêche le comportement par défaut du formulaire, qui est de recharger la page
    // Syntaxe : event.preventDefault()
    // Cela permet de gérer la soumission via JavaScript
    e.preventDefault();

    // Appelle validateForm pour valider tous les champs du formulaire
    // validateForm retourne un booléen : true si valide, false si erreurs
    if (validateForm()) {
      // Si le formulaire est valide, journalise les données saisies pour débogage
      // console.log prend un message suivi de l'objet formData
      // formData contient les valeurs des champs (ex. { addressLine1: '123 Rue Exemple', ... })
      console.log('Form submitted successfully:', formData);
      // TODO : Ajouter la logique de traitement des paiements (ex. envoi à une API de paiement)
    } else {
      // Si le formulaire contient des erreurs, journalise l'objet errors pour débogage
      // errors contient les messages d'erreur (ex. { postalCode: 'Le code postal doit...' })
      console.log('Form validation failed:', errors);
    }
  };

  /**
   * Rendu JSX du composant
   * Description : Structure la page de paiement avec deux sections principales : une pour l'adresse de livraison
   * (adresse principale, ville, code postal, région) et une pour les informations de carte bancaire (numéro, date d'expiration,
   * CVV). Chaque champ est accompagné d'un label, d'un placeholder, et d'un message d'erreur conditionnel si le champ est
   * invalide. Inclut un logo Visa et un bouton de validation qui déclenche handleSubmit.
   * Retour : JSX représentant la page de paiement
   */
  return (
    // PaiementContainer est le conteneur principal stylisé pour la page
    <PaiementContainer>
      {/* Première section : Adresse de livraison */}
      <FormSection>
        {/* Champ pour l'adresse principale */}
        <InputWrapper>
          {/* Label affiche le texte 'Adresse ligne 1*' pour indiquer que le champ est requis */}
          <Label>Adresse ligne 1*</Label>
          {/* Input est un champ de saisie de texte lié à l'état formData */}
          <Input
            type="text" // Type d'input : texte, permet la saisie de caractères libres
            name="addressLine1" // Nom du champ, utilisé comme clé dans formData et handleChange
            value={formData.addressLine1} // Valeur contrôlée, liée à formData.addressLine1
            onChange={handleChange} // Événement onChange déclenche handleChange pour mettre à jour formData
            placeholder="Adresse ligne 1*" // Texte d'indication affiché quand le champ est vide
          />
          {/* Affiche un message d'erreur si errors.addressLine1 existe */}
          {/* Syntaxe : condition && élément rend l'élément si la condition est vraie */}
          {errors.addressLine1 && <ErrorMessage>{errors.addressLine1}</ErrorMessage>}
        </InputWrapper>

        {/* Champ pour la ville */}
        <InputWrapper>
          <Label>Ville*</Label>
          <Input
            type="text" // Type d'input : texte
            name="city" // Nom du champ
            value={formData.city} // Valeur liée à formData.city
            onChange={handleChange} // Gestionnaire d'événement
            placeholder="Ville*" // Texte d'indication
          />
          {errors.city && <ErrorMessage>{errors.city}</ErrorMessage>}
        </InputWrapper>

        {/* Conteneur pour aligner code postal et région côte à côte */}
        <InputRow>
          {/* Champ pour le code postal */}
          <InputWrapper>
            <Label>Code postal*</Label>
            {/* InputHalf est un Input stylisé avec une largeur flexible */}
            <InputHalf
              type="text" // Type d'input : texte
              name="postalCode" // Nom du champ
              value={formData.postalCode} // Valeur liée à formData.postalCode
              onChange={handleChange} // Gestionnaire d'événement
              placeholder="Code postal*" // Texte d'indication
            />
            {errors.postalCode && <ErrorMessage>{errors.postalCode}</ErrorMessage>}
          </InputWrapper>

          {/* Champ pour la région */}
          <InputWrapper>
            <Label>Région*</Label>
            <InputHalf
              type="text" // Type d'input : texte
              name="region" // Nom du champ
              value={formData.region} // Valeur liée à formData.region
              onChange={handleChange} // Gestionnaire d'événement
              placeholder="Région*" // Texte d'indication
            />
            {errors.region && <ErrorMessage>{errors.region}</ErrorMessage>}
          </InputWrapper>
        </InputRow>
      </FormSection>

      {/* Diviseur visuel entre les sections */}
      <Divider />

      {/* Deuxième section : Informations de carte bancaire */}
      <FormSection>
        {/* Logo Visa pour indiquer les types de cartes acceptées */}
        <VisaLogo
          src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" // URL de l'image du logo Visa
          alt="Visa" // Texte alternatif pour l'accessibilité
        />
        {/* Champ pour le numéro de carte bancaire */}
        <InputWrapper>
          <Label>Numéro de carte*</Label>
          <Input
            type="text" // Type d'input : texte
            name="cardNumber" // Nom du champ
            value={formData.cardNumber} // Valeur liée à formData.cardNumber
            onChange={handleChange} // Gestionnaire d'événement
            placeholder="0000 0000 0000 0000" // Placeholder suggérant le format attendu
          />
          {errors.cardNumber && <ErrorMessage>{errors.cardNumber}</ErrorMessage>}
        </InputWrapper>

        {/* Conteneur pour aligner date d'expiration et CVV côte à côte */}
        <InputRow>
          {/* Champ pour la date d'expiration */}
          <InputWrapper>
            <Label>Date d'expiration*</Label>
            <InputHalf
              type="text" // Type d'input : texte
              name="expiryDate" // Nom du champ
              value={formData.expiryDate} // Valeur liée à formData.expiryDate
              onChange={handleChange} // Gestionnaire d'événement
              placeholder="00/0000" // Placeholder suggérant MM/YYYY
            />
            {errors.expiryDate && <ErrorMessage>{errors.expiryDate}</ErrorMessage>}
          </InputWrapper>

          {/* Champ pour le code CVV */}
          <InputWrapper>
            <Label>CVV*</Label>
            <InputHalf
              type="text" // Type d'input : texte
              name="cvv" // Nom du champ
              value={formData.cvv} // Valeur liée à formData.cvv
              onChange={handleChange} // Gestionnaire d'événement
              placeholder="3-4 chiffres" // Placeholder suggérant 3 ou 4 chiffres
            />
            {errors.cvv && <ErrorMessage>{errors.cvv}</ErrorMessage>}
          </InputWrapper>
        </InputRow>
      </FormSection>

      {/* Bouton de validation du formulaire, déclenche handleSubmit au clic */}
      <SubmitButton onClick={handleSubmit}>VALIDER</SubmitButton>
    </PaiementContainer>
  );
};

/** Exportation du composant Paiement pour utilisation dans les routes */
export default Paiement;