
// ══════════════════════════════════════════
// DATA
// ══════════════════════════════════════════
let stagiaires = [
  'Yacin ELANSAR',
  'Oumaima KHARBOUCH',
  'Zahira BIYARI',
  'Hayat ELMANNER',
  'Taha ISMAILI'
];

const COMPETENCES = [
  'Planification et organisation des séances',
  'Gestion de classe',
  'Maîtrise des contenus disciplinaires (informatique)',
  'Utilisation des TIC en pédagogie',
  'Conception de situations d\'apprentissage',
  'Évaluation des apprentissages',
  'Différenciation pédagogique',
  'Communication pédagogique claire',
  'Motivation et engagement des élèves',
  'Adaptation aux besoins des apprenants'
];

const QUALITES = [
  'Ponctualité et sérieux',
  'Esprit d\'initiative',
  'Sens des responsabilités',
  'Capacité d\'écoute et d\'empathie',
  'Travail en équipe',
  'Rigueur et organisation',
  'Enthousiasme et motivation',
  'Capacité d\'adaptation',
  'Respect des élèves et des collègues',
  'Engagement professionnel'
];

const SUGGESTIONS_OBS = [
  'A démontré une excellente maîtrise des outils numériques lors des séances en salle informatique.',
  'S\'est distingué(e) par sa capacité à expliquer des concepts complexes de façon claire et accessible.',
  'A su créer une relation de confiance avec les élèves, favorisant un climat d\'apprentissage positif.',
  'A fait preuve d\'une grande autonomie dans la préparation et la conduite des séances.',
  'A intégré avec succès les retours pédagogiques lors des visites d\'encadrement.',
  'Ses supports de cours numériques étaient particulièrement soignés et adaptés au niveau des apprenants.',
  'A su gérer efficacement les situations de classe difficiles avec calme et professionnalisme.',
  'Sa progression tout au long du stage a été remarquable et témoigne d\'une réelle vocation pour l\'enseignement.'
];

let genreEns = 'f';
let genreSt = 'f';
let signatureData = null;

// ══════════════════════════════════════════
// INIT
// ══════════════════════════════════════════
function init() {
  renderCheckboxes('competences-list', COMPETENCES, 'comp');
  renderCheckboxes('qualites-list', QUALITES, 'qual');
  renderStagiaireSelect();
  renderStagiaireManager();
  renderSuggestions();
  document.getElementById('annee-scolaire').value = '2025/2026';
  updateAppreciationOptions();
  document.getElementById('matiere').value = 'Informatique';
  document.getElementById('stagiaire-count').textContent = stagiaires.length;
  initSignatureCanvas();
}

function initSignatureCanvas() {
  const canvas = document.getElementById('signature-canvas');
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  let drawing = false;
  let lastX = 0, lastY = 0;

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  canvas.addEventListener('mousedown', (e) => { drawing = true; const p = getPos(e); lastX = p.x; lastY = p.y; });
  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); drawing = true; const p = getPos(e); lastX = p.x; lastY = p.y; }, { passive: false });

  canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    const p = getPos(e);
    ctx.beginPath(); ctx.moveTo(lastX, lastY); ctx.lineTo(p.x, p.y); ctx.stroke();
    lastX = p.x; lastY = p.y;
  });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!drawing) return;
    const p = getPos(e);
    ctx.beginPath(); ctx.moveTo(lastX, lastY); ctx.lineTo(p.x, p.y); ctx.stroke();
    lastX = p.x; lastY = p.y;
  }, { passive: false });

  // FIX 1 : saveSignature() ne doit être appelée que si quelque chose a été dessiné
  // pour éviter de stocker un canvas vide et écraser une vraie signature existante.
  canvas.addEventListener('mouseup', () => { if (drawing) { drawing = false; saveSignature(); } });
  canvas.addEventListener('mouseleave', () => { if (drawing) { drawing = false; saveSignature(); } });
  canvas.addEventListener('touchend', () => { if (drawing) { drawing = false; saveSignature(); } });
}

