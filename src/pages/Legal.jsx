import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Legal.css'

export default function Legal() {
  const [tab, setTab] = useState('mentions')

  return (
    <div className="nglg-page">
      <div className="nglg-container">
        <Link to="/" className="nglg-back">← Retour à l'accueil</Link>
        <h1 className="nglg-title">Informations légales</h1>

        <div className="nglg-tabs">
          <button className={tab === 'mentions' ? 'active' : ''} onClick={() => setTab('mentions')}>Mentions légales</button>
          <button className={tab === 'confidentialite' ? 'active' : ''} onClick={() => setTab('confidentialite')}>Confidentialité</button>
          <button className={tab === 'cgu' ? 'active' : ''} onClick={() => setTab('cgu')}>CGU</button>
        </div>

        {tab === 'mentions' && (
          <div className="nglg-content">
            <h2>Mentions légales</h2>

            <h3>Éditeur du site</h3>
            <p>Le site et l'application Next Goal (ci-après « la Plateforme ») sont édités par Bakary Sy, éditant à titre personnel.</p>
            <p>Contact : bakary.sy.sawane@gmail.com<br />Localisation : Île-de-France, France.</p>

            <h3>Directeur de la publication</h3>
            <p>Le directeur de la publication est Bakary Sy.</p>

            <h3>Hébergement</h3>
            <p>La Plateforme est hébergée par Vercel Inc. (340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis — vercel.com). Les données sont gérées via le service Supabase.</p>

            <h3>Propriété intellectuelle</h3>
            <p>L'ensemble des éléments de la Plateforme (nom, logo, charte graphique, textes, structure) est protégé. Toute reproduction sans autorisation est interdite. Les contenus publiés par les utilisateurs (photos, vidéos, textes) restent la propriété de leurs auteurs, qui autorisent Next Goal à les afficher dans le cadre du fonctionnement de la Plateforme.</p>

            <h3>Contact</h3>
            <p>Pour toute question : bakary.sy.sawane@gmail.com.</p>
          </div>
        )}

        {tab === 'confidentialite' && (
          <div className="nglg-content">
            <h2>Politique de confidentialité</h2>
            <p>La protection de tes données personnelles est une priorité pour Next Goal. Cette politique explique quelles données nous collectons, pourquoi, et quels sont tes droits.</p>

            <h3>Responsable des données</h3>
            <p>Le responsable du traitement est Bakary Sy, éditeur de Next Goal, joignable à bakary.sy.sawane@gmail.com.</p>

            <h3>Données collectées</h3>
            <p>Selon que tu es joueur/joueuse ou professionnel, nous collectons : nom, prénom, email, mot de passe (stocké de façon sécurisée) ; pour les joueurs : date de naissance, âge, région, club, poste, statistiques, photo, liens vidéo, et coordonnées d'un représentant légal si le joueur est mineur ; pour les professionnels : organisation, rôle, coordonnées et justificatif de statut. Nous collectons aussi les messages échangés et les profils consultés.</p>

            <h3>Protection des mineurs</h3>
            <p>Next Goal accorde une attention particulière aux mineurs. Si un joueur a moins de 18 ans : l'inscription requiert le consentement et les coordonnées d'un représentant légal ; celui-ci est informé des échanges concernant le mineur ; certaines informations sensibles (comme la ville précise) ne sont pas affichées publiquement. Le représentant légal peut à tout moment demander la modification ou la suppression des données en écrivant à bakary.sy.sawane@gmail.com.</p>

            <h3>Utilisation des données</h3>
            <p>Tes données servent uniquement à créer et gérer ton compte, permettre la mise en relation entre joueurs et professionnels, assurer la sécurité de la Plateforme, et te contacter si nécessaire. Elles ne sont jamais vendues à des tiers.</p>

            <h3>Conservation</h3>
            <p>Tes données sont conservées tant que ton compte est actif. Si tu supprimes ton compte, ou après une inactivité prolongée, tes données sont supprimées, sauf obligation légale.</p>

            <h3>Tes droits</h3>
            <p>Conformément au RGPD, tu disposes d'un droit d'accès, de rectification, d'effacement, d'opposition, de limitation et de portabilité. Pour les exercer, écris à bakary.sy.sawane@gmail.com. Tu peux aussi saisir la CNIL (cnil.fr).</p>

            <h3>Sécurité</h3>
            <p>Nous mettons en œuvre des mesures pour protéger tes données (mots de passe chiffrés, accès restreint, vérification des professionnels). Aucune plateforme ne pouvant garantir une sécurité absolue, nous t'invitons à ne jamais partager d'informations trop sensibles et à signaler tout comportement suspect.</p>
          </div>
        )}

        {tab === 'cgu' && (
          <div className="nglg-content">
            <h2>Conditions Générales d'Utilisation</h2>
            <p>En utilisant Next Goal, tu acceptes les présentes conditions.</p>

            <h3>Objet</h3>
            <p>Next Goal est une plateforme gratuite de mise en relation entre joueurs et joueuses de football amateur d'une part, et professionnels du football (recruteurs, agents, clubs) d'autre part.</p>

            <h3>Accès et inscription</h3>
            <p>L'inscription est gratuite. Tu t'engages à fournir des informations exactes. Si tu es mineur, tu dois avoir l'autorisation de ton représentant légal, dont les coordonnées sont obligatoires. Les professionnels doivent fournir un justificatif de leur statut et sont vérifiés avant validation.</p>

            <h3>Engagements des utilisateurs</h3>
            <p>Tu t'engages à respecter les autres utilisateurs, à ne publier que des contenus dont tu détiens les droits et qui te concernent, à ne pas usurper l'identité d'autrui, et à ne pas utiliser la Plateforme à des fins illégales ou malveillantes.</p>

            <h3>Protection des mineurs — règles pour les professionnels</h3>
            <p>Les professionnels s'engagent à interagir de manière strictement professionnelle et respectueuse avec tous les joueurs, à ne jamais contacter un joueur mineur en dehors du cadre prévu et de l'information de son représentant légal, et à signaler tout comportement inapproprié. Tout manquement entraîne l'exclusion immédiate et définitive de la Plateforme.</p>

            <h3>Signalement</h3>
            <p>Un dispositif de signalement est accessible sur les profils et dans la messagerie. Chaque signalement est examiné et les mesures appropriées sont prises.</p>

            <h3>Responsabilité</h3>
            <p>Next Goal met en relation les utilisateurs mais n'est pas partie aux échanges qui peuvent en résulter, et ne garantit pas qu'un joueur sera repéré. Next Goal ne peut être tenu responsable des propos ou comportements des utilisateurs, mais s'engage à agir rapidement en cas de signalement.</p>

            <h3>Suspension et exclusion</h3>
            <p>Next Goal se réserve le droit de suspendre ou supprimer tout compte ne respectant pas les présentes conditions, en particulier en cas de comportement mettant en danger la sécurité des utilisateurs, notamment des mineurs.</p>

            <h3>Contact</h3>
            <p>Pour toute question : bakary.sy.sawane@gmail.com.</p>
          </div>
        )}

        <div className="nglg-date">Dernière mise à jour : février 2026</div>
      </div>
    </div>
  )
}
