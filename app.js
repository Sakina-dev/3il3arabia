// Données Alif → Yâ’ (28 lettres)
const LETTERS = [
  { ar: 'ا', fr: 'Alif' },
  { ar: 'ب', fr: 'Bâ’' },
  { ar: 'ت', fr: 'Tâ’' },
  { ar: 'ث', fr: 'Thâ’' },
  { ar: 'ج', fr: 'Djîm' },
  { ar: 'ح', fr: 'Hâ’' },
  { ar: 'خ', fr: 'Khâ’' },
  { ar: 'د', fr: 'Dâl' },
  { ar: 'ذ', fr: 'Dhâl' },
  { ar: 'ر', fr: 'Râ’' },
  { ar: 'ز', fr: 'Zay' },
  { ar: 'س', fr: 'Sîn' },
  { ar: 'ش', fr: 'Chîn' },
  { ar: 'ص', fr: 'Sâd' },
  { ar: 'ض', fr: 'Dâd' },
  { ar: 'ط', fr: 'Tâ’ emphatique' },
  { ar: 'ظ', fr: 'Dhâ’ emphatique' },
  { ar: 'ع', fr: '‘Ayn' },
  { ar: 'غ', fr: 'Ghayn' },
  { ar: 'ف', fr: 'Fâ’' },
  { ar: 'ق', fr: 'Qâf' },
  { ar: 'ك', fr: 'Kâf' },
  { ar: 'ل', fr: 'Lâm' },
  { ar: 'م', fr: 'Mîm' },
  { ar: 'ن', fr: 'Nûn' },
  { ar: 'ه', fr: 'Hâ’' },
  { ar: 'و', fr: 'Wâw' },
  { ar: 'ي', fr: 'Yâ’' },
];

const byId = (id) => document.getElementById(id);
const setTextIfExists = (id, text) => { const el = byId(id); if (el) el.textContent = text; };
const qs = (sel, el = document) => el.querySelector(sel);
const qsa = (sel, el = document) => Array.from(el.querySelectorAll(sel));

