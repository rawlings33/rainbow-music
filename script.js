// Simple single-page app behavior + audio simulation
const state = { current: null, playing: false };
const tracks = [
{id:1,title:'Psalm of Hope',artist:'Rainbow Choir',file:'assets/music/sample1.mp3',dur:192},
{id:2,title:'Victory Anthem',artist:'Rainbow Choir',file:'assets/music/sample2.mp3',dur:243},
{id:3,title:'Worship Rising',artist:'Choir Ensemble',file:'assets/music/sample3.mp3',dur:178},
{id:4,title:'Grace Flow',artist:'Youth Chorus',file:'assets/music/sample4.mp3',dur:220}
];


// Elements
const views = document.querySelectorAll('.view');
const navBtns = document.querySelectorAll('.nav-btn');
const tracksGrid = document.getElementById('tracks-grid');
const libList = document.getElementById('lib-list');
const audio = document.getElementById('audio');
const prog = document.getElementById('prog');
const nowTitle = document.getElementById('now-title');
const nowArtist = document.getElementById('now-artist');
const playCollection = document.getElementById('play-collection');
const openSub = document.getElementById('open-sub');


// Navigation
navBtns.forEach(b=>b.addEventListener('click',()=>{ navBtns.forEach(x=>x.classList.remove('active')); b.classList.add('active'); showView(b.dataset.target); }));
function showView(id){ views.forEach(v=>v.classList.remove('active')); const el = document.getElementById(id); if(el) el.classList.add('active'); }


// Render tracks
function renderTracks(){ tracksGrid.innerHTML=''; tracks.forEach(t=>{ const row = document.createElement('div'); row.className='track card'; row.innerHTML = `<div class="thumb">${initials(t.title)}</div><div style="flex:1"><div style="font-weight:800">${t.title}</div><div class="muted">${t.artist} · ${formatDur(t.dur)}</div></div><div><button class="btn" data-id="${t.id}">Play</button></div>`; tracksGrid.appendChild(row); }); }
function renderLib(){ libList.innerHTML=''; tracks.forEach(t=>{ const r = document.createElement('div'); r.className='track'; r.innerHTML = `<div class="thumb">${initials(t.title)}</div><div style="flex:1"><div style="font-weight:800">${t.title}</div><div class="muted">${t.artist} · ${formatDur(t.dur)}</div></div><div><button class="btn" data-id="${t.id}">Play</button></div>`; libList.appendChild(r); }); }
function initials(s){ return s.split(' ').map(w=>w[0]).slice(0,2).join(''); }
function formatDur(sec){ const m = Math.floor(sec/60); const s = sec%60; return `${m}:${s.toString().padStart(2,'0')}`; }


renderTracks(); renderLib();


// Play handling: prefer real audio files in assets, fallback to oscillator tone
let oscCtx=null, osc=null, gain=null, progressTimer=null;
function useOscillator(){ if(!oscCtx) oscCtx = new (window.AudioContext||window.webkitAudioContext)(); osc = oscCtx.createOscillator(); gain = oscCtx.createGain(); osc.type='sine'; osc.frequency.value = 440; gain.gain.value = 0.00008; osc.connect(gain); gain.connect(oscCtx.destination); osc.start(); }
function stopOscillator(){ if(osc){ try{osc.stop()}catch(e){} osc.disconnect(); osc=null } }


function playById(id){ const t = tracks.find(x=>x.id==id); if(!t) return; state.current = t; nowTitle.textContent = t.title; nowArtist.textContent = t.artist; showView('player'); // load audio if file exists
fetch(t.file, {method:'HEAD'}).then(r=>{ if(r.ok){ audio.src = t.file; audio.play(); } else { // fallback
useOscillator(); }
}).catch(()=>{ useOscillator(); });
// animate progress
startProgress(t.dur);
}


// Click handlers (delegation)
document.addEventListener('click', (e)=>{
const btn = e.target.closest('button'); if(!btn) return;
if(btn.dataset.id){ playById(btn.dataset.id); }
if(btn.id === 'play-collection'){ playById(tracks[0].id); }
if(btn.classList.contains('choose-plan')){ alert('Thank you — mock checkout for
