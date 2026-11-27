{
/* ---------- settings ---------- */
const BOOK_URL = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2f5yQ0nq1_QOHSZxFv7KajvEUurNY3p-nPR35_CKM0m8LKLd3Qi76oz-ml5C7jw53ahwAN-fsW';            // paste a Google Calendar / Calendly booking link here; empty = go to the contact form
const TESTIMONIALS = [
  {en:"Excellent service. Everything was handled smoothly, and the results were better than I expected. Definitely working with her again.", es:"Excelente servicio. Todo se manejó sin contratiempos y los resultados fueron mejores de lo que esperaba. Sin duda volveré a trabajar con ella."},
  {en:"She understood our needs, our priorities, and the bigger picture. The service was outstanding from beginning to end.", es:"Entendió nuestras necesidades, nuestras prioridades y el panorama completo. El servicio fue excepcional de principio a fin."},
  {en:"We came to her with a problem, and she ended up improving the entire process. She really knows how to connect technology with business needs.", es:"Llegamos con un problema y terminó mejorando todo el proceso. Sabe conectar de verdad la tecnología con las necesidades del negocio."},
  {en:"It's incredible how quickly things change when you hire the right person to automate your processes. We went from doing everything manually to having a system that takes care of so much in the background.", es:"Es increíble lo rápido que cambian las cosas cuando contratas a la persona correcta para automatizar tus procesos. Pasamos de hacer todo a mano a tener un sistema que se encarga de muchísimo en segundo plano."},
  {en:"We have genuinely saved hours every week. It's not just about automation, it's about having our team focus on things that actually require their attention.", es:"De verdad nos hemos ahorrado horas cada semana. No se trata solo de automatizar, sino de que nuestro equipo se enfoque en lo que de verdad necesita su atención."},
  {en:"I can't believe we were doing all of this manually before 😂", es:"No puedo creer que antes hacíamos todo esto a mano 😂"},
  {en:"We need to automate the rest now hahaha. This has been a game changer.", es:"Ahora tenemos que automatizar lo demás jajaja. Esto lo cambió todo."}
];

const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const esc = t => String(t).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const store = {get(k){try{return localStorage.getItem(k)}catch(_){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(_){}}};
const sess = {get(k){try{return sessionStorage.getItem(k)}catch(_){return null}},set(k,v){try{sessionStorage.setItem(k,v)}catch(_){}}};
const root = document.documentElement;

/* ---------- language ---------- */
const listeners = [];
const setLang = l => {
  root.lang = l; store.set('autia-lang', l);
  $$('.lang button').forEach(b => b.setAttribute('aria-pressed', b.dataset.set === l));
  $$('[data-ph-en]').forEach(el => el.placeholder = el.dataset['ph' + (l === 'es' ? 'Es' : 'En')]);
  const t = root.dataset['title' + (l === 'es' ? 'Es' : 'En')]; if (t) document.title = t;
  listeners.forEach(f => f(l));
};
window.autiaLang = () => root.lang;
window.onAutiaLang = f => listeners.push(f);
const saved = store.get('autia-lang');
setLang(saved || ((navigator.language || 'en').toLowerCase().startsWith('es') ? 'es' : 'en'));
$$('.lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.set)));

/* ---------- intro: the node bounces onto the "a" ---------- */
const intro = $('#intro'), chooser = $('#chooser');
const showChooser = () => { if (!saved && chooser) { chooser.classList.add('show'); chooser.querySelector('button').focus(); } };
if (intro) {
  if (sess.get('autia-intro') || RM) { intro.remove(); showChooser(); }
  else { sess.set('autia-intro', '1'); setTimeout(() => { intro.classList.add('done'); setTimeout(() => intro.remove(), 500); showChooser(); }, 1900); }
}
if (chooser) chooser.addEventListener('click', e => { const b = e.target.closest('button[data-set]'); if (b) { setLang(b.dataset.set); chooser.classList.remove('show'); } });

/* ---------- nav ---------- */
const menu = $('#menu'), links = $('#links');
if (menu) { menu.addEventListener('click', () => { const o = links.classList.toggle('open'); menu.setAttribute('aria-expanded', o); });
  links.addEventListener('click', e => { if (e.target.tagName === 'A') { links.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); } }); }
$$('[data-book]').forEach(a => { if (BOOK_URL) { a.href = BOOK_URL; a.target = '_blank'; a.rel = 'noopener'; } });
$$('.yr').forEach(s => s.textContent = new Date().getFullYear());

/* ---------- testimonials (hidden until real messages are added) ---------- */
const tw = $('#testimonials');
if (tw) {
  if (!TESTIMONIALS.length) tw.remove();
  else { const box = tw.querySelector('.msgs'); const draw = l => box.innerHTML = TESTIMONIALS.map((t, i) => `<div class="msg"><span class="av" aria-hidden="true"></span><blockquote>${esc(t[l] || t.en)}</blockquote></div>`).join(''); draw(root.lang); window.onAutiaLang(draw); }
}

/* ---------- portrait swap (photo <-> halftone) ---------- */
$$('.portrait').forEach(p => { if (RM) return; let on = false; const t = () => { on = !on; p.classList.toggle('swap', on); }; let id = setInterval(t, 3200);
  p.addEventListener('mouseenter', () => { clearInterval(id); p.classList.add('swap'); }); p.addEventListener('mouseleave', () => { p.classList.remove('swap'); on = false; id = setInterval(t, 3200); }); });

/* ---------- services tabs ---------- */
const tabs = $('#tabs'), pane = $('#pane');
if (tabs) {
  const SVC = [
    {n:{en:'AI agents & intelligent systems',es:'Agentes de IA y sistemas inteligentes'},d:{en:'Agents that read, decide and act inside your tools, with a person approving what matters.',es:'Agentes que leen, deciden y actúan dentro de tus herramientas, con una persona aprobando lo importante.'},i:{en:['Custom AI agents','AI assistants for your team','Multi-step AI workflows','Knowledge-based AI systems','Internal AI tools','Human-in-the-loop review'],es:['Agentes de IA a medida','Asistentes de IA para tu equipo','Flujos de IA de varios pasos','Sistemas de IA con tu conocimiento','Herramientas internas con IA','Revisión humana en el proceso']},f:{en:['Request','Agent reads it','Checks your knowledge','Drafts the action','You approve'],es:['Solicitud','El agente la lee','Consulta tu conocimiento','Prepara la acción','Tú apruebas']}},
    {n:{en:'Business process automation',es:'Automatización de procesos'},d:{en:'The repetitive steps between your tools, done automatically and the same way every time.',es:'Los pasos repetitivos entre tus herramientas, hechos solos y siempre de la misma forma.'},i:{en:['End-to-end workflows','Administrative tasks','Document processing','Data extraction','Approval workflows','Cross-platform automation'],es:['Flujos de punta a punta','Tareas administrativas','Procesamiento de documentos','Extracción de datos','Flujos de aprobación','Automatización entre plataformas']},f:{en:['Trigger','Extract data','Validate','Update systems','Notify team'],es:['Disparador','Extrae datos','Valida','Actualiza sistemas','Avisa al equipo']}},
    {n:{en:'Sales & lead automation',es:'Ventas y leads'},d:{en:'Every lead answered fast, qualified and followed up, without anyone copying data by hand.',es:'Cada lead respondido rápido, calificado y con seguimiento, sin que nadie copie datos a mano.'},i:{en:['Lead generation','Enrichment','Qualification','Routing','Automated follow-ups','CRM integrations'],es:['Generación de leads','Enriquecimiento','Calificación','Asignación','Seguimientos automáticos','Integración con CRM']},f:{en:['New lead','Enrich','Score','Route to sales','Follow up'],es:['Nuevo lead','Enriquece','Califica','Asigna a ventas','Hace seguimiento']}},
    {n:{en:'Customer communication',es:'Comunicación con clientes'},d:{en:'Clients get answers on the channel they already use, and hard cases reach a person.',es:'Tus clientes reciben respuesta por el canal que ya usan, y los casos difíciles llegan a una persona.'},i:{en:['WhatsApp automation','AI customer support','Conversational workflows','Client onboarding','Follow-up systems'],es:['Automatización de WhatsApp','Atención al cliente con IA','Flujos conversacionales','Onboarding de clientes','Sistemas de seguimiento']},f:{en:['WhatsApp message','Understand request','Find answer','Reply','Escalate if needed'],es:['Mensaje de WhatsApp','Entiende la solicitud','Busca la respuesta','Responde','Escala si hace falta']}},
    {n:{en:'Data, reporting & BI',es:'Datos, reportes y BI'},d:{en:'Numbers collected, joined and reported for you, so meetings start with answers.',es:'Tus números recogidos, unidos y reportados, para que las reuniones empiecen con respuestas.'},i:{en:['Automated reporting','Data consolidation','Dashboards','Performance monitoring','Database workflows'],es:['Reportes automáticos','Consolidación de datos','Dashboards','Monitoreo de desempeño','Flujos de bases de datos']},f:{en:['Scattered data','Consolidate','Clean','Dashboard','Weekly report'],es:['Datos dispersos','Consolida','Limpia','Dashboard','Reporte semanal']}},
    {n:{en:'Operations & internal systems',es:'Operaciones y sistemas internos'},d:{en:'Projects, tasks and knowledge organised so nothing depends on someone remembering.',es:'Proyectos, tareas y conocimiento organizados para que nada dependa de que alguien se acuerde.'},i:{en:['Project management automation','Task systems','Internal knowledge bases','Alerts and notifications','Process optimisation'],es:['Gestión de proyectos automatizada','Sistemas de tareas','Bases de conocimiento internas','Alertas y notificaciones','Optimización de procesos']},f:{en:['New project','Create tasks','Assign owners','Track progress','Alert on delays'],es:['Nuevo proyecto','Crea tareas','Asigna responsables','Sigue el avance','Alerta retrasos']}}
  ];
  let cur = 0;
  const draw = () => { const l = root.lang;
    tabs.innerHTML = SVC.map((s, i) => `<button role="tab" id="tab${i}" aria-controls="pane" aria-selected="${i === cur}" tabindex="${i === cur ? 0 : -1}">${esc(s.n[l])}</button>`).join('');
    const s = SVC[cur]; pane.setAttribute('aria-labelledby', 'tab' + cur);
    pane.innerHTML = `<h3>${esc(s.n[l])}</h3><p>${esc(s.d[l])}</p><div class="chips">${s.i[l].map(x => `<span class="chip">${esc(x)}</span>`).join('')}</div><div class="mini">${s.f[l].map(x => `<span>${esc(x)}</span>`).join('<i>→</i>')}</div>`; };
  tabs.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { cur = [...tabs.children].indexOf(b); draw(); tabs.children[cur].focus(); } });
  tabs.addEventListener('keydown', e => { const n = SVC.length; let j = cur; if (['ArrowDown','ArrowRight'].includes(e.key)) j = (cur + 1) % n; else if (['ArrowUp','ArrowLeft'].includes(e.key)) j = (cur - 1 + n) % n; else return; e.preventDefault(); cur = j; draw(); tabs.children[cur].focus(); });
  draw(); window.onAutiaLang(draw);
}