function normalizeAnswer(s) {
  if (!s) return '';
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[’'`]/g, '').replace(/\s+/g, ' ').trim();
}

// Tabs + nav
function setupTabs() {
  const tabs = qsa('.tab');
  tabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabs.forEach((b) => {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
      const target = btn.dataset.tab;
      qsa('.panel').forEach((p) => p.classList.remove('is-active'));
      byId(`panel-${target}`).classList.add('is-active');
    });
  });
  qsa('.nav-link').forEach((lnk) => {
    lnk.addEventListener('click', (e) => {
      e.preventDefault();
      const tgt = lnk.dataset.goto;
      qs(`.tab[data-tab="${tgt}"]`)?.click();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

// Mémoire
let memoState = { size: 10, grid: [], moves: 0, found: 0, revealed: [], timerId: null, startTs: null };
function shuffle(arr){ const a=arr.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
function buildMemoDeck(size){ const pool=LETTERS.slice(0,size); const pairs=[]; pool.forEach((l,idx)=>{ pairs.push({key:idx,face:'fr',text:l.fr}); pairs.push({key:idx,face:'ar',text:l.ar}); }); return shuffle(pairs); }
function renderMemoGrid(){ const grid=byId('memo-grid'); grid.innerHTML=''; memoState.grid.forEach((card,idx)=>{ const el=document.createElement('button'); el.className='card'; el.dataset.face=card.face; el.type='button'; el.textContent=card.text; el.addEventListener('click',()=>onMemoFlip(idx,el)); grid.appendChild(el);}); updateMemoMeta(); }
function updateMemoMeta(){ setTextIfExists('memo-moves', `Coups: ${memoState.moves}`); setTextIfExists('memo-found', `Paires trouvées: ${memoState.found}`); }
function startMemoTimer(){ stopMemoTimer(); memoState.startTs=Date.now(); memoState.timerId=setInterval(()=>{ const s=Math.floor((Date.now()-memoState.startTs)/1000); const mm=String(Math.floor(s/60)).padStart(2,'0'); const ss=String(s%60).padStart(2,'0'); setTextIfExists('memo-timer', `${mm}:${ss}`); },500); }
function stopMemoTimer(){ if(memoState.timerId) clearInterval(memoState.timerId); memoState.timerId=null; }
 function onMemoFlip(index, el){ if(memoState.revealed.length>=2) return; if(el.classList.contains('is-matched')||el.classList.contains('is-revealed')) return; el.classList.add('is-revealed'); memoState.revealed.push({index,key:memoState.grid[index].key,el}); if(memoState.revealed.length===2){ memoState.moves+=1; updateMemoMeta(); const [a,b]=memoState.revealed; if(a.key===b.key){ setTimeout(()=>{ a.el.classList.remove('is-revealed'); b.el.classList.remove('is-revealed'); a.el.classList.add('is-matched'); b.el.classList.add('is-matched'); memoState.found+=1; memoState.revealed=[]; updateMemoMeta(); if(memoState.found===memoState.size){ stopMemoTimer();
            // Progression automatique vers la difficulté suivante (6 → 10 → 28)
            setTimeout(()=>{
              const buttons = qsa('.seg-btn');
              const currentIndex = buttons.findIndex((b)=>b.classList.contains('is-active'));
              const nextBtn = currentIndex >= 0 ? buttons[currentIndex+1] : null;
              if(nextBtn){ nextBtn.click(); }
            }, 700);
          } },350);} else { setTimeout(()=>{ a.el.classList.remove('is-revealed'); b.el.classList.remove('is-revealed'); memoState.revealed=[]; },650);} } }
function initMemo(){ const segBtns=qsa('.seg-btn'); const reset=byId('memo-reset'); function rebuild(){ memoState.grid=buildMemoDeck(memoState.size); memoState.moves=0; memoState.found=0; memoState.revealed=[]; renderMemoGrid(); startMemoTimer(); } segBtns.forEach((b)=>{ b.addEventListener('click',()=>{ segBtns.forEach(x=>x.classList.remove('is-active')); b.classList.add('is-active'); memoState.size=Math.min(parseInt(b.dataset.size,10),LETTERS.length); rebuild(); });}); const active=qs('.seg-btn.is-active'); memoState.size=Math.min(parseInt(active?.dataset.size||'10',10),LETTERS.length); if(reset){ reset.addEventListener('click',rebuild); } rebuild(); }

// Fiches (flip)
let flashIndex = 0;
let flashFront = 'ar';
function renderFlash(){ const card=byId('flashcard'); const front=byId('flash-front'); const back=byId('flash-back'); const item=LETTERS[flashIndex]; front.lang='ar'; front.dir='rtl'; front.style.fontFamily='"Noto Naskh Arabic", serif'; front.textContent=item.ar; back.lang='fr'; back.dir='ltr'; back.style.fontFamily='Inter, system-ui'; back.textContent=item.fr; card.classList.toggle('is-flipped', flashFront!=='ar'); }
function initFlashcards(){ const card=byId('flashcard'); const prev=byId('flash-prev'); const next=byId('flash-next'); const shuffleBtn=byId('flash-shuffle'); function go(delta){ flashIndex=(flashIndex+delta+LETTERS.length)%LETTERS.length; flashFront='ar'; renderFlash(); } card.addEventListener('click',()=>{ flashFront = flashFront==='ar' ? 'fr' : 'ar'; renderFlash(); }); card.addEventListener('keydown',(e)=>{ if(e.code==='Space'||e.key===' '){ e.preventDefault(); flashFront=flashFront==='ar'?'fr':'ar'; renderFlash(); } if(e.key==='ArrowRight') go(1); if(e.key==='ArrowLeft') go(-1); }); prev.addEventListener('click',()=>go(-1)); next.addEventListener('click',()=>go(1)); shuffleBtn.addEventListener('click',()=>{ const pairs=LETTERS.map((v,i)=>[Math.random(),i]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]); const proj=pairs; const proxy=new Proxy(LETTERS,{ get(target,prop){ if(prop==='length') return target.length; const idx=Number(prop); if(!Number.isNaN(idx)) return target[proj[idx]]; return target[prop]; }}); const originalRender=renderFlash; renderFlash=function(){ const card=byId('flashcard'); const item=proxy[flashIndex]; card.lang=flashFront==='ar'?'ar':'fr'; card.dir=flashFront==='ar'?'rtl':'ltr'; card.style.fontFamily=flashFront==='ar'?'"Noto Naskh Arabic", serif':'Inter, system-ui'; const f=byId('flash-front'); const b=byId('flash-back'); f.textContent=item.ar; b.textContent=item.fr; card.classList.toggle('is-flipped', flashFront!=='ar'); }; flashIndex=0; flashFront='ar'; renderFlash(); }); renderFlash(); card.focus(); }

// Quiz (QCM)
let quizIndex=0;
let quizPool=[]; // indices restants pour la série
let quizLength=28;
let score = { points: 0, streak: 0, best: 0 };
let quizTimerId = null;
let quizStartTs = null;

function startQuizTimer(){
  stopQuizTimer();
  quizStartTs = Date.now();
  const timerEl = byId('quiz-timer');
  if(!timerEl) return;
  const update = () => {
    const s = Math.floor((Date.now() - quizStartTs) / 1000);
    const mm = String(Math.floor(s/60)).padStart(2,'0');
    const ss = String(s%60).padStart(2,'0');
    timerEl.textContent = `${mm}:${ss}`;
  };
  update();
  quizTimerId = setInterval(update, 500);
}

function stopQuizTimer(){
  if (quizTimerId) clearInterval(quizTimerId);
  quizTimerId = null;
}

function updateQuizProgress(){
  const fill = byId('quiz-progress-fill');
  if(!fill) return;
  const done = Math.max(0, quizLength - quizPool.length);
  const pct = Math.min(100, Math.round((done / quizLength) * 100));
  fill.style.width = pct + '%';
}
function generateOptions(correctIndex){ const options=new Set([correctIndex]); while(options.size<4){ options.add(Math.floor(Math.random()*LETTERS.length)); } return shuffle(Array.from(options)).map(i=>({ idx:i, label:LETTERS[i].fr })); }
function newQuizLetter(){
  // Initialise le pool si vide
  if (quizPool.length === 0) {
    quizPool = shuffle(LETTERS.map((_, i) => i)).slice(0, quizLength);
    startQuizTimer();
  }
  const leftEl = byId('score-left');
  leftEl.textContent = `Reste: ${quizPool.length}`;
  updateQuizProgress();
  quizIndex = quizPool[0];
  const item=LETTERS[quizIndex];
  byId('quiz-letter').textContent=item.ar;
  const container=byId('quiz-options');
  const feedback=byId('quiz-feedback');
  const points=byId('score-points');
  const streak=byId('score-streak');
  const best=byId('score-best');
  feedback.textContent=''; feedback.className='quiz-feedback';
  container.innerHTML='';
  const opts=generateOptions(quizIndex);
  opts.forEach((opt)=>{
    const btn=document.createElement('button');
    btn.type='button'; btn.className='quiz-option'; btn.textContent=opt.label;
    btn.addEventListener('click',()=>{
      const correct=opt.idx===quizIndex;
      qsa('.quiz-option').forEach((b)=>b.disabled=true);
      btn.classList.add(correct?'correct':'wrong');
      if(!correct){
        const correctBtn=Array.from(container.children).find((c)=>normalizeAnswer(c.textContent)===normalizeAnswer(LETTERS[quizIndex].fr));
        correctBtn?.classList.add('correct');
        container.classList.remove('shake'); void container.offsetWidth; container.classList.add('shake');
        score.streak = 0; // reset série
        score.points = Math.max(0, score.points - 1);
      }
      const okIcon='✅'; const koIcon='❌';
      feedback.textContent= correct ? `${okIcon} Correct !` : `${koIcon} Incorrect. Rép: ${LETTERS[quizIndex].fr}`;
      feedback.className='quiz-feedback ' + (correct?'ok':'ko');
      if (correct) {
        score.streak += 1;
        score.points += 2 + Math.min(3, score.streak - 1); // bonus de série
        score.best = Math.max(score.best, score.streak);
      }
      points.textContent = `Score: ${score.points}`;
      streak.textContent = `Série: ${score.streak}`;
      best.textContent = `Meilleur: ${score.best}`;
      // Consomme l'élément courant et passe au suivant
      quizPool.shift();
      const delay = correct ? 900 : 1400;
      setTimeout(()=>{
        if (quizPool.length === 0) {
          // Fin de série: message final plus moderne
          feedback.innerHTML = `🎉 <strong>Série terminée</strong> — Score: <strong>${score.points}</strong>`;
          feedback.className = 'quiz-feedback quiz-result';
          stopQuizTimer();
          // Réinitialiser pour une nouvelle série au prochain clic sur "Nouvelle lettre"
        } else {
          newQuizLetter();
        }
      }, delay);
    });
    container.appendChild(btn);
  });
}
function initQuiz(){ const next=byId('quiz-next'); next.addEventListener('click',()=>{ quizPool=[]; newQuizLetter(); }); newQuizLetter(); }

window.addEventListener('DOMContentLoaded',()=>{ setupTabs(); initMemo(); initFlashcards(); initQuiz(); });



