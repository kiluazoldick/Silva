# 🌿 Silva - Application de Gestion d'Entreprise

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC)
![Supabase](https://img.shields.io/badge/Supabase-2.x-3ECF8E)

## 📋 Description

**Silva** est une application web complète de gestion d'entreprise permettant aux chefs d'entreprise de gérer facilement leurs employés, leurs tâches, les présences et d'analyser les performances de leur structure.

### 🎯 Objectif

Fournir une solution tout-en-un simple, rapide et intuitive pour les petites et moyennes entreprises qui souhaitent digitaliser leur gestion interne sans complexité.

---

## ✨ Fonctionnalités

### 🔐 Authentification
- Connexion par email/mot de passe
- Connexion avec Google OAuth
- Inscription sécurisée
- Protection des routes

### 🏢 Gestion de l'entreprise
- Création d'entreprise avec secteur d'activité
- Upload de logo personnalisé
- Modification des informations
- Suppression sécurisée

### 👥 Gestion des employés
- Ajout / Modification / Suppression d'employés
- Recherche et filtres avancés
- Assignation de postes et départements
- Suivi des statuts (Actif/Congé/Inactif)
- Contact d'urgence

### ✅ Gestion des tâches
- Vue Kanban (À faire / En cours / Terminé)
- Drag & Drop pour changer de statut
- Assignation aux employés
- Priorités (Basse/Moyenne/Haute/Urgente)
- Dates d'échéance
- Tags personnalisables

### ⏱️ Gestion des présences
- Enregistrement des heures par employé
- Historique détaillé
- Statistiques mensuelles
- Export CSV
- Notes (congé, maladie, télétravail)

### 📊 Tableau de bord & Statistiques
- KPIs en temps réel
- Graphiques d'activité
- Classement des employés
- Analyse des tâches
- Export des données

---

## 🛠️ Stack Technique

| Technologie | Version | Utilisation |
|-------------|---------|-------------|
| Next.js | 14.2 | Framework React (App Router) |
| TypeScript | 5.0 | Typage statique |
| TailwindCSS | 3.4 | Styling responsive |
| Supabase | 2.x | Base de données & Auth |
| Zustand | 4.x | Gestion d'état |
| React Hook Form | 7.x | Gestion des formulaires |
| Zod | 3.x | Validation des données |
| Recharts | 2.x | Graphiques statistiques |
| Lucide React | 0.x | Icônes |
| date-fns | 3.x | Manipulation des dates |

---

## 📁 Structure du Projet

```
silva/
├── app/
│   ├── (auth)/              # Pages authentification
│   │   ├── login/
│   │   ├── register/
│   │   └── company-setup/
│   ├── (dashboard)/         # Pages protégées
│   │   ├── dashboard/
│   │   ├── employees/
│   │   ├── tasks/
│   │   ├── attendance/
│   │   ├── statistics/
│   │   └── company/
│   ├── auth/
│   │   └── callback/        # Callback OAuth
│   ├── landing/             # Page d'accueil
│   └── layout.tsx
├── components/
│   ├── ui/                  # Composants réutilisables
│   ├── employees/           # Composants employés
│   ├── tasks/               # Composants tâches
│   ├── attendance/          # Composants présence
│   ├── statistics/          # Composants statistiques
│   └── company/             # Composants entreprise
├── lib/
│   ├── supabase/            # Client Supabase
│   ├── store/               # Stores Zustand
│   └── utils/               # Utilitaires
├── types/                   # Types TypeScript
├── hooks/                   # Hooks personnalisés
└── middleware.ts            # Protection des routes
```

---

## 🚀 Installation

### Prérequis

- Node.js 18+ 
- npm ou yarn
- Compte Supabase

### 1. Cloner le projet

```bash
git clone https://github.com/kiluazoldick/Silva
cd silva
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration Supabase

Créez un fichier `.env.local` à la racine :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anonym_key
```

### 4. Exécuter les migrations SQL

Dans l'éditeur SQL de Supabase, exécutez les scripts fournis pour créer :
- Les tables (companies, employees, tasks, attendance)
- Les index
- Les politiques RLS

### 5. Configurer l'authentification Google (optionnel)

1. Aller dans [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un projet
3. Activer Google+ API
4. Créer des identifiants OAuth 2.0
5. Configurer les URLs de redirection
6. Ajouter Client ID et Secret dans Supabase → Authentication → Providers

### 6. Lancer l'application

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

---

## 📦 Build pour production

```bash
npm run build
npm start
```

## 🌐 Déploiement sur Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/votre-repo/silva)

1. Connectez votre dépôt GitHub à Vercel
2. Ajoutez les variables d'environnement
3. Déployez !

---

## 🗄️ Structure de la Base de Données

### Tables principales

| Table | Description |
|-------|-------------|
| `companies` | Informations des entreprises |
| `employees` | Données des employés |
| `tasks` | Gestion des tâches |
| `attendance` | Enregistrement des présences |
| `activity_logs` | Logs d'activité |
| `departments` | Départements |

### Relations

```
companies (1) ──< (∞) employees
companies (1) ──< (∞) tasks
employees (1) ──< (∞) tasks
employees (1) ──< (∞) attendance
```

---

## 🔒 Politiques de sécurité (RLS)

Toutes les tables sont protégées par RLS (Row Level Security) :
- Les utilisateurs ne voient que leurs propres données
- Les admins gèrent leur entreprise
- Les employés accèdent à leurs informations

---

## 📱 Responsive Design

L'application est entièrement responsive :
- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (320px - 767px)

---

## 🧪 Tests recommandés

### Authentification
- [ ] Inscription par email
- [ ] Connexion par email
- [ ] Connexion Google
- [ ] Déconnexion

### Entreprise
- [ ] Création d'entreprise
- [ ] Upload de logo
- [ ] Modification des infos

### Employés
- [ ] Ajout/Modification/Suppression
- [ ] Recherche et filtres
- [ ] Assignation de postes

### Tâches
- [ ] Création de tâches
- [ ] Drag & drop Kanban
- [ ] Assignation aux employés

### Présences
- [ ] Enregistrement des heures
- [ ] Consultation historique
- [ ] Export CSV

---

## 🤝 Contribution

Les contributions sont les bienvenues ! 

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez (`git commit -m 'Add some AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT.

---

## 📞 Support

Pour toute question ou problème :
- 📧 Email : support@silva.com
- 🐛 Issues : [GitHub Issues](https://github.com/votre-repo/silva/issues)

---

## 🙏 Remerciements

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/)

---

## 📊 Roadmap

- [ ] Notifications (email/SMS)
- [ ] Export PDF des rapports
- [ ] Mode sombre
- [ ] Application mobile (React Native)
- [ ] API publique
- [ ] Intégration calendrier (Google Calendar, Outlook)
- [ ] Messagerie interne
- [ ] Gestion des congés

---

## 👨‍💻 Auteur

**Silva Team** - *Développement & Design*

---

⭐ **N'oubliez pas de laisser une étoile si ce projet vous a aidé !**