/* ---------- tool ecosystem ---------- */
const ecoBox = $('#eco');
if (ecoBox) {
  const eco = ecoBox.querySelector('svg'), TOOLS = ['n8n','Make','OpenAI','Claude','Claude Code','Supabase','APIs','SQL','CRM','WhatsApp'];
  const draw = () => { const W = ecoBox.clientWidth, H = ecoBox.clientHeight; if (!W) return; const cx = W/2, cy = H/2, R = Math.min(W*.42, H*.40), fs = W < 420 ? 13 : 15, es = root.lang === 'es';
    let s = `<defs><radialGradient id="cg"><stop offset="0" stop-color="#FF6B35" stop-opacity=".55"/><stop offset="1" stop-color="#FF6B35" stop-opacity="0"/></radialGradient></defs><circle cx="${cx}" cy="${cy}" r="${R*.75}" fill="url(#cg)"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#24222c" stroke-dasharray="3 6"/>`;
    const pt = i => { const a = -Math.PI/2 + i*2*Math.PI/TOOLS.length; return [cx + R*Math.cos(a), cy + R*Math.sin(a)]; };
    TOOLS.forEach((t, i) => { const [x, y] = pt(i); s += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${['#FF6B35','#19C2B0','#FFB547'][i%3]}" stroke-opacity=".45" stroke-width="1.5"/>`; });
    TOOLS.forEach((t, i) => { const [x, y] = pt(i), w = t.length*fs*.6 + 26; s += `<rect x="${x-w/2}" y="${y-17}" width="${w}" height="34" rx="17" fill="#0e0d14" stroke="#3a3744"/><text x="${x}" y="${y+5}" text-anchor="middle" fill="#F6F3EE" font-size="${fs}" font-family="Instrument Sans,sans-serif" font-weight="600" style="stroke:none">${esc(t)}</text>`; });
    s += `<circle cx="${cx}" cy="${cy}" r="${Math.min(62, R*.42)}" fill="#F6F3EE"/><text x="${cx}" y="${cy-3}" text-anchor="middle" fill="#060608" font-size="${fs+1}" font-weight="600" font-family="Instrument Sans,sans-serif" style="stroke:none">${es ? 'Tu' : 'Your'}</text><text x="${cx}" y="${cy+16}" text-anchor="middle" fill="#060608" font-size="${fs+1}" font-weight="600" font-family="Instrument Sans,sans-serif" style="stroke:none">${es ? 'proceso' : 'process'}</text>`;
    eco.innerHTML = s; };
  const ecoRO = new ResizeObserver(draw); ecoRO.observe(ecoBox); window.onAutiaLang(draw);
}

/* ---------- counters ---------- */
const nums = $$('.num[data-to]');
if (nums.length && !RM && 'IntersectionObserver' in window) {
  const count = el => { const to = +el.dataset.to, pre = el.dataset.pre || '', suf = el.dataset.suf || '', t0 = performance.now(); const tick = now => { const p = Math.min(1, (now - t0)/1200); el.textContent = pre + Math.round(to*(1 - (1 - p)**3)) + suf; if (p < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); };
  const numIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { count(e.target); numIO.unobserve(e.target); } }), {threshold: .6}); nums.forEach(n => numIO.observe(n));
}

