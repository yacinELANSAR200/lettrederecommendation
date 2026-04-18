# Générateur de Lettres de Recommandation - CRMEF

Application web pour générer des lettres de recommandation professionnelles pour les stagiaires du CRMEF.

## Fonctionnalités

- **Formulaire interactif** : Saisie des informations de l'établissement, de l'enseignant et du stagiaire
- **Appréciations adaptatives** : Les options s'ajustent automatiquement selon le genre du/de la stagiaire
- **Compétences pédagogiques** : Sélection multiple avec option "Tout sélectionner"
- **Qualités personnelles** : Sélection multiple avec option "Tout sélectionner"
- **Zone de signature** : Dessin à main levée ou importation d'image
- **Génération PDF** : Export en PDF avec mise en page optimisée
- **Copie du texte** : Copier le contenu de la lettre dans le presse-papiers
- **Suggestions rapides** : Insertion facile d'observations personnalisées

## Prérequis

- Un navigateur moderne (Chrome, Firefox, Edge, Safari)
- Connexion internet (pour charger la bibliothèque html2pdf.js)

## Installation

1. Cloner ou télécharger le projet
2. Ouvrir le fichier `index.html` dans un navigateur

Ou déployer sur un serveur web (Vercel, GitHub Pages, etc.)

## Structure du projet

```
├── index.html    # Structure HTML de l'application
├── style.css     # Styles CSS
├── script.js     # Logique JavaScript
└── README.md     # Ce fichier
```

## Utilisation

### 1. Onglet "Informations"

- **Établissement** : Remplir les informations de l'établissement (pré-rempli par défaut)
- **Enseignant(e)** : Saisir le nom, matière et genre de l'enseignant encadrant
- **Stagiaire** : Sélectionner un/une stagiaire dans la liste déroulante
- **Période de stage** : Choisir l'année scolaire
- **Signature** : Dessiner la signature ou importer une image

### 2. Onglet "Compétences"

- Sélectionner les compétences pédagogiques observées
- Ajouter des compétences personnalisées en champ libre
- Sélectionner les qualités personnelles du/de la stagiaire

### 3. Onglet "Stagiaires"

- Gérer la liste des stagiaires
- Ajouter/supprimer des noms

### 4. Générer la lettre

- Cliquer sur **"Aperçu de la lettre"** pour mettre à jour la prévisualisation
- Cliquer sur **"Imprimer"** pour télécharger le PDF
- Cliquer sur **"Copier"** pour copier le texte

## Personnalisation

### Modifier les suggestions d'observations

Dans `script.js`, modifier le tableau `SUGGESTIONS_OBS` :

```javascript
const SUGGESTIONS_OBS = [
  'Votre suggestion ici...',
  'Autre suggestion...'
];
```

### Modifier les compétences

Dans `script.js`, modifier les tableaux `COMPETENCES` et `QUALITES`.

### Modifier les valeurs par défaut

Dans `script.js`, modifier la fonction `init()` ou les attributs `value` dans `index.html`.

## Déploiement sur Vercel

1. Créer un repository GitHub
2. Pousser le code
3. Sur [vercel.com](https://vercel.com), importer le repository
4. Cliquer sur "Deploy"

## Support

Pour toute question ou amélioration, contactez le développeur.

---

© 2026 - CRMEF
