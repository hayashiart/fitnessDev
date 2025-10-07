-- TABLE INSCRIT
CREATE TABLE INSCRIT (
    id_inscrit SERIAL PRIMARY KEY,
    email_inscrit VARCHAR(250) NOT NULL UNIQUE,
    nom_inscrit VARCHAR(30) NOT NULL,
    prenom_inscrit VARCHAR(30) NOT NULL,
    adresse_inscrit VARCHAR(50) NOT NULL,
    telephone_inscrit VARCHAR(15) NOT NULL,
    mdp_inscrit VARCHAR(60) NOT NULL,
    type_inscrit VARCHAR(10) NOT NULL,
    date_naissance DATE NOT NULL,
    civilite_inscrit VARCHAR(30) NOT NULL
);

-- TABLE TYPE_ABONNEMENT
CREATE TABLE TYPE_ABONNEMENT (
    id_type_abonnement SERIAL PRIMARY KEY,
    nom_type_abonnement VARCHAR(20) NOT NULL UNIQUE,
    prix_4s_type_abonnement DECIMAL(10,2) NOT NULL
);

-- TABLE COACH
CREATE TABLE COACH (
    id_coach SERIAL PRIMARY KEY,
    nom_coach VARCHAR(50) NOT NULL,
    specialite_coach VARCHAR(50)
);

-- TABLE PRODUIT
CREATE TABLE PRODUIT (
    id_produit SERIAL PRIMARY KEY,
    nom_produit VARCHAR(50) NOT NULL,
    prix_produit DECIMAL(10,2) NOT NULL
);

-- TABLE ACHAT
CREATE TABLE ACHAT (
    id_achat SERIAL PRIMARY KEY,
    date_achat DATE NOT NULL,
    quantite_achat INT NOT NULL,
    id_inscrit INT,
    id_produit INT,
    FOREIGN KEY(id_inscrit) REFERENCES INSCRIT(id_inscrit),
    FOREIGN KEY(id_produit) REFERENCES PRODUIT(id_produit)
);

-- TABLE COURS
CREATE TABLE COURS (
    id_cours SERIAL PRIMARY KEY,
    nom_cours VARCHAR(50) NOT NULL,
    duree_cours INT NOT NULL,
    datetime_cours TIMESTAMP NOT NULL,
    prix_cours DECIMAL(10,2) NOT NULL,
    id_coach INT,
    FOREIGN KEY(id_coach) REFERENCES COACH(id_coach)
);

-- TABLE INSCRIPTION
CREATE TABLE INSCRIPTION (
    id_inscription SERIAL PRIMARY KEY,
    date_inscription TIMESTAMP NOT NULL,
    id_inscrit INT,
    id_cours INT,
    FOREIGN KEY(id_inscrit) REFERENCES INSCRIT(id_inscrit),
    FOREIGN KEY(id_cours) REFERENCES COURS(id_cours)
);

-- TABLE PAIEMENT
CREATE TABLE PAIEMENT (
    id_paiement SERIAL PRIMARY KEY,
    montant_paiement DECIMAL(10,2) NOT NULL,
    date_paiement DATE NOT NULL,
    type_paiement VARCHAR(20) NOT NULL,
    id_cours INT,
    id_achat INT,
    id_abonnement INT,
    id_inscrit INT,
    FOREIGN KEY(id_cours) REFERENCES COURS(id_cours),
    FOREIGN KEY(id_achat) REFERENCES ACHAT(id_achat),
    FOREIGN KEY(id_abonnement) REFERENCES ABONNEMENT(id_abonnement),
    FOREIGN KEY(id_inscrit) REFERENCES INSCRIT(id_inscrit)
);

-- TABLE ABONNEMENT
CREATE TABLE ABONNEMENT (
    id_abonnement SERIAL PRIMARY KEY,
    duree_abonnement INT NOT NULL,
    datedebut_abonnement DATE NOT NULL,
    datefin_abonnement DATE NOT NULL,
    prix_abonnement DECIMAL(10,2) NOT NULL,
    actif_abonnement BOOLEAN,
    id_inscrit INT,
    id_type_abonnement INT,
    FOREIGN KEY(id_inscrit) REFERENCES INSCRIT(id_inscrit),
    FOREIGN KEY(id_type_abonnement) REFERENCES TYPE_ABONNEMENT(id_type_abonnement)
);

-- Insertion dans INSCRIT
INSERT INTO INSCRIT (email_inscrit, nom_inscrit, prenom_inscrit, adresse_inscrit, telephone_inscrit, mdp_inscrit, type_inscrit, date_naissance, civilite_inscrit)
VALUES
    ('jean.dupont@example.com', 'Dupont', 'Jean', '12 Rue de la Paix, Paris', '0601020304', '$2b$10$Dgp7.dgp7.dgp7.dgp7.dgp7.dgp7.dgp7.dg...', 'particulier', '1990-05-15', 'Monsieur'),
    ('marie.martin@example.com', 'Martin', 'Marie', '34 Avenue des Champs, Lyon', '0612345678', '$2b$10$Dgp7.dgp7.dgp7.dgp7.dgp7.dgp7.dgp7.dg...', 'particulier', '1995-08-20', 'Madame');