/* ---------- bottleneck flow (home hero) ---------- */
const box = $('#flow');
if (box) {
  const cv = box.querySelector('canvas'), ctx = cv.getContext('2d');
  let W = 0, H = 0, mode = 'after', parts = [], seed = 7, frame = 0;
  const rnd = () => (seed = seed*16807 % 2147483647)/2147483647;
  const IN = {en:['WhatsApp','Email','Forms','Documents','CRM'],es:['WhatsApp','Correo','Formularios','Documentos','CRM']};
  const OUT = {en:['Qualified lead','Reply sent','Record updated','Task assigned'],es:['Lead calificado','Respuesta enviada','Registro actualizado','Tarea asignada']};
  const COL = ['#FF6B35','#FFB547','#19C2B0','#FF3D6E','#F6F3EE'];
  const size = () => { const D = Math.min(2, devicePixelRatio || 1); W = box.clientWidth; H = box.clientHeight; cv.width = W*D; cv.height = H*D; ctx.setTransform(D,0,0,D,0,0); };
  const lx = () => W < 560 ? 16 : Math.min(120, W*.12), rx = () => W < 560 ? W - 16 : W - Math.min(150, W*.15);
  const spawn = () => { const lane = Math.floor(rnd()*5); parts.push({t:0, lane, out:Math.floor(rnd()*4), c:COL[lane], j:rnd() - .5, v:.0028 + rnd()*.0016}); };
  const yIn = l => H*(.16 + l*(.68/4)), yOut = o => H*(.2 + o*(.6/3)), ease = x => x*x*(3 - 2*x);
  const pos = p => { const a = lx() + 28, b = rx() - 28, x = a + (b - a)*p.t, cy = H/2, gap = mode === 'after' ? H*.15 : H*.035; let y;
    if (p.t < .5) { const k = ease(p.t/.5); y = yIn(p.lane) + (cy + p.j*gap - yIn(p.lane))*k; } else { const k = ease((p.t - .5)/.5); y = cy + p.j*gap + (yOut(p.out) - cy - p.j*gap)*k; } return [x, y]; };
  const draw = () => { if (!W) return; const l = root.lang, a = lx() + 28, b = rx() - 28, nx = a + (b - a)*.5, cy = H/2, gap = mode === 'after' ? H*.17 : H*.045;
    ctx.clearRect(0, 0, W, H); ctx.strokeStyle = 'rgba(246,243,238,.10)'; ctx.lineWidth = 1;
    for (let k = 0; k < 5; k++) { ctx.beginPath(); for (let t = 0; t <= .5; t += .02) { const [x, y] = pos({t, lane:k, out:0, j:0}); t === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); }
    for (let o = 0; o < 4; o++) { ctx.beginPath(); for (let t = .5; t <= 1.001; t += .02) { const [x, y] = pos({t, lane:0, out:o, j:0}); t === .5 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); }
    ctx.fillStyle = mode === 'after' ? 'rgba(255,107,53,.16)' : 'rgba(255,61,110,.14)'; ctx.beginPath(); ctx.ellipse(nx, cy, mode === 'after' ? 46 : 30, gap + 18, 0, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = mode === 'after' ? '#FF6B35' : '#FF3D6E'; ctx.lineWidth = 3; const sp = Math.min(110, W*.09); ctx.beginPath();
    ctx.moveTo(nx - sp, 26); ctx.bezierCurveTo(nx - sp*.2, 26, nx - 10, cy - gap, nx, cy - gap); ctx.bezierCurveTo(nx + 10, cy - gap, nx + sp*.2, 26, nx + sp, 26);
    ctx.moveTo(nx - sp, H - 10); ctx.bezierCurveTo(nx - sp*.2, H - 10, nx - 10, cy + gap, nx, cy + gap); ctx.bezierCurveTo(nx + 10, cy + gap, nx + sp*.2, H - 10, nx + sp, H - 10); ctx.stroke();
    for (const p of parts) { const [x, y] = pos(p); ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(x, y, W < 560 ? 2.6 : 3.2, 0, Math.PI*2); ctx.fill(); }
    const fs = W < 560 ? 12 : 14; ctx.textBaseline = 'middle'; ctx.font = `600 ${fs}px 'Instrument Sans',sans-serif`;
    if (W >= 560) { ctx.textAlign = 'right'; ctx.fillStyle = '#d8d3df'; IN[l].forEach((t, k) => ctx.fillText(t, lx() + 18, yIn(k))); ctx.textAlign = 'left'; OUT[l].forEach((t, o) => ctx.fillText(t, rx() - 18, yOut(o))); }
    ctx.textAlign = 'center'; ctx.fillStyle = mode === 'after' ? '#FF6B35' : '#FF3D6E'; ctx.font = `italic 400 ${fs + 4}px 'Instrument Serif',Georgia,serif`;
    ctx.fillText(mode === 'after' ? (l === 'es' ? 'Sistema Autia' : 'Autia system') : (l === 'es' ? 'Cuello de botella' : 'Bottleneck'), nx, 14); };
  const step = () => { frame++; if (frame % (mode === 'after' ? 3 : 4) === 0 && parts.length < (mode === 'after' ? 140 : 230)) spawn();
    const passing = parts.filter(p => p.t > .47 && p.t < .53).length;
    for (const p of parts) { let v = p.v*(mode === 'after' ? 1.25 : 1); if (mode === 'before') { if (p.t > .38 && p.t < .5) { const ahead = parts.filter(q => q !== p && q.t > p.t && q.t < p.t + .018).length; v *= ahead > 2 ? .02 : passing > 1 ? .15 : .5; } else if (p.t >= .5) v *= .55; } p.t += v; }
    parts = parts.filter(p => p.t < 1); draw(); requestAnimationFrame(step); };
  const cap = $('#cap'), bB = $('#bBefore'), bA = $('#bAfter');
  const setMode = m => { mode = m; bB.setAttribute('aria-pressed', m === 'before'); bA.setAttribute('aria-pressed', m === 'after'); $$('#cap [data-m]').forEach(s => s.hidden = s.dataset.m !== m); if (RM) draw(); };
  bB.addEventListener('click', () => setMode('before')); bA.addEventListener('click', () => setMode('after'));
  const flowRO = new ResizeObserver(() => { size(); if (RM) draw(); }); flowRO.observe(box); window.onAutiaLang(() => { if (RM) draw(); });
  size(); setMode('after');
  if (RM) { for (let i = 0; i < 90; i++) { spawn(); parts[parts.length - 1].t = rnd(); } draw(); }
  else { for (let i = 0; i < 260; i++) { if (i % 3 === 0) spawn(); for (const p of parts) p.t += p.v*1.25; parts = parts.filter(p => p.t < 1); } requestAnimationFrame(step); }
}

/* ---------- contact form ---------- */
const form = $('#form'), ok = $('#ok');
if (form) form.addEventListener('submit', e => { e.preventDefault(); const es = root.lang === 'es', f = Object.fromEntries(new FormData(form)), bad = [];
  if (!f.name.trim()) bad.push(es ? 'tu nombre' : 'your name'); if (!/^\S+@\S+\.\S+$/.test(f.email)) bad.push(es ? 'un correo de empresa válido' : 'a valid business email'); if (!f.what) bad.push(es ? 'qué quieres automatizar' : 'what you want to automate');
  if (bad.length) { ok.className = 'ok show'; ok.style.borderColor = '#5a1d2c'; ok.style.background = '#23141a'; ok.textContent = (es ? 'Por favor agrega ' : 'Please add ') + bad.join(', ') + '.'; return; }
  const body = `Name: ${f.name}\nCompany: ${f.company || '-'}\nEmail: ${f.email}\nWants to automate: ${f.what}\n\nHow it works today:\n${f.desc || '-'}`;
  const href = 'mailto:catalina@autialab.com?subject=' + encodeURIComponent('Automation inquiry: ' + f.what) + '&body=' + encodeURIComponent(body);
  ok.className = 'ok show'; ok.style.borderColor = ''; ok.style.background = '';
  ok.innerHTML = (es ? 'Casi listo. <a href="' + href + '">Abre tu correo para enviarlo</a>, o copia tu nota y envíala a <b>catalina@autialab.com</b>. ' : 'Almost there. <a href="' + href + '">Open your email to send it</a>, or copy your note and send it to <b>catalina@autialab.com</b>. ') + '<button type="button" class="btn ghost" id="cp" style="min-height:40px;margin-top:10px">' + (es ? 'Copiar nota' : 'Copy note') + '</button>';
  $('#cp').addEventListener('click', async () => { try { await navigator.clipboard.writeText(body); $('#cp').textContent = es ? 'Copiado' : 'Copied'; } catch (_) { $('#cp').textContent = es ? 'No se pudo copiar' : 'Copy failed'; } }); });
}
