# ⚽ NEXT GOAL — Guide de déploiement

## 🚀 Mise en ligne en 30 minutes

---

## ÉTAPE 1 — Créer la base de données Supabase (10 min)

1. Va sur **https://supabase.com** et crée un compte gratuit
2. Clique **"New project"** → nomme-le `next-goal`
3. Note le mot de passe (tu en auras besoin)
4. Va dans **SQL Editor** (menu gauche)
5. Copie-colle tout le contenu de `supabase/schema.sql`
6. Clique **"Run"**

7. Va dans **Settings > API** et note :
   - **Project URL** (ex: https://xxxx.supabase.co)
   - **anon public key** (commence par eyJ...)

---

## ÉTAPE 2 — Configurer les variables d'environnement (2 min)

1. Copie le fichier `.env.example` en `.env.local`
2. Remplis les valeurs Supabase :
```
VITE_SUPABASE_URL=https://TON_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

---

## ÉTAPE 3 — Déployer sur Vercel (10 min)

### Option A — Via GitHub (recommandé)
1. Crée un compte sur **https://github.com**
2. Crée un nouveau dépôt `next-goal`
3. Uploade tous les fichiers
4. Va sur **https://vercel.com** → "New Project" → importe ton repo GitHub
5. Dans Vercel, ajoute les variables d'environnement :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Clique **Deploy** → ton site est en ligne !

### Option B — Via Vercel CLI
```bash
npm install -g vercel
npm install
vercel
```

---

## ÉTAPE 4 — Configurer ton compte admin (2 min)

1. Va sur ton site et inscris-toi avec `bakary.sy.sawane@gmail.com`
2. Dans Supabase → **SQL Editor**, exécute :
```sql
UPDATE profiles SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'bakary.sy.sawane@gmail.com');
```

Tu as maintenant accès au dashboard admin pour valider les profils !

---

## ÉTAPE 5 — Configurer l'API Claude pour l'IA (5 min)

1. Va sur **https://console.anthropic.com**
2. Crée une API key
3. Dans Supabase → **Settings > API > CORS** : ajoute ton domaine Vercel
4. Ajoute dans les variables Vercel : `VITE_ANTHROPIC_API_KEY=sk-ant-...`

---

## 🛠️ Développement local

```bash
npm install
cp .env.example .env.local
# Remplis .env.local avec tes clés Supabase
npm run dev
```

Ouvre **http://localhost:5173**

---

## 📁 Structure du projet

```
next-goal/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx        # Navigation
│   │   ├── PlayerCard.jsx    # Carte joueur
│   │   └── ContactModal.jsx  # Modal de contact
│   ├── pages/
│   │   ├── Home.jsx          # Page d'accueil (visiteurs)
│   │   ├── Login.jsx         # Connexion
│   │   ├── SignupChoice.jsx   # Choix du profil
│   │   ├── SignupJoueur.jsx  # Inscription joueur (3 étapes)
│   │   ├── SignupPro.jsx     # Inscription pro
│   │   ├── SignupSuccess.jsx # Confirmation
│   │   ├── Players.jsx       # Annuaire + recherche IA
│   │   ├── PlayerDetail.jsx  # Fiche joueur complète
│   │   ├── MyProfile.jsx     # Mon profil (joueur)
│   │   ├── Messages.jsx      # Messagerie
│   │   └── Admin.jsx         # Dashboard admin
│   ├── lib/
│   │   └── supabase.js       # Client Supabase + auth helpers
│   ├── App.jsx               # Routing principal
│   ├── main.jsx              # Point d'entrée
│   └── index.css             # Styles globaux
└── supabase/
    └── schema.sql            # Base de données complète
```

---

## ✨ Fonctionnalités

- ✅ Inscription / Connexion par rôle (joueur / recruteur / agent / club / admin)
- ✅ Profil joueur complet (stats, vidéos, physique)
- ✅ Annuaire avec filtres (poste, région, catégorie, niveau)
- ✅ Recherche IA par description naturelle (Claude)
- ✅ Génération automatique de description IA par profil
- ✅ Messagerie interne
- ✅ Dashboard admin (valider / refuser les profils)
- ✅ Design sombre violet / Next Goal
- ✅ Compatible mobile (PWA-ready)
- ✅ Sécurité RLS (chaque utilisateur voit ses données)

---

## 🔗 Liens utiles

- Supabase : https://supabase.com
- Vercel : https://vercel.com  
- Claude API : https://console.anthropic.com
- Site actuel Softr : https://next-goal.softr.app

---

Contact : bakary.sy.sawane@gmail.com
