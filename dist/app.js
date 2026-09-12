import { SpellingGame, LEVELS, CHALLENGES } from './game.mjs';
import { WORDS, WORD_PATHS } from './words.mjs';

const paths = {
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2-3 4m.1 3h.01"/>',
  settings: '<path d="M4 7h9m4 0h3M4 17h3m4 0h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
  palette: '<circle cx="12" cy="12" r="9"/><circle cx="8" cy="9" r="1"/><circle cx="12" cy="7" r="1"/><circle cx="16" cy="10" r="1"/><path d="M15 17c-1 0-2-.8-2-1.8 0-.7.4-1.2.9-1.6.8-.5 1.1-1.4.7-2.1"/>',
  flag: '<path d="M5 21V4m0 1h11l-2 4 2 4H5"/>',
  book: '<path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1v15"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2m-7 9v3m-4 0h8"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/><circle cx="9" cy="7" r="4"/>',
  headphones: '<path d="M3 14v-3a9 9 0 0 1 18 0v3M3 13h3v8H4a1 1 0 0 1-1-1zm18 0h-3v8h2a1 1 0 0 0 1-1z"/>',
  sparkles: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3zm8-2v4m-2-2h4"/>',
  volume: '<path d="m11 5-6 4H2v6h3l6 4V5zm4 3a5 5 0 0 1 0 8m3-11a9 9 0 0 1 0 14"/>',
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  play: '<path d="m8 4 12 8-12 8V4Z"/>',
  keyboard: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M7 16h10"/>',
  backspace: '<path d="M20 4H8l-6 8 6 8h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm-10 5 6 6m0-6-6 6"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  trophy: '<path d="M8 3h8v7a4 4 0 0 1-8 0V3Zm0 2H3v2a5 5 0 0 0 5 5m8-7h5v2a5 5 0 0 1-5 5m-4 2v5m-4 2h8m-7-2h6"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  message: '<path d="M21 15a3 3 0 0 1-3 3H7l-5 4V5a3 3 0 0 1 3-3h13a3 3 0 0 1 3 3v10Z"/><path d="M7 8h10M7 12h6"/>',
  replay: '<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/>'
  ,user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'
  ,chart: '<path d="M4 20V10m6 10V4m6 16v-7m4 7H2"/>'
  ,download: '<path d="M12 3v12m-5-5 5 5 5-5M4 21h16"/>'
  ,upload: '<path d="M12 16V4m-5 5 5-5 5 5M4 20h16"/>'
  ,printer: '<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v7H6z"/>'
  ,trash: '<path d="M4 7h16m-10 4v6m4-6v6M9 3h6l1 4H8l1-4Zm-3 4 1 14h10l1-14"/>'
};
const icon = name => `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.sparkles}</svg>`;
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const STORE_KEY = 'spellstage-progress-v1';
const makeId = () => globalThis.crypto?.randomUUID?.() || `learner-${Date.now()}-${Math.random().toString(16).slice(2)}`;
const newProfile = (name = 'Learner', path = 'beginner') => ({ id: makeId(), name, path, createdAt: Date.now(), mastery: {}, sessions: [], customWords: [] });
function loadStore() {
  try {
    const loaded = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (loaded?.profiles?.length) {
      loaded.profiles = loaded.profiles.slice(0, 8).map(profile => ({ ...newProfile(), ...profile, name: String(profile.name || 'Learner').slice(0, 24), path: Object.hasOwn(WORD_PATHS, profile.path) ? profile.path : 'beginner', mastery: profile.mastery || {}, sessions: Array.isArray(profile.sessions) ? profile.sessions.slice(-50) : [], customWords: Array.isArray(profile.customWords) ? profile.customWords.slice(0, 200) : [] }));
      if (!loaded.profiles.some(profile => profile.id === loaded.activeProfileId)) loaded.activeProfileId = loaded.profiles[0].id;
      return loaded;
    }
  } catch {}
  const profile = newProfile();
  return { activeProfileId: profile.id, profiles: [profile] };
}
let learnerStore = loadStore();
const activeProfile = () => learnerStore.profiles.find(profile => profile.id === learnerStore.activeProfileId) || learnerStore.profiles[0];
function saveStore() { try { localStorage.setItem(STORE_KEY, JSON.stringify(learnerStore)); } catch {} }
function currentBank() {
  const profile = activeProfile();
  const bank = new Map(WORDS.map(item => [item.word, item]));
  for (const item of profile.customWords) bank.set(item.word, { ...item, path: profile.path, custom: true });
  return [...bank.values()];
}
let game = new SpellingGame(currentBank());
const modeInfo = {
  practice: ['Practice', 'No timer. No pressure. Just you and the words.'],
  challenge: ['Challenge', 'Choose your track. Reach the goal before your chances run out.'],
  show: ['Game Show', 'Ten words. Three chances. Your moment to shine.'],
  competition: ['Competition', 'Five words each. Pass the device. Claim the trophy.']
};
const THEMES = {
  kids: { label: 'Kids', note: 'Bigger shapes and playful colors', color: '#ff5c72' },
  student: { label: 'Student', note: 'Bright, focused, and energetic', color: '#4030a5' },
  adult: { label: 'Adult', note: 'Calm colors and a compact finish', color: '#163f4d' }
};
let mode = 'show', level = 'medium', typed = '', clue = null, flash = false, flashTimer = null, handoff = false;
let challengeTrack = 'kids', theme = 'student';
let flashLearning = false, playerCount = 2, playerNames = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
let audioError = '', speakingId = 0, effects = true, selectedVoice = '', audioContext = null;
let largeText = false, reducedMotion = false, retryPending = null, wordStartedAt = 0, sessionStartedAt = 0;
let installPrompt = null;
let modalCloseHandler = null, utterance = null;
const synth = window.speechSynthesis;
try { const saved = JSON.parse(localStorage.getItem('spellstage-preferences') || '{}'); effects = saved.effects !== false; selectedVoice = typeof saved.voice === 'string' ? saved.voice : ''; theme = Object.hasOwn(THEMES, saved.theme) ? saved.theme : 'student'; challengeTrack = Object.hasOwn(CHALLENGES, saved.challengeTrack) ? saved.challengeTrack : 'kids'; largeText = saved.largeText === true; reducedMotion = saved.reducedMotion === true; } catch {}
function savePreferences() { try { localStorage.setItem('spellstage-preferences', JSON.stringify({ effects, voice: selectedVoice, theme, challengeTrack, largeText, reducedMotion })); } catch {} }
function applyAccessibility() { document.body.classList.toggle('large-text', largeText); document.body.classList.toggle('reduce-motion', reducedMotion); }
function applyTheme(nextTheme, persist = true) {
  if (!Object.hasOwn(THEMES, nextTheme)) return false;
  theme = nextTheme;
  document.body.dataset.theme = theme;
  $('#theme-label').textContent = THEMES[theme].label;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEMES[theme].color);
  if (persist) savePreferences();
  return true;
}
function refreshLearnerChrome() {
  const profile = activeProfile();
  $('#learner-label').textContent = profile.name;
  $('#sidebar-learner-name').textContent = profile.name;
  $('#sidebar-path-name').textContent = WORD_PATHS[profile.path].label;
}
function announce(message) { $('#announcement').textContent = message; }
function fillIcons(root = document) { root.querySelectorAll('[data-icon]').forEach(node => { node.innerHTML = icon(node.dataset.icon); }); }
fillIcons();
applyTheme(theme, false);
applyAccessibility();
refreshLearnerChrome();

