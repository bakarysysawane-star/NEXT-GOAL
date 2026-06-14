/* ============ NEXT GOAL — Espaces (profils, favoris, admin) ============ */
.ngd { min-height: 100vh; background: #080808; color: #fff; font-family: 'Barlow', sans-serif; }
.ngd-wrap { max-width: 900px; margin: 0 auto; padding: 40px 6vw 64px; }
.ngd-wrap-wide { max-width: 1100px; margin: 0 auto; padding: 40px 6vw 64px; }

/* Header */
.ngd-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; padding-top: 16px; }
.ngd-title { font-family: 'Bebas Neue', sans-serif; font-size: 40px; color: #fff; letter-spacing: 1px; line-height: 1; }
.ngd-sub { font-size: 13px; color: rgba(255,255,255,0.3); margin-top: 8px; font-style: italic; }
.ngd-head-actions { display: flex; gap: 10px; }

/* Boutons */
.ngd-btn { padding: 11px 22px; border-radius: 5px; font-family: 'Barlow', sans-serif; font-weight: 800; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; border: 2px solid; transition: all 0.18s; }
.ngd-btn-primary { background: #fff; border-color: #fff; color: #080808; }
.ngd-btn-primary:hover { background: transparent; color: #fff; }
.ngd-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
.ngd-btn-ghost { background: transparent; border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.6); }
.ngd-btn-ghost:hover { border-color: #fff; color: #fff; }
.ngd-btn-violet { background: #B87FFF; border-color: #B87FFF; color: #fff; }
.ngd-btn-violet:hover { background: transparent; color: #B87FFF; }
.ngd-btn-green { background: #4ade80; border-color: #4ade80; color: #080808; }
.ngd-btn-green:hover { background: transparent; color: #4ade80; }
.ngd-btn-danger { background: transparent; border-color: rgba(239,83,80,0.5); color: #ef5350; }
.ngd-btn-danger:hover { border-color: #ef5350; }
.ngd-btn-sm { padding: 7px 14px; font-size: 11px; }

/* Cartes */
.ngd-card { background: #0D0D0D; border: 1px solid #1a1a1a; border-radius: 10px; padding: 24px; margin-bottom: 16px; }
.ngd-card-title { font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #B87FFF; margin-bottom: 18px; }

/* Avatar */
.ngd-avatar-row { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
.ngd-avatar-name { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: #fff; letter-spacing: 1px; }
.ngd-avatar-meta { font-size: 13px; color: rgba(255,255,255,0.4); margin-top: 4px; }
.ngd-avatar-meta2 { font-size: 12px; color: rgba(255,255,255,0.25); margin-top: 2px; }

/* Badges */
.ngd-badges { display: flex; gap: 8px; flex-wrap: wrap; }
.ngd-badge { font-size: 10px; padding: 4px 10px; border-radius: 3px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
.ngd-badge-violet { background: rgba(184,127,255,0.1); color: #B87FFF; border: 1px solid rgba(184,127,255,0.2); }
.ngd-badge-green { background: rgba(74,222,128,0.08); color: #4ade80; border: 1px solid rgba(74,222,128,0.15); }
.ngd-badge-amber { background: rgba(245,180,80,0.08); color: #F5B450; border: 1px solid rgba(245,180,80,0.15); }
.ngd-badge-pink { background: rgba(239,83,80,0.08); color: #ef5350; border: 1px solid rgba(239,83,80,0.15); }
.ngd-badge-white { background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.4); border: 1px solid rgba(255,255,255,0.08); }

/* Form */
.ngd-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.ngd-field { display: flex; flex-direction: column; gap: 6px; }
.ngd-field label { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.4); }
.ngd-field input, .ngd-field select, .ngd-field textarea { background: #111; border: 1px solid #222; color: rgba(255,255,255,0.8); padding: 11px 14px; border-radius: 5px; font-family: 'Barlow', sans-serif; font-size: 13px; outline: none; width: 100%; }
.ngd-field input:focus, .ngd-field select:focus, .ngd-field textarea:focus { border-color: #B87FFF; }

/* Vue lecture champ */
.ngd-readfield { background: #111; border: 1px solid #161616; padding: 11px 14px; border-radius: 5px; }
.ngd-readfield-label { font-size: 10px; color: rgba(255,255,255,0.25); margin-bottom: 3px; text-transform: uppercase; letter-spacing: 1px; }
.ngd-readfield-val { font-weight: 600; color: rgba(255,255,255,0.85); font-size: 14px; }

/* Stats inline */
.ngd-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 16px; }
.ngd-stat { background: #111; border: 1px solid #1a1a1a; border-radius: 6px; padding: 16px 10px; text-align: center; }
.ngd-stat-val { font-family: 'Bebas Neue', sans-serif; font-size: 32px; color: #fff; line-height: 1; }
.ngd-stat-lbl { font-size: 9px; color: rgba(255,255,255,0.25); text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; font-weight: 700; }

/* Alerts */
.ngd-alert { padding: 12px 16px; border-radius: 5px; font-size: 13px; margin-bottom: 16px; }
.ngd-alert-success { background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.3); color: #4ade80; }
.ngd-alert-error { background: rgba(239,83,80,0.1); border: 1px solid rgba(239,83,80,0.3); color: #ef5350; }

/* IA box */
.ngd-ai-box { background: linear-gradient(135deg, rgba(184,127,255,0.08), rgba(184,127,255,0.02)); border: 1px solid rgba(184,127,255,0.2); border-radius: 10px; padding: 24px; margin-bottom: 16px; }
.ngd-ai-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.ngd-ai-text { font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.7; font-style: italic; }
.ngd-ai-empty { font-size: 13px; color: rgba(255,255,255,0.3); font-style: italic; }

/* Video links */
.ngd-videos { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px; }
.ngd-video-link { display: inline-flex; align-items: center; gap: 8px; background: #111; border: 1px solid #222; color: rgba(255,255,255,0.6); padding: 9px 16px; border-radius: 5px; font-size: 12px; font-weight: 700; text-decoration: none; text-transform: uppercase; letter-spacing: 0.5px; }
.ngd-video-link:hover { border-color: rgba(184,127,255,0.4); color: #B87FFF; }

/* Empty */
.ngd-empty { text-align: center; padding: 64px 20px; }
.ngd-empty-title { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: rgba(255,255,255,0.4); letter-spacing: 1px; margin-bottom: 8px; }
.ngd-empty-text { font-size: 13px; color: rgba(255,255,255,0.3); font-style: italic; }

/* Checkbox */
.ngd-check { display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 13px; color: rgba(255,255,255,0.5); }

/* Tabs */
.ngd-tabs { display: flex; gap: 4px; margin-bottom: 24px; background: #0D0D0D; border: 1px solid #1a1a1a; padding: 4px; border-radius: 8px; width: fit-content; flex-wrap: wrap; }
.ngd-tab { padding: 9px 20px; border-radius: 5px; border: none; background: transparent; color: rgba(255,255,255,0.4); cursor: pointer; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; font-family: 'Barlow', sans-serif; transition: all 0.18s; }
.ngd-tab.active { background: #B87FFF; color: #fff; }

/* Admin stats row */
.ngd-admin-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; margin-bottom: 32px; }

/* Admin row */
.ngd-row { background: #0D0D0D; border: 1px solid #1a1a1a; border-radius: 8px; padding: 18px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 10px; }
.ngd-row-avatar { width: 46px; height: 46px; border-radius: 50%; flex-shrink: 0; background: rgba(184,127,255,0.08); border: 1px solid rgba(184,127,255,0.2); display: flex; align-items: center; justify-content: center; font-family: 'Bebas Neue', sans-serif; font-size: 16px; color: #B87FFF; }
.ngd-row-info { flex: 1; min-width: 200px; }
.ngd-row-name { font-weight: 700; color: #fff; font-size: 15px; }
.ngd-row-meta { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 3px; }
.ngd-row-meta2 { font-size: 11px; color: rgba(255,255,255,0.25); margin-top: 2px; }
.ngd-row-actions { display: flex; gap: 6px; flex-wrap: wrap; }

@media (max-width: 640px) {
  .ngd-grid { grid-template-columns: 1fr; }
  .ngd-stats { grid-template-columns: repeat(2, 1fr); }
}

/* ===== Complétude du profil ===== */
.ngd-completion-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.ngd-completion-pct { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 1px; }
.ngd-completion-bar-bg { background: #1a1a1a; border-radius: 3px; height: 6px; overflow: hidden; margin-bottom: 12px; }
.ngd-completion-bar { height: 6px; border-radius: 3px; transition: width 0.4s ease; }
.ngd-completion-hint { font-size: 13px; color: rgba(255,255,255,0.45); font-style: italic; margin-bottom: 18px; }
.ngd-completion-list { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.ngd-completion-item { display: flex; align-items: center; gap: 10px; }
.ngd-completion-check { width: 18px; height: 18px; border-radius: 4px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 11px; font-weight: 900; }
.ngd-completion-check.done { background: rgba(74,222,128,0.15); color: #4ade80; border: 1px solid rgba(74,222,128,0.3); }
.ngd-completion-check.todo { background: #1a1a1a; border: 1px solid #2a2a2a; }
.ngd-completion-label { font-size: 13px; color: rgba(255,255,255,0.6); }
.ngd-completion-label-done { font-size: 13px; color: rgba(255,255,255,0.3); text-decoration: line-through; }

@media (max-width: 640px) {
  .ngd-completion-list { grid-template-columns: 1fr; }
}