-- Insertion dans TYPE_ABONNEMENT
INSERT INTO TYPE_ABONNEMENT (nom_type_abonnement, prix_4s_type_abonnement)
VALUES
    ('ESSENTIAL', 31.96),
    ('ORIGINAL', 39.96),
    ('ULTRA', 43.96);

-- Insertion dans COACH
INSERT INTO COACH (nom_coach, specialite_coach)
VALUES
    ('Marc', 'Cours Collectifs'),
    ('Sophie', 'Pole Dance'),
    ('Léa', 'Crosstraining'),
    ('Paul', 'Boxe'),
    ('Lucas', 'MMA');

-- Insertion dans PRODUIT
INSERT INTO PRODUIT (nom_produit, prix_produit)
VALUES
    ('Protéines', 40.00),
    ('Boissons', 5.00);

-- Insertion dans ACHAT
INSERT INTO ACHAT (date_achat, quantite_achat, id_inscrit, id_produit)
VALUES
    ('2025-04-10', 2, 1, 1), -- Jean : 2x Protéines
    ('2025-04-12', 3, 2, 2); -- Marie : 3x Boissons

-- Insertion dans COURS
INSERT INTO COURS (nom_cours, duree_cours, datetime_cours, prix_cours, id_coach)
VALUES
    ('Cours Collectifs', 60, '2025-04-07 10:00:00', 20.00, 1),
    ('Pole Dance', 60, '2025-04-08 10:00:00', 25.00, 2),
    ('Crosstraining', 60, '2025-04-09 10:00:00', 22.00, 3),
    ('Boxe', 60, '2025-04-10 10:00:00', 30.00, 4),
    ('Haltérophilie', 60, '2025-04-11 10:00:00', 28.00, 5),
    ('MMA', 60, '2025-04-12 10:00:00', 35.00, 5);

-- Insertion dans INSCRIPTION
INSERT INTO INSCRIPTION (date_inscription, id_inscrit, id_cours)
VALUES
    ('2025-04-07 10:00:00', 1, 1), -- Jean : Cours Collectifs
    ('2025-04-08 10:00:00', 1, 2), -- Jean : Pole Dance
    ('2025-04-09 10:00:00', 1, 3), -- Jean : Crosstraining
    ('2025-04-10 10:00:00', 2, 4), -- Marie : Boxe
    ('2025-04-11 10:00:00', 2, 5), -- Marie : Haltérophilie
    ('2025-04-12 10:00:00', 2, 6); -- Marie : MMA

-- Insertion dans ABONNEMENT
INSERT INTO ABONNEMENT (duree_abonnement, datedebut_abonnement, datefin_abonnement, prix_abonnement, actif_abonnement, id_inscrit, id_type_abonnement)
VALUES
    (180, '2025-04-01', '2025-09-30', 263.76, true, 1, 3), -- Jean : Abonnement ULTRA
    (30, '2025-04-01', '2025-04-30', 31.96, true, 2, 1); -- Marie : Abonnement ESSENTIAL

-- Insertion dans PAIEMENT
INSERT INTO PAIEMENT (montant_paiement, date_paiement, type_paiement, id_cours, id_achat, id_abonnement, id_inscrit)
VALUES
    (20.00, '2025-04-07', 'carte', 1, NULL, NULL, 1), -- Jean : Cours Collectifs
    (25.00, '2025-04-08', 'paypal', 2, NULL, NULL, 1), -- Jean : Pole Dance
    (22.00, '2025-04-09', 'virement', 3, NULL, NULL, 1), -- Jean : Crosstraining
    (30.00, '2025-04-10', 'carte', 4, NULL, NULL, 2), -- Marie : Boxe
    (28.00, '2025-04-11', 'paypal', 5, NULL, NULL, 2), -- Marie : Haltérophilie
    (35.00, '2025-04-12', 'virement', 6, NULL, NULL, 2), -- Marie : MMA
    (263.76, '2025-04-01', 'carte', NULL, NULL, 1, 1), -- Jean : Abonnement ULTRA
    (31.96, '2025-04-01', 'carte', NULL, NULL, 2, 2), -- Marie : Abonnement ESSENTIAL
    (80.00, '2025-04-10', 'carte', NULL, 1, NULL, 1), -- Jean : 2x Protéines
    (15.00, '2025-04-12', 'carte', NULL, 2, NULL, 2); -- Marie : 3x Boissons