function spellingDiff(expected, answer) {
  const target = expected.toLowerCase(), typedWord = answer.toLowerCase();
  const dp = Array.from({ length: typedWord.length + 1 }, (_, i) => Array.from({ length: target.length + 1 }, (_, j) => i ? j ? 0 : i : j));
  for (let i = 1; i <= typedWord.length; i++) for (let j = 1; j <= target.length; j++) {
    dp[i][j] = typedWord[i - 1] === target[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
  }
  const aligned = [];
  let i = typedWord.length, j = target.length;
  while (i || j) {
    if (i && j && typedWord[i - 1] === target[j - 1]) { aligned.push({ typed: typedWord[--i], target: target[--j], state: 'same' }); continue; }
    const substitute = i && j ? dp[i - 1][j - 1] : Infinity;
    const extra = i ? dp[i - 1][j] : Infinity;
    const missing = j ? dp[i][j - 1] : Infinity;
    const best = Math.min(substitute, extra, missing);
    if (best === substitute) aligned.push({ typed: typedWord[--i], target: target[--j], state: 'changed' });
    else if (best === extra) aligned.push({ typed: typedWord[--i], target: '·', state: 'extra' });
    else aligned.push({ typed: '·', target: target[--j], state: 'missing' });
  }
  aligned.reverse();
  const changed = aligned.filter(part => part.state !== 'same').length;
  return { aligned, changed, hint: [...target].map((letter, index) => typedWord[index] === letter ? letter : '_').join(' ') };
}
function diffRow(parts, key) {
  return parts.map(part => `<span class="letter-${part.state}">${part[key] === '·' ? '<i aria-label="blank">·</i>' : esc(part[key])}</span>`).join('');
}
function spellingTip(word) {
  if (/(.)\1/.test(word)) return 'Watch the doubled letter. Say the word slowly, then spell that sound twice.';
  if (/ie|ei/.test(word)) return 'Look closely at the i and e pair; their order is the tricky part.';
  if (/tion|sion/.test(word)) return 'Listen for the final “shun” sound, then choose -tion or -sion.';
  if (/ph/.test(word)) return 'The f sound in this word is written with ph.';
  if (/^rh|rh/.test(word)) return 'The r sound is written with the letter pair rh.';
  if (/e$/.test(word)) return 'Remember the quiet e at the end.';
  const middle = Math.ceil(word.length / 2);
  return `Break it into two visual chunks: ${word.slice(0, middle)} · ${word.slice(middle)}.`;
}
function masteryState(record, now = Date.now()) {
  if (!record?.attempts) return 'new';
  const accuracy = record.correct / record.attempts;
  if (record.attempts >= 3 && accuracy >= .8 && record.streak >= 2) return 'mastered';
  if (record.lastCorrect === false || accuracy < .75) return 'needs practice';
  if ((record.nextDue || 0) <= now) return 'due';
  return 'learning';
}
function recordAttempt(result, responseMs) {
  if (!result || result.progressRecorded || mode === 'competition') return;
  const profile = activeProfile();
  const record = profile.mastery[result.word] || { attempts: 0, correct: 0, recovered: 0, streak: 0, mistakes: 0, totalMs: 0 };
  const firstTryCorrect = result.correct && !result.firstAttempt;
  record.attempts++;
  record.correct += Number(firstTryCorrect);
  record.recovered += Number(result.correct && Boolean(result.firstAttempt));
  record.streak = firstTryCorrect ? record.streak + 1 : 0;
  record.lastCorrect = firstTryCorrect;
  record.lastSeen = Date.now();
  record.lastTyped = result.firstAttempt || result.typed || '';
  record.mistakes += Number(!firstTryCorrect);
  record.totalMs += Math.max(0, Number(responseMs) || 0);
  const days = firstTryCorrect ? [0, 1, 3, 7, 14, 30][Math.min(record.streak, 5)] : 0;
  record.nextDue = firstTryCorrect ? record.lastSeen + days * 86400000 : record.lastSeen + 600000;
  profile.mastery[result.word] = record;
  result.progressRecorded = true;
  saveStore();
}
function recordSession() {
  if (game.sessionRecorded || !game.history.length || mode === 'competition') return;
  const profile = activeProfile();
  profile.sessions.push({ date: new Date().toISOString(), mode, level: game.level, path: game.path, challengeTrack: game.challengeTrack, total: game.history.length, correct: game.correct, firstTryCorrect: game.history.filter(result => result.correct && !result.firstAttempt).length, score: game.score, durationMs: Math.max(0, Date.now() - sessionStartedAt) });
  profile.sessions = profile.sessions.slice(-50);
  game.sessionRecorded = true;
  saveStore();
}

function stopSpeech() {
  speakingId++;
  synth?.cancel();
  utterance = null;
  $('.speaker-wrap')?.classList.remove('speaking');
}
function audioFailure() {
  audioError = 'Voice playback is unavailable. Use the definition or sentence clue to keep playing.';
  if (game.phase === 'playing' && !game.paused && !flash && !handoff) {
    game.hint('definition');
    clue = 'definition';
    renderStage();
  }
  announce(audioError);
}
function speak(text, slow = false, fallback = false) {
  stopSpeech();
  if (!synth || !window.SpeechSynthesisUtterance) { if (fallback) audioFailure(); else announce('Voice playback is unavailable in this browser.'); return false; }
  try {
    const id = speakingId;
    const u = new SpeechSynthesisUtterance(text);
    utterance = u;
    const voices = synth.getVoices().filter(v => /^en(?:-|_)/i.test(v.lang) || v.lang === 'en');
    u.voice = voices.find(v => v.voiceURI === selectedVoice) || voices.find(v => v.lang === 'en-US' && v.localService) || voices.find(v => v.lang === 'en-US') || voices[0] || null;
    u.lang = 'en-US'; u.rate = slow ? 0.65 : 0.87; u.pitch = 1; u.volume = 1;
    u.onstart = () => { if (id === speakingId) $('.speaker-wrap')?.classList.add('speaking'); };
    u.onend = () => { if (id === speakingId) { $('.speaker-wrap')?.classList.remove('speaking'); utterance = null; } };
    u.onerror = event => { if (id !== speakingId || ['canceled', 'interrupted'].includes(event.error)) return; $('.speaker-wrap')?.classList.remove('speaking'); if (fallback) audioFailure(); else announce('Voice playback failed. Try another voice in settings.'); };
    synth.speak(u);
    return true;
  } catch { if (fallback) audioFailure(); return false; }
}
function unlockEffects() {
  if (!effects) return;
  try { const Audio = window.AudioContext || window.webkitAudioContext; if (Audio) { audioContext ||= new Audio(); if (audioContext.state === 'suspended') void audioContext.resume().catch(() => {}); } } catch {}
}
function chime(correct) {
  if (!effects || !audioContext || audioContext.state !== 'running') return;
  try {
    const time = audioContext.currentTime;
    (correct ? [523.25, 659.25, 783.99] : [246.94, 196]).forEach((freq, i) => {
      const osc = audioContext.createOscillator(), gain = audioContext.createGain();
      osc.type = 'sine'; osc.frequency.value = freq; gain.gain.setValueAtTime(0, time + i * .09); gain.gain.linearRampToValueAtTime(.06, time + i * .09 + .015); gain.gain.exponentialRampToValueAtTime(.001, time + i * .09 + .2);
      osc.connect(gain); gain.connect(audioContext.destination); osc.start(time + i * .09); osc.stop(time + i * .09 + .23); osc.onended = () => { osc.disconnect(); gain.disconnect(); };
    });
  } catch {}
}
function waveButton(action, label, disabled = false) {
  const bars = '<i></i><i></i><i></i><i></i>';
  return `<div class="speaker-wrap"><span class="sound-bars" aria-hidden="true">${bars}</span><button class="speaker-button" data-action="${action}" aria-label="${label}" ${disabled ? 'disabled' : ''}>${icon('volume')}</button><span class="sound-bars right" aria-hidden="true">${bars}</span></div>`;
}

function renderOptions() {
  const locked = ['playing', 'feedback'].includes(game.phase);
  if (mode === 'practice') {
    $('#mode-options').innerHTML = `<div class="mode-options"><label><input id="learning-toggle" type="checkbox" ${flashLearning ? 'checked' : ''} ${locked ? 'disabled' : ''}>Show word for 3 seconds first</label></div>`;
  } else if (mode === 'competition') {
    $('#mode-options').innerHTML = `<div class="mode-options"><label for="player-count">Players<select id="player-count" ${locked ? 'disabled' : ''}>${[2,3,4].map(n => `<option value="${n}" ${n === playerCount ? 'selected' : ''}>${n}</option>`).join('')}</select></label><div class="player-fields">${playerNames.slice(0, playerCount).map((name, i) => `<input class="player-name" data-player="${i}" aria-label="Player ${i+1} name" maxlength="24" value="${esc(name)}" ${locked ? 'disabled' : ''}>`).join('')}</div></div>`;
  } else if (mode === 'challenge') {
    $('#mode-options').innerHTML = `<fieldset class="challenge-selector" ${locked ? 'disabled' : ''}><legend class="eyebrow">CHALLENGE TRACK</legend>${Object.entries(CHALLENGES).map(([key, item]) => `<label><input type="radio" name="challenge-track" value="${key}" ${key === challengeTrack ? 'checked' : ''}><span><strong>${item.label}</strong><small>${item.total} words · ${item.seconds}s · goal ${item.target}</small></span></label>`).join('')}</fieldset>`;
  } else $('#mode-options').innerHTML = '';
}
function renderSetup() {
  const locked = ['playing', 'feedback'].includes(game.phase);
  $$('.mode').forEach(button => { button.disabled = locked; button.classList.toggle('active', button.dataset.mode === mode); button.setAttribute('aria-pressed', String(button.dataset.mode === mode)); });
  $('.difficulty').hidden = mode === 'challenge';
  $('.difficulty').disabled = locked || mode === 'challenge';
  $$('[name=level]').forEach(input => { input.checked = input.value === level; });
  $('#mode-title').textContent = modeInfo[mode][0];
  $('#mode-description').textContent = mode === 'challenge' ? `${CHALLENGES[challengeTrack].total} words · ${CHALLENGES[challengeTrack].lives} chances · goal ${CHALLENGES[challengeTrack].target}` : modeInfo[mode][1];
  $('#level-badge').textContent = mode === 'challenge' ? CHALLENGES[challengeTrack].label : LEVELS[level].label;
  renderOptions();
}
function renderChrome() {
  const ready = game.phase === 'ready';
  const challenge = CHALLENGES[challengeTrack];
  const total = ready ? mode === 'competition' ? playerCount * 5 : mode === 'challenge' ? challenge.total : 10 : game.total;
  const current = ready ? 1 : Math.min(game.index + 1, total);
  $('#round-label').innerHTML = `${mode === 'competition' ? 'TURN' : 'WORD'} ${String(current).padStart(2, '0')} <span>/ ${total}</span>`;
  $('#round-dots').innerHTML = Array.from({length: total}, (_, i) => `<span class="round-dot ${!ready && game.history[i] ? game.history[i].correct ? 'correct' : 'incorrect' : i === current - 1 ? 'current' : ''}"></span>`).join('');
  $('#score').textContent = ready ? '0' : mode === 'competition' ? game.player.score : game.score;
  const showsLives = ['show', 'challenge'].includes(mode);
  const readyLives = mode === 'challenge' ? challenge.lives : 3;
  $('#lives').innerHTML = showsLives ? Array.from({length:readyLives}, (_, i) => `<span class="${i >= (ready ? readyLives : game.lives) ? 'lost' : ''}">${icon('heart')}</span>`).join('') + `<span class="life-count">${ready ? readyLives : game.lives} chances</span>` : `<span>${icon(mode === 'practice' ? 'book' : 'users')}</span>`;
  $('#lives').setAttribute('aria-label', showsLives ? `${ready ? readyLives : game.lives} chances remaining` : modeInfo[mode][0]);
  $('#stage-note').textContent = ready ? mode === 'challenge' ? `Reach ${challenge.target} correct to pass ${challenge.label}` : 'A fresh set of words every game' : mode === 'practice' ? 'Take your time. Every word is progress.' : mode === 'competition' ? `${game.player.name} · turn ${Math.floor(game.index / game.players.length) + 1} of 5` : mode === 'challenge' ? game.correct >= game.target ? 'Goal reached — keep going for more stars!' : `${game.correct} of ${game.target} correct toward your goal` : game.streak > 1 ? `${game.streak} correct in a row. Keep it going!` : 'Listen. Think. Spell.';
  $('#pause-button').hidden = game.phase !== 'playing' || game.paused || handoff;
  const board = $('#player-board');
  board.hidden = !['competition', 'challenge'].includes(mode) || ready;
  board.innerHTML = board.hidden ? '' : mode === 'challenge' ? `<div class="challenge-progress"><div><span>${esc(CHALLENGES[challengeTrack].label)} goal</span><strong>${game.correct} / ${game.target}</strong></div><progress max="${game.target}" value="${Math.min(game.correct, game.target)}">${game.correct} of ${game.target}</progress></div>` : game.players.map((p, i) => `<div class="player-chip ${i === game.playerIndex && game.phase !== 'finished' ? 'active' : ''}" ${i === game.playerIndex ? 'aria-current="true"' : ''}><span>${esc(p.name)}</span><strong>${p.score}</strong></div>`).join('');
  setKeyboard();
}
function renderReady() {
  const challenge = CHALLENGES[challengeTrack];
  const title = mode === 'practice' ? 'Let’s find your rhythm.' : mode === 'competition' ? 'Who’s the word champion?' : mode === 'challenge' ? `Take the ${challenge.label} challenge.` : 'Ready for the spotlight?';
  const subtitle = mode === 'practice' ? 'Listen to a word, then give it your best spelling.' : mode === 'competition' ? 'Gather your players. The first word is waiting.' : mode === 'challenge' ? `Spell at least ${challenge.target} words correctly to complete this track.` : 'Listen to the word. Spell it out. Make it count.';
  const wordPath = mode === 'challenge' ? WORD_PATHS[challenge.path] : WORD_PATHS[activeProfile().path];
  return `${waveButton('sample', 'Test the voice')}<h2>${title}</h2><p class="stage-subtitle">${subtitle}</p><p class="learner-ready">${icon('user')} ${esc(activeProfile().name)} <span>·</span> ${esc(wordPath.label)} <span>·</span> Adaptive mix</p><button class="primary-button" data-action="start">${icon('play')} ${mode === 'practice' ? 'Start practicing' : mode === 'competition' ? 'Start competition' : mode === 'challenge' ? 'Start challenge' : 'Let’s play'}</button><p class="start-note">${mode === 'practice' ? '10 words · Untimed · Clues included' : mode === 'competition' ? `${playerCount} players · 5 words each · One device` : mode === 'challenge' ? `${challenge.total} words · ${challenge.seconds} seconds each · ${challenge.lives} chances` : `${LEVELS[level].seconds} seconds per word · 3 chances`}</p>${!synth ? '<p class="audio-error">Speech is unavailable in this browser. You can play using clues.</p>' : ''}`;
}
function renderPlaying() {
  if (handoff) return `<div class="results-badge">${icon('users')}</div><h2>Over to ${esc(game.player.name)}.</h2><p class="stage-subtitle">Pass the device. Your timer starts when you’re ready.</p><button class="primary-button" data-action="take-turn">I’m ready ${icon('arrow')}</button>`;
  if (game.paused) return `<div class="pause-content"><div class="results-badge" style="margin:auto;background:var(--wash);color:var(--deep)">${icon('pause')}</div><h2>A little intermission.</h2><p class="stage-subtitle">Your word and timer are waiting for you.</p><div class="feedback-actions"><button class="primary-button" data-action="resume">${icon('play')} Resume game</button><button class="secondary-button" data-action="end">End game</button></div></div>`;
  if (flash) return `${waveButton('hear', 'Hear the word')}<p class="word-prompt">Look closely. Remember the spelling.</p><div class="flash-word">${esc(game.word.word)}</div><p class="stage-subtitle">The word will disappear in a moment.</p>`;
  const retry = retryPending ? `<div class="retry-panel" role="note"><strong>Almost — try once more.</strong><p aria-label="Spelling pattern">${esc(retryPending.hint)}</p><small>${retryPending.changed} letter position${retryPending.changed === 1 ? '' : 's'} need attention. No chance used yet.</small></div>` : '';
  return `${game.timed ? `<div class="timer" role="timer" aria-label="Time remaining">${icon('clock')}<span id="time-left">${game.remaining()}s</span></div>` : ''}${waveButton('hear', 'Hear the word again')}<p class="word-prompt">${game.word.word.length} letters <span aria-hidden="true">·</span> <strong>${esc(game.word.part)}</strong></p>${audioError ? `<p class="audio-error">${esc(audioError)}</p>` : ''}${retry}<form class="answer-form" id="answer-form"><div class="answer-wrap"><label class="sr-only" for="answer">Spell the word you hear</label><input id="answer" class="answer-input ${typed.length > 12 ? 'long-answer' : ''}" type="text" inputmode="none" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" maxlength="25" value="${esc(typed)}" placeholder="${retryPending ? 'Try the spelling again' : 'Your word goes here'}" aria-describedby="answer-notice" data-lpignore="true"></div><p class="inline-notice" id="answer-notice" hidden></p><div class="play-controls"><button class="primary-button" type="submit">${retryPending ? 'Check second try' : 'Check spelling'} ${icon('arrow')}</button><button class="text-button skip-button" type="button" data-action="skip">${mode === 'practice' ? 'Reveal word' : 'Skip word'}</button></div></form><div class="clue-actions"><button class="clue-button" data-action="slow">${icon('volume')} Slower</button><button class="clue-button" data-action="definition" aria-pressed="${clue === 'definition'}">${icon('book')} Definition</button><button class="clue-button" data-action="sentence" aria-pressed="${clue === 'sentence'}">${icon('message')} Sentence</button></div>${clue ? `<p class="clue-text">${clue === 'definition' ? esc(game.word.definition) : esc(game.word.sentence.replace('{word}', '______'))}</p>` : ''}`;
}
function renderFeedback() {
  const r = game.history.at(-1);
  const last = game.index + 1 >= game.total || (['show', 'challenge'].includes(mode) && game.lives === 0);
  const heading = r.correct ? r.firstAttempt ? 'You fixed it on the second try!' : ['Right on the letter!', 'Beautifully spelled.', 'You’ve got it!'][game.index % 3] : r.reason === 'timeout' ? 'Time’s up. Here’s the word.' : r.reason === 'skip' ? 'One for the memory bank.' : 'A word to remember.';
  const answerDetail = r.correct ? `<strong>+${r.points} points</strong>${r.firstAttempt ? ' · Second-try score' : r.bonus ? ` · Includes ${r.bonus} time bonus` : ''}` : r.reason === 'answer' ? `You wrote <b>${esc(r.typed)}</b>${['show', 'challenge'].includes(mode) ? ' · One chance used' : ''}` : `${r.reason === 'timeout' ? 'The clock ran out' : 'Word revealed'}${['show', 'challenge'].includes(mode) ? ' · One chance used' : ''}`;
  const original = r.firstAttempt || (r.reason === 'answer' ? r.typed : '');
  const diff = original ? spellingDiff(r.word, original) : null;
  const diagnostic = diff ? `<div class="spelling-diff" aria-label="Letter-by-letter spelling comparison"><div><span>Your first try</span><b>${diffRow(diff.aligned, 'typed')}</b></div><div><span>Correct word</span><b>${diffRow(diff.aligned, 'target')}</b></div><p>${esc(spellingTip(r.word))}</p></div>` : `<p class="spelling-tip">${esc(spellingTip(r.word))}</p>`;
  return `<div class="feedback-badge ${r.correct ? '' : 'incorrect'}">${icon(r.correct ? 'check' : 'book')}</div><h2>${heading}</h2><div class="feedback-word">${esc(r.word)}</div><p class="feedback-definition">${esc(r.definition)}</p><p class="feedback-detail">${answerDetail}</p>${diagnostic}<div class="feedback-actions"><button class="primary-button" data-action="next">${last ? 'See results' : mode === 'competition' ? 'Next player' : 'Next word'} ${icon('arrow')}</button><button class="icon-button" data-action="hear-result" aria-label="Hear the correct spelling">${icon('volume')}</button></div>`;
}
function renderResults() {
  const correct = game.history.filter(r => r.correct).length;
  const firstTryCorrect = game.history.filter(r => r.correct && !r.firstAttempt).length;
  const accuracy = game.history.length ? Math.round(firstTryCorrect / game.history.length * 100) : 0;
  const ranked = [...game.players].sort((a,b) => b.score - a.score);
  const winners = ranked.filter(p => p.score === ranked[0].score);
  const challengePassed = mode === 'challenge' && game.challengePassed;
  const stars = mode === 'challenge' ? correct === game.total ? 3 : challengePassed && correct >= game.target + Math.max(1, Math.ceil((game.total - game.target) / 2)) ? 2 : challengePassed ? 1 : 0 : 0;
  const title = mode === 'competition' ? winners.length > 1 ? 'It’s a tie!' : `${esc(ranked[0].name)} takes the trophy!` : mode === 'challenge' ? challengePassed ? `${CHALLENGES[challengeTrack].label} challenge complete!` : 'So close. Try this track again.' : correct === game.total ? 'A perfect performance!' : accuracy >= 70 ? 'That’s a strong finish.' : 'Every word is a new start.';
  const subtitle = mode === 'competition' ? 'Good words. Great company. Ready for a rematch?' : mode === 'challenge' ? challengePassed ? `You reached the goal with ${correct} correct answer${correct === 1 ? '' : 's'}.` : `You need ${Math.max(0, game.target - correct)} more correct answer${game.target - correct === 1 ? '' : 's'} to pass.` : `${correct} of ${game.history.length} words spelled correctly${game.history.length < game.total ? ` · ${game.total - game.history.length} not reached` : ''}.`;
  const challengeSummary = `<div class="challenge-stars" aria-label="${stars} of 3 stars">${[1,2,3].map(n => `<span class="${n <= stars ? 'earned' : ''}" aria-hidden="true">★</span>`).join('')}</div><div class="summary-grid"><div><strong>${correct}</strong><span>Correct</span></div><div><strong>${game.target}</strong><span>Goal</span></div><div><strong>${game.score}</strong><span>Points</span></div></div>`;
  return `<div class="results-badge">${icon('trophy')}</div><h2>${title}</h2><p class="stage-subtitle">${subtitle}</p>${mode === 'competition' ? `<div class="leaderboard">${ranked.map((p, i) => `<div><span class="rank-number">${ranked.findIndex(x => x.score === p.score) + 1}</span><span class="rank-name">${esc(p.name)}</span><strong>${p.score} pts</strong><span class="muted">${p.correct}/5</span></div>`).join('')}</div>` : mode === 'challenge' ? challengeSummary : `<div class="summary-grid"><div><strong>${game.score}</strong><span>Total points</span></div><div><strong>${accuracy}%</strong><span>First-try accuracy</span></div><div><strong>${game.bestStreak}</strong><span>Best streak</span></div></div>`}<div class="feedback-actions"><button class="primary-button" data-action="start">${icon('replay')} ${mode === 'challenge' && !challengePassed ? 'Try again' : 'Play again'}</button><button class="secondary-button" data-action="reset">Choose a mode</button></div><details class="results-review"><summary>Review your ${game.history.length} words</summary><ul class="review-list">${game.history.map(r => `<li class="review-item ${r.correct ? '' : 'incorrect'}"><span data-icon="${r.correct ? 'check' : 'close'}">${icon(r.correct ? 'check' : 'close')}</span><div><strong>${esc(r.word)}</strong>${mode === 'competition' ? `<span class="review-player"> · ${esc(r.player)}</span>` : ''}<p>${r.correct ? r.firstAttempt ? `Correct on second try · first spelling: ${esc(r.firstAttempt)}` : 'Correct on first try' : r.reason === 'answer' ? `Your spelling: ${esc(r.typed)}` : r.reason === 'timeout' ? 'Time ran out' : 'Revealed'} · ${r.points} points</p><p>${esc(r.definition)}</p></div><a href="https://www.merriam-webster.com/dictionary/${encodeURIComponent(r.word)}" target="_blank" rel="noopener noreferrer" aria-label="Look up ${esc(r.word)} in Merriam-Webster">Look up ↗</a></li>`).join('')}</ul></details>`;
}
function renderStage() {
  $('#stage-content').innerHTML = game.phase === 'ready' ? renderReady() : game.phase === 'playing' ? renderPlaying() : game.phase === 'feedback' ? renderFeedback() : renderResults();
  renderChrome();
}
function render() { renderSetup(); renderStage(); }
function focusAnswer() { if (!flash && !handoff && !game.paused && !$('#modal').open) $('#answer')?.focus({ preventScroll: true }); }
function setKeyboard() { const enabled = game.phase === 'playing' && !game.paused && !flash && !handoff && !$('#modal').open; $$('.key').forEach(key => key.disabled = !enabled); }
function finishFlash() {
  clearTimeout(flashTimer); flashTimer = null;
  if (!flash || game.phase !== 'playing' || game.paused) return;
  flash = false; renderStage(); focusAnswer();
}
function prepareWord() {
  typed = ''; clue = null; audioError = ''; flash = false; retryPending = null; wordStartedAt = Date.now();
  if (mode === 'competition') {
    handoff = true; game.pause(); renderStage(); announce(`Pass the device to ${game.player.name}.`);
    $('#stage-content [data-action="take-turn"]')?.focus({preventScroll:true});
  } else {
    handoff = false;
    flash = mode === 'practice' && flashLearning;
    renderStage();
    speak(game.word.word, false, true);
    if (flash) flashTimer = setTimeout(finishFlash, 3000);
    else focusAnswer();
  }
}
function startGame() {
  if (['playing','feedback'].includes(game.phase)) return false;
  stopSpeech(); clearTimeout(flashTimer); unlockEffects();
  game = new SpellingGame(currentBank());
  try { game.start({mode, level, challenge: challengeTrack, path: activeProfile().path, progress: activeProfile().mastery, players:playerNames.slice(0, playerCount).map((name,i) => name.trim() || `Player ${i+1}`)}); }
  catch (error) { announce(error.message); return false; }
  sessionStartedAt = Date.now(); renderSetup(); prepareWord(); return true;
}
function showFeedback(result) {
  if (!result) return;
  if (retryPending && !result.firstAttempt) result.firstAttempt = retryPending.typed;
  recordAttempt(result, Date.now() - wordStartedAt);
  retryPending = null;
  clearTimeout(flashTimer); flash = false; stopSpeech(); chime(result.correct); renderStage();
  announce(result.correct ? `Correct. ${result.word}. ${result.points} points.` : `${result.reason === 'timeout' ? 'Time is up.' : 'The correct spelling is'} ${result.word.split('').join(' ')}.`);
  $('#stage-content [data-action="next"]')?.focus({preventScroll:true});
}
function submitAnswer() {
  if (game.phase !== 'playing' || game.paused || flash || handoff || $('#modal').open) return null;
  if (!typed.trim()) {
    $('#answer-notice').hidden = false; $('#answer-notice').textContent = 'Type your spelling first, or reveal the word.';
    focusAnswer(); announce('Enter your spelling before checking.'); return null;
  }
  const timeout = game.tick();
  if (timeout) { showFeedback(timeout); return timeout; }
  if (typed.trim().toLowerCase() !== game.word.word && !retryPending && mode !== 'competition') {
    const diff = spellingDiff(game.word.word, typed.trim());
    retryPending = { typed: typed.trim().toLowerCase(), hint: diff.hint, changed: diff.changed };
    typed = '';
    renderStage();
    announce(`Almost. ${diff.changed} letter positions need attention. Try the word once more.`);
    focusAnswer();
    return { retry: true, hint: diff.hint };
  }
  const retry = retryPending;
  const result = game.submit(typed);
  if (result?.correct && retry) {
    result.firstAttempt = retry.typed;
    const penalty = Math.round(result.points * .3);
    result.points -= penalty;
    game.player.score -= penalty;
    result.retryPenalty = penalty;
  }
  showFeedback(result); return result;
}
function insertKey(key) {
  if (game.phase !== 'playing' || game.paused || flash || handoff || $('#modal').open) return;
  if (key === 'ENTER') { submitAnswer(); return; }
  const field = $('#answer');
  if (!field) return;
  const start = field.selectionStart ?? typed.length, end = field.selectionEnd ?? typed.length;
  let caret;
  if (key === 'BACKSPACE') { typed = typed.slice(0, Math.max(0, start - (start === end ? 1 : 0))) + typed.slice(end); caret = Math.max(0, start - (start === end ? 1 : 0)); }
  else if (/^[a-z]$/i.test(key) && (typed.length < 25 || start < end)) { typed = typed.slice(0,start) + key.toLowerCase() + typed.slice(end); caret = start + 1; }
  else return;
  field.value = typed; field.classList.toggle('long-answer', typed.length > 12); field.focus({preventScroll:true}); field.setSelectionRange(caret,caret);
  const notice = $('#answer-notice'); if (notice) notice.hidden = true;
}
function pauseGame() {
  if (handoff || game.paused || game.phase !== 'playing') return;
  if (!game.pause()) { if (game.phase === 'feedback') showFeedback(game.history.at(-1)); return; }
  stopSpeech(); clearTimeout(flashTimer); renderStage(); announce('Game paused.');
}
function resumeGame() {
  if (!game.resume()) return;
  renderStage();
  if (flash) flashTimer = setTimeout(finishFlash, 3000);
  speak(game.word.word,false,true); focusAnswer();
}
function resetGame() {
  stopSpeech(); clearTimeout(flashTimer); game = new SpellingGame(currentBank()); typed = ''; flash = false; handoff = false; retryPending = null; refreshLearnerChrome(); render();
}

function openModal(title, html, onClose = null) {
  if (game.phase === 'playing' && !game.paused && !handoff) pauseGame();
  stopSpeech();
  $('#modal-title').textContent = title; $('#modal-content').innerHTML = html;
  modalCloseHandler = onClose; if (!$('#modal').open) $('#modal').showModal(); setKeyboard();
}
function closeModal() { $('#modal').close(); }
$('#modal').addEventListener('close', () => { const cb = modalCloseHandler; modalCloseHandler = null; stopSpeech(); cb?.(); setKeyboard(); if (game.paused) $('#stage-content [data-action="resume"]')?.focus({preventScroll:true}); });
$('#modal-close').addEventListener('click', closeModal);
$('#modal').addEventListener('click', event => { if (event.target === $('#modal')) { const rect = $('#modal').getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeModal(); } });

$('#help-button').addEventListener('click', () => openModal('Your turn to spell.', `<ol class="help-steps"><li><strong>Listen.</strong> Tap the speaker to hear the word. Replay it freely or choose Slower.</li><li><strong>Spell.</strong> Use the letter keys or your own keyboard. American English spelling is used.</li><li><strong>Check.</strong> Press Enter or Check spelling. See the answer, then move to the next word.</li></ol><h3>Four ways to play</h3><p><strong>Practice:</strong> 10 untimed words. Turn on the three-second word preview to learn before you spell.</p><p><strong>Challenge:</strong> Choose Kids, Beginner, Rising, or Expert. Each track has its own word count, timer, chances, and passing goal.</p><p><strong>Game Show:</strong> 10 words and 3 chances. A miss, skip, or timeout uses one chance.</p><p><strong>Competition:</strong> 2–4 players take turns on the same device, with 5 words each. The highest score wins; equal scores share the win.</p><h3>Levels, points & clues</h3><p>Everyday: 100 points and 60 seconds. Challenger: 150 points and 45 seconds. Wordsmith: 200 points and 30 seconds. Challenge tracks set their own timing and points. Timed modes add up to 50 points for a quick answer. Definitions, sentence clues, and replays are free.</p><h3>Themes</h3><p>Kids, Student, and Adult themes change the appearance only. Your words, rules, and score stay the same.</p><p>A hidden tab pauses your game. You can also use Pause. Voice playback uses the English voices available on your device.</p><p class="muted">120 curated words with original clues. Inspired by <a href="https://www.iplay.com/en/games/merriam-websters-spell-jam/" target="_blank" rel="noopener noreferrer">Merriam-Webster’s Spell-Jam</a>; this is an independent game.</p><div class="modal-actions"><button class="primary-button" data-action="close-modal">Got it ${icon('check')}</button></div>`));
function themeChoices() {
  return `<div class="theme-grid">${Object.entries(THEMES).map(([key, item]) => `<button class="theme-choice ${key === theme ? 'selected' : ''}" data-theme-choice="${key}" aria-pressed="${key === theme}"><span class="theme-preview theme-preview-${key}" aria-hidden="true"><i></i><i></i><i></i></span><span><strong>${item.label}</strong><small>${item.note}</small></span>${key === theme ? `<span class="theme-check">${icon('check')}</span>` : ''}</button>`).join('')}</div><p class="muted theme-note">Themes change the look of the game. They do not change vocabulary, difficulty, or scoring.</p><div class="modal-actions"><button class="primary-button" data-action="close-modal">Done ${icon('check')}</button></div>`;
}
$('#theme-button').addEventListener('click', () => openModal('Choose your theme', themeChoices()));
function voiceOptions() {
  const voices = synth?.getVoices().filter(v => /^en(?:-|_)/i.test(v.lang) || v.lang === 'en') || [];
  return `<option value="">Automatic · US English</option>${voices.map(v => `<option value="${esc(v.voiceURI)}" ${v.voiceURI === selectedVoice ? 'selected' : ''}>${esc(v.name)} (${esc(v.lang)})</option>`).join('')}`;
}
$('#voice-button').addEventListener('click', () => openModal('Voice & accessibility', `<label for="voice-select">Pronunciation voice</label><select class="voice-select" id="voice-select">${voiceOptions()}</select><button class="secondary-button" data-action="test-voice">${icon('volume')} Test voice</button><label class="setting-row" for="sound-effects"><span>Answer sound effects</span><input type="checkbox" id="sound-effects" ${effects ? 'checked' : ''}></label><label class="setting-row" for="large-text"><span>Larger text</span><input type="checkbox" id="large-text" ${largeText ? 'checked' : ''}></label><label class="setting-row" for="reduced-motion"><span>Reduce animation</span><input type="checkbox" id="reduced-motion" ${reducedMotion ? 'checked' : ''}></label><p class="muted">Choose an English voice installed on your device. Offline pronunciation depends on voices installed by the device. Word pronunciation stays on when effects are off.</p><div class="modal-actions"><button class="primary-button" data-action="close-modal">Done ${icon('check')}</button></div>`));
synth?.addEventListener?.('voiceschanged', () => { if ($('#voice-select')) $('#voice-select').innerHTML = voiceOptions(); });

function profileManagerHtml() {
  const profile = activeProfile();
  const locked = ['playing', 'feedback'].includes(game.phase);
  return `<label for="profile-select">Active learner</label><select class="voice-select" id="profile-select" ${locked ? 'disabled' : ''}>${learnerStore.profiles.map(item => `<option value="${esc(item.id)}" ${item.id === profile.id ? 'selected' : ''}>${esc(item.name)}</option>`).join('')}</select><label for="profile-name">Learner name</label><input class="profile-input" id="profile-name" maxlength="24" value="${esc(profile.name)}" ${locked ? 'disabled' : ''}><label for="profile-path">Vocabulary path</label><select class="voice-select" id="profile-path" ${locked ? 'disabled' : ''}>${Object.entries(WORD_PATHS).map(([key, item]) => `<option value="${key}" ${key === profile.path ? 'selected' : ''}>${esc(item.label)} — ${esc(item.note)}</option>`).join('')}</select><p class="path-explainer">The vocabulary path chooses the words. The visual theme and timer level remain separate.</p>${locked ? '<p class="modal-warning">Finish or end the current round before switching learners.</p>' : ''}<p class="muted">Progress stays on this device. Up to 8 learner profiles are supported.</p><div class="modal-actions profile-actions"><button class="secondary-button" data-action="new-profile" ${locked || learnerStore.profiles.length >= 8 ? 'disabled' : ''}>New learner</button><button class="secondary-button danger-button" data-action="delete-profile" ${locked || learnerStore.profiles.length === 1 ? 'disabled' : ''}>${icon('trash')} Delete</button><button class="primary-button" data-action="save-profile" ${locked ? 'disabled' : ''}>Save learner ${icon('check')}</button></div>`;
}
function openLearnerManager() { openModal('Learners & word paths', profileManagerHtml()); }
function rerenderLearnerManager() { $('#modal-title').textContent = 'Learners & word paths'; $('#modal-content').innerHTML = profileManagerHtml(); }

function profileMetrics(profile = activeProfile()) {
  const records = Object.entries(profile.mastery || {});
  const totals = records.reduce((out, [, record]) => {
    out.attempts += record.attempts || 0;
    out.correct += record.correct || 0;
    out.recovered += record.recovered || 0;
    out.totalMs += record.totalMs || 0;
    return out;
  }, { attempts: 0, correct: 0, recovered: 0, totalMs: 0 });
  const states = records.map(([word, record]) => ({ word, record, state: masteryState(record) }));
  return {
    ...totals,
    accuracy: totals.attempts ? Math.round(totals.correct / totals.attempts * 100) : 0,
    averageSeconds: totals.attempts ? Math.round(totals.totalMs / totals.attempts / 100) / 10 : 0,
    mastered: states.filter(item => item.state === 'mastered').length,
    due: states.filter(item => item.state === 'due').length,
    weak: states.filter(item => item.state === 'needs practice').sort((a, b) => (a.record.correct / a.record.attempts) - (b.record.correct / b.record.attempts)),
    states
  };
}
function formatDate(value) {
  if (!value) return '—';
  try { return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value)); } catch { return new Date(value).toLocaleDateString(); }
}
function reportHtml() {
  const profile = activeProfile(), metrics = profileMetrics(profile);
  const weakRows = metrics.weak.slice(0, 8);
  const sessions = [...profile.sessions].reverse().slice(0, 6);
  const locked = ['playing', 'feedback'].includes(game.phase);
  return `<div class="report-head"><div><span class="eyebrow">${esc(WORD_PATHS[profile.path].label)}</span><h3>${esc(profile.name)}’s progress</h3></div><span>${profile.customWords.length} custom word${profile.customWords.length === 1 ? '' : 's'}</span></div><div class="report-summary"><div><strong>${metrics.accuracy}%</strong><span>First-try accuracy</span></div><div><strong>${metrics.mastered}</strong><span>Mastered</span></div><div><strong>${metrics.due}</strong><span>Due now</span></div><div><strong>${metrics.averageSeconds}s</strong><span>Avg. response</span></div></div><h3>Words needing practice</h3>${weakRows.length ? `<div class="report-table">${weakRows.map(item => `<div><strong>${esc(item.word)}</strong><span>${item.record.correct}/${item.record.attempts} first-try correct</span><em>Last try: ${esc(item.record.lastTyped || '—')}</em></div>`).join('')}</div>` : '<p class="empty-report">No weak words yet. Complete a round to build the review queue.</p>'}<h3>Recent rounds</h3>${sessions.length ? `<div class="session-list">${sessions.map(item => `<div><span><strong>${esc(modeInfo[item.mode]?.[0] || item.mode)}</strong><small>${formatDate(item.date)} · ${esc(WORD_PATHS[item.path]?.label || item.path)}</small></span><b>${item.firstTryCorrect ?? item.correct ?? 0}/${item.total}</b><em>${item.score} pts</em></div>`).join('')}</div>` : '<p class="empty-report">No completed rounds yet.</p>'}<h3>Weekly/custom word list</h3><p>Import a CSV with columns <code>word, definition, sentence, part</code>. Imported words join this learner’s adaptive review.</p><input class="file-input" id="word-csv" type="file" accept=".csv,text/csv" ${locked ? 'disabled' : ''}>${locked ? '<p class="modal-warning">Finish or end the current round before changing the custom list.</p>' : ''}<div class="report-actions"><button class="secondary-button" data-action="export-csv">${icon('download')} Progress CSV</button><button class="secondary-button" data-action="print-report">${icon('printer')} Print / Save PDF</button><button class="secondary-button" data-action="clear-custom" ${profile.customWords.length && !locked ? '' : 'disabled'}>${icon('trash')} Clear custom words</button></div><p class="muted">For real learner testing, compare first-try accuracy and response time across sessions, and note where a child asks for help.</p><div class="modal-actions"><button class="primary-button" data-action="close-modal">Done ${icon('check')}</button></div>`;
}
function openProgressReport() { openModal('Progress & reports', reportHtml()); }
function csvCell(value) { const text = String(value ?? ''); return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text; }
function downloadBlob(name, blob) {
  const href = URL.createObjectURL(blob), link = document.createElement('a');
  link.href = href; link.download = name; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(href), 1000);
}
function exportProgressCsv() {
  const profile = activeProfile(), metrics = profileMetrics(profile);
  const rows = [['word','path','status','attempts','first_try_correct','first_try_accuracy','second_try_recoveries','last_spelling','average_response_seconds','last_seen']];
  for (const item of metrics.states.sort((a, b) => a.word.localeCompare(b.word))) {
    const record = item.record;
    rows.push([item.word, profile.path, item.state, record.attempts, record.correct, Math.round(record.correct / record.attempts * 100), record.recovered || 0, record.lastTyped || '', Math.round((record.totalMs || 0) / record.attempts / 100) / 10, record.lastSeen ? new Date(record.lastSeen).toISOString() : '']);
  }
  downloadBlob(`${profile.name.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'learner'}-spellstage-progress.csv`, new Blob([rows.map(row => row.map(csvCell).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' }));
  announce('Progress CSV downloaded.');
}
function printableReport() {
  const profile = activeProfile(), metrics = profileMetrics(profile);
  const weak = metrics.weak.slice(0, 20);
  const rounds = [...profile.sessions].reverse().slice(0, 10);
  const page = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(profile.name)} — Spellstage progress</title><style>body{font:15px/1.55 Arial,sans-serif;color:#222;max-width:850px;margin:40px auto;padding:0 24px}h1{margin-bottom:4px;color:#4030a5}h2{margin-top:28px;border-bottom:1px solid #ddd;padding-bottom:6px}.meta{color:#666}.cards{display:flex;gap:12px;margin:24px 0}.cards div{border:1px solid #ddd;border-radius:10px;padding:14px;flex:1}.cards b{font-size:24px;display:block}.cards span{color:#666;font-size:12px}table{width:100%;border-collapse:collapse}th,td{text-align:left;border-bottom:1px solid #ddd;padding:8px}footer{margin-top:35px;color:#777;font-size:12px}@media print{body{margin:0}.no-print{display:none}}</style></head><body><button class="no-print" onclick="window.print()">Print / Save PDF</button><h1>${esc(profile.name)}’s spelling progress</h1><p class="meta">${esc(WORD_PATHS[profile.path].label)} · Generated ${esc(formatDate(Date.now()))}</p><div class="cards"><div><b>${metrics.accuracy}%</b><span>First-try accuracy</span></div><div><b>${metrics.mastered}</b><span>Words mastered</span></div><div><b>${metrics.due}</b><span>Due now</span></div><div><b>${metrics.averageSeconds}s</b><span>Average response</span></div></div><h2>Words needing practice</h2>${weak.length ? `<table><thead><tr><th>Word</th><th>First try</th><th>Last spelling</th></tr></thead><tbody>${weak.map(item => `<tr><td>${esc(item.word)}</td><td>${item.record.correct}/${item.record.attempts}</td><td>${esc(item.record.lastTyped || '—')}</td></tr>`).join('')}</tbody></table>` : '<p>No weak words recorded yet.</p>'}<h2>Recent rounds</h2>${rounds.length ? `<table><thead><tr><th>Date</th><th>Mode</th><th>First try</th><th>Score</th></tr></thead><tbody>${rounds.map(item => `<tr><td>${esc(formatDate(item.date))}</td><td>${esc(modeInfo[item.mode]?.[0] || item.mode)}</td><td>${item.firstTryCorrect ?? item.correct ?? 0}/${item.total}</td><td>${item.score}</td></tr>`).join('')}</tbody></table>` : '<p>No completed rounds yet.</p>'}<footer>Spellstage learner report · Progress is stored only on the learner’s device.</footer></body></html>`;
  const popup = window.open('', '_blank');
  if (!popup) { announce('Allow pop-ups to open the printable report.'); return; }
  popup.document.open(); popup.document.write(page); popup.document.close(); popup.focus(); setTimeout(() => popup.print(), 250);
}
function parseCsv(text) {
  const rows = []; let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) { if (char === '"' && text[i + 1] === '"') { field += '"'; i++; } else if (char === '"') quoted = false; else field += char; }
    else if (char === '"') quoted = true;
    else if (char === ',') { row.push(field.trim()); field = ''; }
    else if (char === '\n') { row.push(field.trim()); if (row.some(Boolean)) rows.push(row); row = []; field = ''; }
    else if (char !== '\r') field += char;
  }
  row.push(field.trim()); if (row.some(Boolean)) rows.push(row);
  return rows;
}
async function importWordCsv(file) {
  if (!file || file.size > 1000000) { announce('Choose a CSV file smaller than 1 MB.'); return; }
  const rows = parseCsv(await file.text());
  if (rows.length < 2) { announce('The CSV needs a header and at least one word.'); return; }
  const headers = rows.shift().map(value => value.trim().toLowerCase().replace(/\s+/g, '_'));
  const indexes = Object.fromEntries(headers.map((key, index) => [key, index]));
  if (indexes.word === undefined || indexes.definition === undefined) { announce('The CSV must include word and definition columns.'); return; }
  const imported = [], rejected = [];
  for (const row of rows.slice(0, 250)) {
    const word = String(row[indexes.word] || '').trim().toLowerCase();
    const definition = String(row[indexes.definition] || '').trim().slice(0, 240);
    if (!/^[a-z]{2,25}$/.test(word) || !definition) { rejected.push(word || '(blank)'); continue; }
    let sentence = String(row[indexes.sentence] || '').trim().slice(0, 240);
    sentence = sentence ? sentence.replace(new RegExp(`\\b${word}\\b`, 'gi'), '{word}') : `Please spell the word {word}.`;
    imported.push({ word, definition, sentence, part: String(row[indexes.part] || 'word').trim().slice(0, 32) || 'word', level: 'custom', path: activeProfile().path, custom: true });
  }
  const unique = new Map(activeProfile().customWords.map(item => [item.word, item]));
  for (const item of imported) unique.set(item.word, item);
  activeProfile().customWords = [...unique.values()].slice(-200);
  saveStore(); resetGame();
  $('#modal-content').innerHTML = reportHtml();
  announce(`${imported.length} custom words imported${rejected.length ? `; ${rejected.length} rows skipped` : ''}.`);
}

$('#learner-button').addEventListener('click', openLearnerManager);
$('#sidebar-learner-button').addEventListener('click', openLearnerManager);
$('#progress-button').addEventListener('click', openProgressReport);
$('#help-button').addEventListener('click', () => {
  $('#modal-content .modal-actions')?.insertAdjacentHTML('beforebegin', `<h3>Learners & adaptive review</h3><p>Create a learner profile and choose a vocabulary path independently from the timer level and visual theme. The next round revisits words that need practice, mixes in due words, and adds new ones.</p><p>An incorrect first spelling gets one guided second try. The final screen compares letters and gives a short spelling note. Progress records first-try accuracy so the report stays honest.</p><h3>Reports, custom lists & installation</h3><p>Open <strong>Progress</strong> to import a class or weekly CSV list, download progress data, or print a report to PDF. Use <strong>Install app</strong> at the bottom of the page for home-screen access and cached offline play.</p>`);
});

$('#keyboard').innerHTML = ['QWERTYUIOP','ASDFGHJKL','ZXCVBNM'].map((row,i) => `<div class="keyboard-row">${i === 2 ? '<button class="key wide enter" data-key="ENTER" aria-label="Check spelling">ENTER</button>' : ''}${[...row].map(letter => `<button class="key" data-key="${letter}" aria-label="${letter}">${letter}</button>`).join('')}${i === 2 ? `<button class="key wide" data-key="BACKSPACE" aria-label="Delete a letter">${icon('backspace')}</button>` : ''}</div>`).join('');
$('#keyboard').addEventListener('pointerdown', event => { if (event.target.closest('[data-key]') && event.pointerType === 'mouse') event.preventDefault(); });
document.addEventListener('submit', event => { if (event.target.id === 'answer-form') { event.preventDefault(); submitAnswer(); } });
document.addEventListener('input', event => {
  if (event.target.id === 'answer') { const input = event.target; const caret = input.selectionStart; typed = input.value.replace(/[^a-z]/gi,'').toLowerCase().slice(0,25); if (input.value !== typed) { input.value = typed; input.setSelectionRange(Math.min(caret, typed.length), Math.min(caret, typed.length)); } input.classList.toggle('long-answer',typed.length > 12); $('#answer-notice').hidden = true; }
  if (event.target.matches('.player-name')) playerNames[Number(event.target.dataset.player)] = event.target.value;
});
document.addEventListener('change', event => {
  const target = event.target;
  if (target.name === 'level' && !['playing','feedback'].includes(game.phase)) { level = target.value; resetGame(); }
  if (target.id === 'learning-toggle') flashLearning = target.checked;
  if (target.name === 'challenge-track' && !['playing','feedback'].includes(game.phase)) { challengeTrack = target.value; savePreferences(); resetGame(); }
  if (target.id === 'player-count') { playerCount = Number(target.value); renderOptions(); renderStage(); }
  if (target.id === 'voice-select') { selectedVoice = target.value; savePreferences(); }
  if (target.id === 'sound-effects') { effects = target.checked; savePreferences(); if (effects) unlockEffects(); }
  if (target.id === 'large-text') { largeText = target.checked; applyAccessibility(); savePreferences(); }
  if (target.id === 'reduced-motion') { reducedMotion = target.checked; applyAccessibility(); savePreferences(); }
  if (target.id === 'profile-select' && !['playing','feedback'].includes(game.phase) && learnerStore.profiles.some(profile => profile.id === target.value)) { learnerStore.activeProfileId = target.value; saveStore(); resetGame(); rerenderLearnerManager(); announce(`${activeProfile().name} is now the active learner.`); }
  if (target.id === 'word-csv') void importWordCsv(target.files?.[0]);
});
document.addEventListener('click', event => {
  const button = event.target.closest('button'); if (!button || button.disabled) return;
  if (button.dataset.key) { insertKey(button.dataset.key); return; }
  if (button.dataset.themeChoice) { applyTheme(button.dataset.themeChoice); $('#modal-content').innerHTML = themeChoices(); announce(`${THEMES[theme].label} theme selected.`); return; }
  if (button.dataset.mode) { if (['playing','feedback'].includes(game.phase)) return; mode = button.dataset.mode; resetGame(); return; }
  const action = button.dataset.action;
  if (!action) return;
  if (action === 'start') startGame();
  else if (action === 'sample' || action === 'test-voice') speak('Welcome to Spellstage. Listen closely, and spell the word.');
  else if (action === 'hear' || action === 'slow') { if (game.phase === 'playing' && !game.paused && !handoff) speak(game.word.word, action === 'slow', true); }
  else if (action === 'hear-result') { const r = game.history.at(-1); speak(`${r.word}. ${r.word.split('').join(', ')}. ${r.word}.`); }
  else if (action === 'definition' || action === 'sentence') { if (game.hint(action)) { clue = clue === action ? null : action; renderStage(); focusAnswer(); if (clue) announce(clue === 'definition' ? game.word.definition : game.word.sentence.replace('{word}','blank')); } }
  else if (action === 'skip') { if (game.phase === 'playing' && !flash && !handoff) showFeedback(game.submit('',Date.now(),'skip')); }
  else if (action === 'next') { stopSpeech(); if (game.next()) { if (game.phase === 'finished') { recordSession(); render(); announce('Game complete. Review your results.'); $('#game').focus({preventScroll:true}); } else prepareWord(); } }
  else if (action === 'take-turn') { if (handoff && game.phase === 'playing') { handoff = false; game.resume(); wordStartedAt = Date.now(); renderStage(); speak(game.word.word,false,true); focusAnswer(); } }
  else if (action === 'resume') resumeGame();
  else if (action === 'end') openModal('End this game?', '<p>Your current round will end. You can choose any mode and start a fresh game.</p><div class="modal-actions"><button class="secondary-button" data-action="close-modal">Keep playing</button><button class="primary-button" data-action="confirm-end">End game</button></div>');
  else if (action === 'confirm-end') { closeModal(); resetGame(); }
  else if (action === 'new-profile' && !['playing','feedback'].includes(game.phase) && learnerStore.profiles.length < 8) { const profile = newProfile(`Learner ${learnerStore.profiles.length + 1}`, activeProfile().path); learnerStore.profiles.push(profile); learnerStore.activeProfileId = profile.id; saveStore(); resetGame(); rerenderLearnerManager(); $('#profile-name')?.focus(); announce('New learner profile created.'); }
  else if (action === 'save-profile' && !['playing','feedback'].includes(game.phase)) { const profile = activeProfile(); profile.name = ($('#profile-name')?.value || 'Learner').trim().replace(/\s+/g, ' ').slice(0, 24) || 'Learner'; const path = $('#profile-path')?.value; if (Object.hasOwn(WORD_PATHS, path)) profile.path = path; saveStore(); resetGame(); rerenderLearnerManager(); announce(`${profile.name} was saved.`); }
  else if (action === 'delete-profile' && !['playing','feedback'].includes(game.phase) && learnerStore.profiles.length > 1) { const profile = activeProfile(); if (window.confirm(`Delete ${profile.name} and all saved progress on this device?`)) { learnerStore.profiles = learnerStore.profiles.filter(item => item.id !== profile.id); learnerStore.activeProfileId = learnerStore.profiles[0].id; saveStore(); resetGame(); rerenderLearnerManager(); announce('Learner profile deleted.'); } }
  else if (action === 'export-csv') exportProgressCsv();
  else if (action === 'print-report') printableReport();
  else if (action === 'clear-custom' && !['playing','feedback'].includes(game.phase)) { if (window.confirm(`Remove all custom words for ${activeProfile().name}? Saved progress will remain.`)) { activeProfile().customWords = []; saveStore(); resetGame(); $('#modal-content').innerHTML = reportHtml(); announce('Custom word list cleared.'); } }
  else if (action === 'reset') resetGame();
  else if (action === 'close-modal') closeModal();
});
$('#pause-button').addEventListener('click', pauseGame);
document.addEventListener('keydown', event => {
  if ($('#modal').open || event.ctrlKey || event.metaKey || event.altKey) return;
  const target = event.target;
  if (['INPUT','SELECT','TEXTAREA'].includes(target.tagName) && target.id !== 'answer') return;
  if (game.phase !== 'playing' || game.paused || flash || handoff) return;
  if (event.key === 'Escape') { event.preventDefault(); pauseGame(); return; }
  if (event.key === ' ' && (target.id === 'answer' || target === document.body)) { event.preventDefault(); speak(game.word.word,false,true); return; }
  if (target.id === 'answer') return;
  if (/^[a-z]$/i.test(event.key) || event.key === 'Backspace') { event.preventDefault(); insertKey(event.key === 'Backspace' ? 'BACKSPACE' : event.key); }
  else if (event.key === 'Enter' && target.tagName !== 'BUTTON') { event.preventDefault(); submitAnswer(); }
});
document.addEventListener('visibilitychange', () => { if (document.hidden) { pauseGame(); stopSpeech(); } });
const ticker = setInterval(() => {
  if (game.phase !== 'playing' || game.paused || handoff || !game.timed) return;
  const result = game.tick();
  if (result) { showFeedback(result); return; }
  const seconds = game.remaining();
  if ($('#time-left')) $('#time-left').textContent = `${seconds}s`;
  $('.timer')?.classList.toggle('urgent',seconds <= 10);
}, 200);

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault(); installPrompt = event;
  $('#install-button').classList.add('install-ready');
});
window.addEventListener('appinstalled', () => { installPrompt = null; $('#install-button').hidden = true; announce('Spellstage installed.'); });
$('#install-button').addEventListener('click', async () => {
  if (installPrompt) {
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    return;
  }
  const apple = /iphone|ipad|ipod/i.test(navigator.userAgent);
  openModal('Install Spellstage', apple ? `<p>In Safari, tap the <strong>Share</strong> button, then choose <strong>Add to Home Screen</strong>.</p><p class="muted">The game interface and word lists work offline after the first visit. Spoken pronunciation offline depends on voices installed on your device.</p><div class="modal-actions"><button class="primary-button" data-action="close-modal">Got it ${icon('check')}</button></div>` : `<p>Open this page in Chrome or Edge, then use the browser’s <strong>Install app</strong> option in the address bar or menu.</p><p class="muted">If Spellstage is already installed, no install prompt will appear. The game interface and word lists work offline after the first visit; offline speech depends on device voices.</p><div class="modal-actions"><button class="primary-button" data-action="close-modal">Got it ${icon('check')}</button></div>`);
});
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}

