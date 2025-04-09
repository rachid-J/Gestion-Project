# Système de Gestion de Projets

Une application web full-stack pour gérer efficacement les projets, les équipes et les tâches. Construite avec des technologies modernes et les meilleures pratiques.

## 🚀 Fonctionnalités

- **Gestion de Projets**
  - Créer et gérer plusieurs projets
  - Collaboration en équipe et gestion des membres
  - Suivi et attribution des tâches
  - Surveillance de la progression des projets

- **Collaboration d'Équipe**
  - Contrôle d'accès basé sur les rôles
  - Gestion des membres de l'équipe
  - Invitations aux projets
  - Suivi des activités

- **Gestion des Utilisateurs**
  - Authentification sécurisée
  - Gestion des profils
  - Permissions basées sur les rôles
  - Suivi des activités utilisateur

## 🛠️ Technologies Utilisées

### Frontend
- React 19
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS
- Material-UI
- Axios
- Heroicons
- Recharts

### Backend
- Laravel
- PHP
- MySQL
- API RESTful

## 📦 Installation

### Prérequis
- Node.js (v18 ou supérieur)
- PHP (v8.1 ou supérieur)
- Composer
- MySQL

### Configuration du Frontend
```bash
# Installer les dépendances principales
npm install @emotion/react @emotion/styled @headlessui/react @heroicons/react @mui/material @mui/styled-engine @reduxjs/toolkit @tailwindcss/vite axios express moment react react-dom react-redux react-router-dom recharts tailwindcss

# Installer les dépendances de développement
npm install --save-dev @eslint/js @types/react @types/react-dom @vitejs/plugin-react-swc eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals vite

# Installer Tailwind CSS
npx tailwindcss init -p

# Lancer l'application
npm run dev
```

### Configuration du Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

## 🔧 Configuration

1. Créer un fichier `.env` dans le répertoire backend basé sur `.env.example`
2. Configurer votre connexion à la base de données
3. Configurer les variables d'environnement du frontend

## 🚀 Développement

### Développement Frontend
```bash
cd Frontend
npm run dev
```

### Développement Backend
```bash
cd backend
php artisan serve
```

## 📁 Structure du Projet

```
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── Redux/
│   │   └── assets/
├── backend/
│   ├── app/
│   ├── routes/
│   ├── config/
│   ├── database/
│   └── tests/
```

## 🤝 Contribution

1. Forker le dépôt
2. Créer votre branche de fonctionnalité (`git checkout -b feature/NouvelleFonctionnalite`)
3. Commiter vos changements (`git commit -m 'Ajouter une nouvelle fonctionnalité'`)
4. Pousser vers la branche (`git push origin feature/NouvelleFonctionnalite`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.

## 👥 Auteurs

- Rachid
- Ali Riad 
- Walid Ait Baha 

## 🙏 Remerciements

- Merci à tous les contributeurs
- La communauté open source
- Toutes les incroyables bibliothèques et frameworks utilisés dans ce projet