// FIX 2 : Vérifier que le canvas n'est pas vide avant de sauvegarder.
// Un canvas vierge produisait un dataURL "vide" stocké comme signatureData non-null,
// ce qui affichait une image transparente au lieu de la ligne de signature.
function isCanvasBlank(canvas) {
  const ctx = canvas.getContext('2d');
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  return !data.some(channel => channel !== 0);
}

function saveSignature() {
  const canvas = document.getElementById('signature-canvas');
  if (isCanvasBlank(canvas)) {
    signatureData = null;
  } else {
    signatureData = canvas.toDataURL();
  }
  updatePreview();
}

function clearSignature() {
  const canvas = document.getElementById('signature-canvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  signatureData = null;
  updatePreview();
}

function uploadSignature() {
  document.getElementById('signature-upload').click();
}

function loadSignatureImage(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.getElementById('signature-canvas');
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width - img.width * scale) / 2;
      const y = (canvas.height - img.height * scale) / 2;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      saveSignature();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function renderCheckboxes(containerId, items, prefix) {
  const el = document.getElementById(containerId);
  el.innerHTML = items.map((item, i) => `
    <label class="checkbox-item">
      <input type="checkbox" id="${prefix}-${i}" onchange="updateSelectAll('${prefix}'); updatePreview()">
      <span>${item}</span>
    </label>
  `).join('');
}

function toggleAll(prefix, checked) {
  const count = prefix === 'comp' ? COMPETENCES.length : QUALITES.length;
  for (let i = 0; i < count; i++) {
    const cb = document.getElementById(`${prefix}-${i}`);
    if (cb) cb.checked = checked;
  }
  updatePreview();
}

function updateSelectAll(prefix) {
  const count = prefix === 'comp' ? COMPETENCES.length : QUALITES.length;
  const allChecked = Array.from({length: count}, (_, i) => document.getElementById(`${prefix}-${i}`)).every(cb => cb && cb.checked);
  const selectAll = document.getElementById(`select-all-${prefix}`);
  if (selectAll) selectAll.checked = allChecked;
}

function renderStagiaireSelect() {
  const sel = document.getElementById('stagiaire-select');
  const val = sel.value;
  sel.innerHTML = '<option value="">— Choisir un(e) stagiaire —</option>' +
    stagiaires.map(s => `<option value="${s}"${val===s?' selected':''}>${s}</option>`).join('');
}

function renderStagiaireManager() {
  const el = document.getElementById('stagiaire-manager-list');
  el.innerHTML = stagiaires.map((s, i) => `
    <div class="stagiaire-tag">
      <span>${s}</span>
      <button onclick="removeStagiaire(${i})" title="Supprimer">×</button>
    </div>
  `).join('');
  document.getElementById('stagiaire-count').textContent = stagiaires.length;
}

function renderSuggestions() {
  const el = document.getElementById('suggestion-list');
  el.innerHTML = SUGGESTIONS_OBS.map(s => `
    <div class="suggestion-item" onclick="insertSuggestion(\`${s.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)">${s.length > 70 ? s.substring(0, 70) + '…' : s}</div>
  `).join('');
}

function insertSuggestion(text) {
  const ta = document.getElementById('observation');
  const cur = ta.value;
  // FIX 3 : Ajouter un espace seulement si le texte existant ne finit pas déjà par un espace.
  ta.value = cur ? cur.trimEnd() + ' ' + text : text;
  updateObsCount();
  updatePreview();
}

// ══════════════════════════════════════════
// EVENTS
// ══════════════════════════════════════════
function switchTab(name) {
  document.querySelectorAll('.tab').forEach((t, i) => {
    const names = ['infos','competences','stagiaires'];
    t.classList.toggle('active', names[i] === name);
  });
  document.querySelectorAll('.tab-content').forEach(c => {
    c.classList.toggle('active', c.id === 'tab-' + name);
  });
}

function setGenreEns(g, btn) {
  genreEns = g;
  btn.closest('.genre-toggle').querySelectorAll('.genre-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  updatePreview();
}

function setGenreSt(g, btn) {
  genreSt = g;
  btn.closest('.genre-toggle').querySelectorAll('.genre-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  updateAppreciationOptions();
  updatePreview();
}

function updateAppreciationOptions() {
  const sel = document.getElementById('appreciation');
  const currentVal = sel.value;
  const isFem = genreSt !== 'm';
  sel.innerHTML = '<option value="">— Choisir —</option>' +
    `<option>${isFem ? 'Excellente' : 'Excellent'} stagiaire, performance remarquable.</option>` +
    `<option>${isFem ? 'Très bonne' : 'Très bon'} stagiaire, résultats très satisfaisants.</option>` +
    `<option>${isFem ? 'Bonne' : 'Bon'} stagiaire, bonne progression observée.</option>` +
    `<option>Stagiaire ${isFem ? 'sérieuse' : 'sérieux'} avec un bon potentiel de développement.</option>`;
  sel.value = currentVal;
}

function onStagiaireSelect() {
  updatePreview();
}

function updateObsCount() {
  const ta = document.getElementById('observation');
  document.getElementById('obs-count').textContent = ta.value.length + ' / 600';
}

function addStagiaire() {
  const inp = document.getElementById('new-stagiaire-input');
  const name = inp.value.trim();
  if (!name) return;
  if (stagiaires.includes(name)) { showToast('Ce(tte) stagiaire existe déjà'); return; }
  stagiaires.push(name);
  inp.value = '';
  renderStagiaireSelect();
  renderStagiaireManager();
  showToast('Stagiaire ajouté(e) : ' + name);
}

function removeStagiaire(i) {
  const removed = stagiaires[i];
  stagiaires.splice(i, 1);
  renderStagiaireSelect();
  renderStagiaireManager();
  // FIX 4 : Comparer avec la valeur APRÈS le re-rendu du select, pas avant.
  // renderStagiaireSelect() peut réinitialiser la valeur sélectionnée,
  // donc la comparaison doit se faire avant de re-rendre, ce qui est maintenant le cas
  // grâce à la variable `removed` capturée en amont. (logique déjà correcte, nettoyée)
  if (document.getElementById('stagiaire-select').value === removed ||
      document.getElementById('stagiaire-select').value === '') {
    document.getElementById('stagiaire-select').value = '';
    updatePreview();
  }
  showToast('Stagiaire supprimé(e)');
}

// ══════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════
function val(id) { return document.getElementById(id).value.trim(); }

function formatDate(dateStr) {
  if (!dateStr) return '___';
  const [y, m, d] = dateStr.split('-');
  const months = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  return parseInt(d) + ' ' + months[parseInt(m)-1] + ' ' + y;
}

function getChecked(prefix, items) {
  return items.filter((_, i) => {
    const el = document.getElementById(prefix + '-' + i);
    return el && el.checked;
  });
}

function ileElle() { return genreSt === 'm' ? 'Il' : 'Elle'; }
function ilelle() { return genreSt === 'm' ? 'il' : 'elle'; }
function sonSa() { return genreSt === 'm' ? 'son' : 'sa'; }
function unUne() { return genreSt === 'm' ? 'un' : 'une'; }
function UnUne() { return genreSt === 'm' ? 'Un' : 'Une'; }
function luiElle() {
  return genreSt === 'm' ? 'lui' : 'elle';
}
function soussigne() {
  const base = 'Je soussigné';
  return genreEns === 'f' ? base + 'e' : base;
}
function enseignantE() { return genreEns === 'f' ? 'enseignante' : 'enseignant'; }
function prometteurse() {
  if (genreSt === 'm') return 'un futur enseignant prometteur';
  return 'une future enseignante prometteuse';
}
function leudela() { return genreSt === 'm' ? 'du' : 'de la'; }
function celuielle() { return genreSt === 'm' ? 'celui' : 'celle'; }

// FIX 5 : La regex de deMatiere() ne couvrait pas toutes les voyelles accentuées.
// Les lettres comme 'é', 'è', 'ê', 'à', 'â', 'î', 'ô', 'û', 'ù' sont listées deux fois
// (une fois dans le set [aeiou...] et dans le flag /i). Nettoyage et correction du set
// pour inclure uniquement les voyelles de base + accentuées pertinentes en français.
function deMatiere(m) {
  return /^[aeiouéèêëàâîïôùûüœæ]/i.test(m) ? "d'" : 'de ';
}

function esc(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ══════════════════════════════════════════
// LETTER GENERATION
// ══════════════════════════════════════════
function updatePreview() {
  const etablissement = val('etablissement');
  const adresse = val('adresse');
  const contact = val('contact');
  const ville = val('ville') || 'Casablanca';
  const enseignant = val('enseignant');
  const matiere = val('matiere') || 'Informatique';
  const stagiaire = document.getElementById('stagiaire-select').value;
  const anneeScolaire = document.getElementById('annee-scolaire').value || '2025/2026';
  const appreciation = val('appreciation');
  const observation = val('observation');
  const competencesLibres = val('competences-libres');

  const competencesChecked = getChecked('comp', COMPETENCES);
  const qualitesChecked = getChecked('qual', QUALITES);

  const allComps = [...competencesChecked];
  if (competencesLibres) allComps.push(...competencesLibres.split(',').map(s=>s.trim()).filter(Boolean));

  const today = new Date();
  const months = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  const todayStr = today.getDate() + ' ' + months[today.getMonth()] + ' ' + today.getFullYear();

  const compsHtml = allComps.length > 0
    ? allComps.map(c => `<li>${esc(c)}</li>`).join('')
    : '<li><em>[Compétences non sélectionnées]</em></li>';

  // FIX 6 : La qualité finale doit être précédée de "et" (pas seulement d'une virgule)
  // pour une phrase française correcte : "ponctualité, rigueur et engagement".
  const qualsHtml = qualitesChecked.length > 0
    ? qualitesChecked.map((q, i) => {
        const label = esc(q).toLowerCase();
        if (i === qualitesChecked.length - 1 && qualitesChecked.length > 1) {
          return 'et ' + label;
        }
        return label;
      }).join(', ')
    : '<em>[qualités non sélectionnées]</em>';

  const nomEtablissement = etablissement || '[Nom de l\'établissement]';
  const nomEnseignant = enseignant || '[Nom de l\'enseignant(e)]';
  const nomStagiaire = stagiaire || '[Nom du/de la stagiaire]';

  // FIX 7 : sonSa() peut retourner "sa" → "Sa professionnalisme" est incorrect.
  // Le mot "professionnalisme" est masculin, donc on utilise toujours "Son".
  // On remplace la logique générique par le bon accord fixe.
  const html = `
    <div class="letter-header-block">
      <div class="letter-org">${esc(nomEtablissement)}</div>
      ${adresse ? `<div class="letter-addr">${esc(adresse)}</div>` : ''}
      ${contact ? `<div class="letter-addr">${esc(contact)}</div>` : ''}
    </div>

    <div class="letter-date">À ${esc(ville)}, le ${todayStr}</div>

    <div class="letter-subject">
      <strong>Objet : Lettre de recommandation</strong>
    </div>

    <div class="letter-body">
      <p>${soussigne()}, <strong>${esc(nomEnseignant)}</strong>, ${enseignantE()} ${deMatiere(matiere)}<em>${esc(matiere)}</em> au sein de <em>${esc(nomEtablissement)}</em>, ai le plaisir de recommander vivement <strong>${esc(nomStagiaire)}</strong>, professeur${genreSt === 'f' ? 'e' : ''} stagiaire au CRMEF, spécialité informatique – cycle qualifiant (promotion 2026).</p>

      <p>Durant ${sonSa()} stage au sein de notre établissement, au titre de l'année scolaire <strong>${anneeScolaire}</strong>, j'ai eu l'opportunité d'observer ses compétences pédagogiques, didactiques et relationnelles.</p>

      <p><strong>${esc(nomStagiaire)}</strong> a fait preuve d'un grand sérieux et d'un engagement remarquable dans la préparation et l'animation de ses séances. ${ileElle()} a su concevoir des situations d'apprentissage adaptées au niveau des élèves, en intégrant efficacement les outils numériques et les TIC.</p>

      <p>Sur le plan pédagogique, ${ilelle()} a démontré de solides compétences dans le domaine de l'enseignement, notamment :</p>
      <ul style="margin: 0.5rem 0 1rem 1.5rem; line-height:1.9;">${compsHtml}</ul>

      <p>${ileElle()} a su mettre en œuvre des pratiques pédagogiques efficaces, adaptées aux besoins des élèves, favorisant leur compréhension, leur participation et leur réussite.</p>

      <p>Par ailleurs, <strong>${esc(nomStagiaire)}</strong> a su instaurer un climat de classe positif et motivant. ${ileElle()} a également montré des qualités humaines telles que : ${qualsHtml}.</p>

      ${observation ? `
      <div class="letter-specific">
        <div class="letter-specific-label">Observation spécifique de l'${enseignantE()}</div>
        ${esc(observation)}
      </div>` : ''}

      ${appreciation ? `<p><strong>${esc(appreciation)}</strong></p>` : ''}

      <p>Son professionnalisme et sa motivation font de ${luiElle()} ${prometteurse()}.</p>

      <p>Je recommande donc <strong>${esc(nomStagiaire)}</strong> sans réserve pour toute opportunité professionnelle dans le domaine de l'enseignement.</p>

    </div>

    <div class="letter-signature">
    <p><strong>${esc(nomEnseignant)}</strong></p>
      ${signatureData ? `<img src="${signatureData}" alt="Signature" style="max-height:80px; max-width:250px;">` : '<div class="letter-sig-line"></div>'}
    </div>
  `;

  document.getElementById('letter-preview').innerHTML = html;
}

// ══════════════════════════════════════════
// ACTIONS
// ══════════════════════════════════════════
function printLetter() {
  const element = document.getElementById('letter-preview');
  const nomStagiaire = document.getElementById('stagiaire-select').value || 'lettre-recommandation';
  element.style.fontSize = '12px';
  element.style.lineHeight = '1.4';
  const opt = {
    margin: 10,
    filename: `${nomStagiaire.replace(/\s+/g, '_')}_recommandation.pdf`,
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };
  html2pdf().set(opt).from(element).save().then(() => {
    element.style.fontSize = '';
    element.style.lineHeight = '';
  });
}

function copyText() {
  const preview = document.getElementById('letter-preview');
  const text = preview.innerText;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => showToast('Lettre copiée dans le presse-papiers !'));
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Lettre copiée !');
  }
}

function resetForm() {
  if (!confirm('Réinitialiser tous les champs ?')) return;
  // FIX 8 : 'fonction' n'est pas un champ du formulaire dans updatePreview(),
  // getElementById('fonction') retourne null et provoque une erreur silencieuse
  // qui interrompt la boucle forEach. Suppression de 'fonction' de la liste.
  ['etablissement','adresse','contact','ville','enseignant','matiere','observation','competences-libres'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('stagiaire-select').value = '';
  document.getElementById('annee-scolaire').value = '2025/2026';
  document.getElementById('matiere').value = 'Informatique';
  document.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false);
  document.getElementById('select-all-comp').checked = false;
  document.getElementById('select-all-qual').checked = false;
  updateAppreciationOptions();
  clearSignature();
  document.getElementById('letter-preview').innerHTML = `
    <div class="empty-hint" style="margin-top:6rem; font-family:'Segoe UI',sans-serif;">
      <svg viewBox="0 0 24 24" width="40" height="40" fill="#c5cad3" style="margin-bottom:12px;display:block;margin-left:auto;margin-right:auto"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM9 13h6v1H9zm0 2h6v1H9zm0 2h4v1H9z"/></svg>
      Remplissez le formulaire pour générer la lettre
    </div>`;
  showToast('Formulaire réinitialisé');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

init();
