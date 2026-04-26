import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp, supabase } from '../lib/supabase'

const REGIONS = ['Île-de-France','PACA','Occitanie','Auvergne-Rhône-Alpes','Nouvelle-Aquitaine',
  'Hauts-de-France','Grand Est','Normandie','Bretagne','Pays de la Loire',
  'Centre-Val de Loire','Bourgogne-Franche-Comté','Corse']
const POSTES = ['Gardien de but','Défenseur central','Latéral droit','Latéral gauche',
  'Milieu défensif','Milieu central','Milieu offensif','Ailier droit','Ailier gauche','Attaquant']
const NIVEAUX = ['National 3','Régional 1','Régional 2','Régional 3','Départemental 1','Départemental 2','Loisir']
const CATEGORIES = ['U17','U18','U19','U21','Senior','Vétéran']

const S = {
  input: { padding:'10px 14px', background:'rgba(255,255,255,0.04)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text)', fontFamily:'var(--font)', fontSize:'14px', outline:'none', width:'100%' },
  label: { fontSize:'12px', fontWeight:'500', color:'var(--text2)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'4px', display:'block' },
  fg: { display:'flex', flexDirection:'column', gap:'4px' },
  grid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' },
}

export default function SignupJoueur() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    email:'', password:'', confirmPassword:'',
    nom:'', prenom:'', date_naissance:'', nationalite:'Française',
    ville:'', region:'', taille:'', poids:'',
    pied_fort:'Droit', poste_principal:'', poste_secondaire:'',
    club_actuel:'', categorie:'', niveau_championnat:'',
    matchs_joues:'', buts:'', passes_decisives:'', clean_sheets:'',
    video_highlights:'', video_match:'', objectif:'', ouvert_opportunites:true,
    whatsapp:'', instagram:'', tiktok:'',
  })

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async () => {
    if (form.password !== form.confirmPassword) { setError('Les mots de passe ne correspondent pas.'); return }
    setLoading(true); setError('')
    try {
      const data = await signUp(form.email, form.password, 'player', `${form.prenom} ${form.nom}`)
      if (data.user) {
        const age = form.date_naissance ? Math.floor((Date.now() - new Date(form.date_naissance)) / 31557600000) : null
        await supabase.from('player_profiles').insert({
          user_id: data.user.id, nom: form.nom, prenom: form.prenom,
          date_naissance: form.date_naissance || null, age, nationalite: form.nationalite,
          ville: form.ville, region: form.region, taille: form.taille, poids: form.poids,
          pied_fort: form.pied_fort, poste_principal: form.poste_principal, poste_secondaire: form.poste_secondaire,
          club_actuel: form.club_actuel, categorie: form.categorie, niveau_championnat: form.niveau_championnat,
          matchs_joues: parseInt(form.matchs_joues)||0, buts: parseInt(form.buts)||0,
          passes_decisives: parseInt(form.passes_decisives)||0, clean_sheets: parseInt(form.clean_sheets)||0,
          video_highlights: form.video_highlights, video_match: form.video_match,
          objectif: form.objectif, ouvert_opportunites: form.ouvert_opportunites,
          whatsapp: form.whatsapp, instagram: form.instagram, tiktok: form.tiktok, statut:'en_attente',
        })
        navigate('/inscription/succes')
      }
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', padding:'2rem 1rem', background:'radial-gradient(ellipse at 50% 0%, rgba(192,132,252,0.06) 0%, transparent 60%)' }}>
      <div style={{ maxWidth:'640px', margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <Link to="/" style={{ textDecoration:'none' }}><span className="logo-text" style={{ fontSize:'14px' }}>NEXT GOAL</span></Link>
          <h1 style={{ fontSize:'1.5rem', fontWeight:'600', margin:'1rem 0 0.25rem', color:'var(--text)' }}>Inscription Joueur</h1>
          <p style={{ color:'var(--text2)', fontSize:'14px' }}>Étape {step} sur 3</p>
        </div>

        <div style={{ display:'flex', gap:'4px', marginBottom:'2rem' }}>
          {[1,2,3].map(s => <div key={s} style={{ flex:1, height:'4px', borderRadius:'2px', background: s<=step ? 'var(--accent)' : 'var(--border)' }} />)}
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom:'1rem' }}>{error}</div>}

        <div className="card" style={{ marginBottom:'1rem' }}>

          {step === 1 && (
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <h2 style={{ fontSize:'1.1rem', fontWeight:'600', color:'var(--text)' }}>🔐 Créer mon compte</h2>
              <div style={S.fg}><label style={S.label}>Email *</label><input style={S.input} type="email" value={form.email} onChange={set('email')} placeholder="ton@email.com" /></div>
              <div style={S.fg}><label style={S.label}>Mot de passe *</label><input style={S.input} type="password" value={form.password} onChange={set('password')} placeholder="Min. 6 caractères" /></div>
              <div style={S.fg}><label style={S.label}>Confirmer *</label><input style={S.input} type="password" value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="••••••••" /></div>
              <div style={S.grid}>
                <div style={S.fg}><label style={S.label}>Prénom *</label><input style={S.input} value={form.prenom} onChange={set('prenom')} placeholder="Kylian" /></div>
                <div style={S.fg}><label style={S.label}>Nom *</label><input style={S.input} value={form.nom} onChange={set('nom')} placeholder="Dupont" /></div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <h2 style={{ fontSize:'1.1rem', fontWeight:'600', color:'var(--text)' }}>⚽ Informations sportives</h2>
              <div style={S.grid}>
                <div style={S.fg}><label style={S.label}>Date de naissance</label><input style={S.input} type="date" value={form.date_naissance} onChange={set('date_naissance')} /></div>
                <div style={S.fg}><label style={S.label}>Nationalité</label><input style={S.input} value={form.nationalite} onChange={set('nationalite')} placeholder="Française" /></div>
                <div style={S.fg}><label style={S.label}>Région *</label><select style={S.input} value={form.region} onChange={set('region')}><option value="">Choisir...</option>{REGIONS.map(o=><option key={o}>{o}</option>)}</select></div>
                <div style={S.fg}><label style={S.label}>Ville *</label><input style={S.input} value={form.ville} onChange={set('ville')} placeholder="Paris" /></div>
                <div style={S.fg}><label style={S.label}>Taille (cm)</label><input style={S.input} type="number" value={form.taille} onChange={set('taille')} placeholder="180" /></div>
                <div style={S.fg}><label style={S.label}>Poids (kg)</label><input style={S.input} type="number" value={form.poids} onChange={set('poids')} placeholder="75" /></div>
                <div style={S.fg}><label style={S.label}>Pied fort</label><select style={S.input} value={form.pied_fort} onChange={set('pied_fort')}><option>Droit</option><option>Gauche</option><option>Les deux</option></select></div>
                <div style={S.fg}><label style={S.label}>Poste principal *</label><select style={S.input} value={form.poste_principal} onChange={set('poste_principal')}><option value="">Choisir...</option>{POSTES.map(o=><option key={o}>{o}</option>)}</select></div>
                <div style={S.fg}><label style={S.label}>Poste secondaire</label><select style={S.input} value={form.poste_secondaire} onChange={set('poste_secondaire')}><option value="">Choisir...</option>{POSTES.map(o=><option key={o}>{o}</option>)}</select></div>
                <div style={S.fg}><label style={S.label}>Club actuel *</label><input style={S.input} value={form.club_actuel} onChange={set('club_actuel')} placeholder="AS Saint-Denis" /></div>
                <div style={S.fg}><label style={S.label}>Catégorie *</label><select style={S.input} value={form.categorie} onChange={set('categorie')}><option value="">Choisir...</option>{CATEGORIES.map(o=><option key={o}>{o}</option>)}</select></div>
                <div style={S.fg}><label style={S.label}>Niveau *</label><select style={S.input} value={form.niveau_championnat} onChange={set('niveau_championnat')}><option value="">Choisir...</option>{NIVEAUX.map(o=><option key={o}>{o}</option>)}</select></div>
                <div style={S.fg}><label style={S.label}>Matchs joués</label><input style={S.input} type="number" value={form.matchs_joues} onChange={set('matchs_joues')} placeholder="0" /></div>
                <div style={S.fg}><label style={S.label}>Buts</label><input style={S.input} type="number" value={form.buts} onChange={set('buts')} placeholder="0" /></div>
                <div style={S.fg}><label style={S.label}>Passes décisives</label><input style={S.input} type="number" value={form.passes_decisives} onChange={set('passes_decisives')} placeholder="0" /></div>
                <div style={S.fg}><label style={S.label}>Clean sheets</label><input style={S.input} type="number" value={form.clean_sheets} onChange={set('clean_sheets')} placeholder="0" /></div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <h2 style={{ fontSize:'1.1rem', fontWeight:'600', color:'var(--text)' }}>🎬 Médias & contact</h2>
              <div style={S.fg}><label style={S.label}>Lien vidéo highlights</label><input style={S.input} value={form.video_highlights} onChange={set('video_highlights')} placeholder="https://..." /></div>
              <div style={S.fg}><label style={S.label}>Lien vidéo match complet</label><input style={S.input} value={form.video_match} onChange={set('video_match')} placeholder="https://..." /></div>
              <div style={S.fg}><label style={S.label}>WhatsApp</label><input style={S.input} value={form.whatsapp} onChange={set('whatsapp')} placeholder="+33 6 XX XX XX XX" /></div>
              <div style={S.fg}><label style={S.label}>Instagram</label><input style={S.input} value={form.instagram} onChange={set('instagram')} placeholder="@ton_compte" /></div>
              <div style={S.fg}><label style={S.label}>TikTok</label><input style={S.input} value={form.tiktok} onChange={set('tiktok')} placeholder="@ton_compte" /></div>
              <div style={S.fg}><label style={S.label}>Objectif sportif</label>
                <select style={S.input} value={form.objectif} onChange={set('objectif')}>
                  <option value="">Choisir...</option>
                  <option>Monter de division</option>
                  <option>Rejoindre un club professionnel</option>
                  <option>Partir à l'étranger</option>
                  <option>Rejoindre un centre de formation</option>
                  <option>Rejoindre un club amateur ambitieux</option>
                </select>
              </div>
              <label style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer', fontSize:'14px', color:'var(--text2)' }}>
                <input type="checkbox" checked={form.ouvert_opportunites} onChange={e => setForm(f => ({ ...f, ouvert_opportunites: e.target.checked }))} />
                Ouvert(e) à des opportunités dans d'autres régions / pays
              </label>
              <div className="alert alert-info" style={{ fontSize:'12px' }}>✅ J'accepte que mon profil soit consulté par des recruteurs et professionnels du football.</div>
            </div>
          )}
        </div>

        <div style={{ display:'flex', gap:'12px', justifyContent:'space-between' }}>
          {step > 1
            ? <button className="btn btn-secondary" onClick={() => setStep(s => s-1)}>← Retour</button>
            : <Link to="/inscription" className="btn btn-secondary">← Retour</Link>
          }
          {step < 3
            ? <button className="btn btn-primary" onClick={() => setStep(s => s+1)} disabled={step===1 && (!form.email||!form.password||!form.prenom||!form.nom)}>Continuer →</button>
            : <button className="btn btn-green" onClick={handleSubmit} disabled={loading}>{loading ? 'Envoi...' : '🚀 Soumettre'}</button>
          }
        </div>
      </div>
    </div>
  )
}