// Register the same game actions for browsers with WebMCP support.
const lifecycle = new AbortController();
const context = document.modelContext;
if (context?.registerTool) {
  const register = tool => { try { void Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(() => {}); } catch {} };
  register({name:'get_spelling_game_state',title:'Read spelling game',description:'Read the current game, score, player and timer. The hidden answer is not returned during play.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute:() => game.snapshot()});
  register({name:'start_spelling_game',title:'Start spelling game',description:'Start a new Practice, Challenge, Game Show, or Competition game from the ready or results screen.',inputSchema:{type:'object',properties:{mode:{type:'string',enum:['practice','challenge','show','competition']},level:{type:'string',enum:['easy','medium','hard']},challengeTrack:{type:'string',enum:['kids','beginner','rising','expert']}},required:['mode'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:input => { if (!input || !Object.hasOwn(modeInfo,input.mode) || (input.level !== undefined && !Object.hasOwn(LEVELS,input.level)) || (input.challengeTrack !== undefined && !Object.hasOwn(CHALLENGES,input.challengeTrack))) throw new Error('Invalid game mode, level, or challenge track.'); if (['playing','feedback'].includes(game.phase) || $('#modal').open) throw new Error('Finish or end the current game and close dialogs first.'); mode=input.mode;if(input.level)level=input.level;if(input.challengeTrack){challengeTrack=input.challengeTrack;savePreferences();}startGame();return game.snapshot(); }});
  register({name:'set_spelling_theme',title:'Set spelling theme',description:'Apply the Kids, Student, or Adult appearance without changing game rules or score.',inputSchema:{type:'object',properties:{theme:{type:'string',enum:['kids','student','adult']}},required:['theme'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:input => { if (!input || !Object.hasOwn(THEMES,input.theme)) throw new Error('Choose kids, student, or adult.'); applyTheme(input.theme); return {theme,label:THEMES[theme].label}; }});
  register({name:'submit_spelling_answer',title:'Submit spelling answer',description:'Check a spelling in the active, unpaused word. This completes the current turn and displays feedback.',inputSchema:{type:'object',properties:{answer:{type:'string',minLength:1,maxLength:25,pattern:'^[a-zA-Z]+$'}},required:['answer'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:input => { if (typeof input?.answer !== 'string' || !/^[a-z]{1,25}$/i.test(input.answer)) throw new Error('Supply a spelling using English letters.'); if (game.phase !== 'playing' || game.paused || flash || handoff || $('#modal').open) throw new Error('There is no active word ready for an answer.'); typed=input.answer.toLowerCase();const result=submitAnswer();return {result,state:game.snapshot()}; }});
}
window.addEventListener('pagehide', event => { stopSpeech(); if (!event.persisted) { clearInterval(ticker); clearTimeout(flashTimer); lifecycle.abort(); } });
render();
