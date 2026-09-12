export const LEVELS = {
  easy: { label: 'Everyday', seconds: 60, points: 100 },
  medium: { label: 'Challenger', seconds: 45, points: 150 },
  hard: { label: 'Wordsmith', seconds: 30, points: 200 }
};

export const CHALLENGES = {
  kids: { label: 'Kids', path: 'kids', level: 'easy', total: 8, seconds: 75, points: 75, lives: 4, target: 5 },
  beginner: { label: 'Beginner', path: 'beginner', level: 'easy', total: 10, seconds: 60, points: 100, lives: 4, target: 7 },
  rising: { label: 'Rising', path: 'student', level: 'medium', total: 12, seconds: 45, points: 150, lives: 3, target: 9 },
  expert: { label: 'Expert', path: 'adult', level: 'hard', total: 15, seconds: 30, points: 200, lives: 3, target: 12 }
};

export function shuffled(items, random = Math.random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function adaptiveDeck(items, total, progress = {}, random = Math.random, now = Date.now()) {
  const mixed = shuffled(items, random);
  const buckets = { weak: [], due: [], fresh: [], strong: [] };
  for (const item of mixed) {
    const record = progress[item.word];
    if (!record?.attempts) buckets.fresh.push(item);
    else if (record.lastCorrect === false || record.correct / record.attempts < 0.75) buckets.weak.push(item);
    else if ((record.nextDue || 0) <= now) buckets.due.push(item);
    else buckets.strong.push(item);
  }
  for (const bucket of Object.values(buckets)) bucket.sort((a, b) => Number(Boolean(b.custom)) - Number(Boolean(a.custom)));
  const selected = [];
  const take = (bucket, count) => {
    while (bucket.length && count-- > 0 && selected.length < total) selected.push(bucket.shift());
  };
  take(buckets.weak, Math.ceil(total * 0.5));
  take(buckets.due, Math.ceil(total * 0.3));
  take(buckets.fresh, total - selected.length);
  for (const bucket of [buckets.weak, buckets.due, buckets.fresh, buckets.strong]) take(bucket, total - selected.length);
  return shuffled(selected, random);
}

export class SpellingGame {
  constructor(words, random = Math.random) {
    this.bank = words;
    this.random = random;
    this.phase = 'ready';
    this.paused = false;
  }
  start({ mode = 'show', level = 'medium', challenge = 'kids', path = 'beginner', progress = {}, players = ['Player 1', 'Player 2'] } = {}, now = Date.now()) {
    if (!['practice', 'show', 'competition', 'challenge'].includes(mode) || !Object.hasOwn(LEVELS, level)) throw new Error('Choose a valid mode and level.');
    if (mode === 'challenge' && !Object.hasOwn(CHALLENGES, challenge)) throw new Error('Choose a valid challenge track.');
    if (mode === 'competition' && (!Array.isArray(players) || players.length < 2 || players.length > 4 || players.some(p => typeof p !== 'string' || !p.trim()))) throw new Error('Enter two to four player names.');
    this.mode = mode;
    this.challengeTrack = mode === 'challenge' ? challenge : null;
    this.challenge = this.challengeTrack ? CHALLENGES[this.challengeTrack] : null;
    this.level = this.challenge?.level || level;
    this.path = this.challenge?.path || path;
    this.players = (mode === 'competition' ? players : ['You']).map((name, i) => ({ name: name.trim().slice(0, 24), score: 0, correct: 0, id: i }));
    this.total = mode === 'competition' ? this.players.length * 5 : this.challenge?.total || 10;
    this.secondsPerWord = this.challenge?.seconds || LEVELS[this.level].seconds;
    this.basePoints = this.challenge?.points || LEVELS[this.level].points;
    this.deck = adaptiveDeck(this.bank.filter(w => w.path === this.path), this.total, progress, this.random, now);
    if (this.deck.length < this.total) throw new Error('Not enough words for this round.');
    this.index = 0;
    this.history = [];
    this.lives = this.challenge?.lives || 3;
    this.streak = 0;
    this.bestStreak = 0;
    this.paused = false;
    this.beginWord(now);
  }
  get word() { return this.deck?.[this.index]; }
  get playerIndex() { return this.mode === 'competition' ? this.index % this.players.length : 0; }
  get player() { return this.players?.[this.playerIndex]; }
  get score() { return this.players?.reduce((sum, player) => sum + player.score, 0) || 0; }
  get timed() { return this.mode !== 'practice'; }
  get correct() { return this.history?.filter(result => result.correct).length || 0; }
  get target() { return this.challenge?.target || null; }
  get challengePassed() { return this.mode === 'challenge' && this.correct >= this.target; }
  beginWord(now) {
    this.phase = 'playing';
    this.deadline = now + this.secondsPerWord * 1000;
    this.pauseAt = null;
    this.paused = false;
    this.hints = [];
  }
  remaining(now = Date.now()) {
    if (!this.timed) return Infinity;
    return Math.max(0, Math.ceil((this.deadline - (this.paused ? this.pauseAt : now)) / 1000));
  }
  hint(kind) {
    if (this.phase !== 'playing' || this.paused || !['definition', 'sentence'].includes(kind)) return false;
    if (!this.hints.includes(kind)) this.hints.push(kind);
    return true;
  }
  submit(answer, now = Date.now(), reason = 'answer') {
    if (this.phase !== 'playing' || this.paused) return null;
    if (reason === 'answer' && !String(answer).trim()) return null;
    const seconds = this.remaining(now);
    const timedOut = this.timed && seconds === 0;
    const typed = String(answer).trim().toLowerCase();
    const correct = reason === 'answer' && !timedOut && typed === this.word.word;
    const bonus = correct && this.timed ? Math.ceil(50 * seconds / this.secondsPerWord) : 0;
    const points = correct ? this.basePoints + bonus : 0;
    const player = this.player;
    player.score += points;
    player.correct += Number(correct);
    this.streak = correct ? this.streak + 1 : 0;
    this.bestStreak = Math.max(this.bestStreak, this.streak);
    if (!correct && ['show', 'challenge'].includes(this.mode)) this.lives--;
    const result = { ...this.word, typed, correct, points, bonus, player: player.name, playerId: player.id, reason: timedOut ? 'timeout' : reason, hints: [...this.hints] };
    this.history.push(result);
    this.phase = 'feedback';
    return result;
  }
  tick(now = Date.now()) {
    return this.phase === 'playing' && !this.paused && this.timed && this.remaining(now) === 0 ? this.submit('', now, 'timeout') : null;
  }
  next(now = Date.now()) {
    if (this.phase !== 'feedback') return false;
    if (this.index + 1 >= this.total || (['show', 'challenge'].includes(this.mode) && this.lives <= 0)) {
      this.phase = 'finished';
    } else {
      this.index++;
      this.beginWord(now);
    }
    return true;
  }
  pause(now = Date.now()) {
    if (this.phase !== 'playing' || this.paused) return false;
    const timeout = this.tick(now);
    if (timeout) return false;
    this.paused = true;
    this.pauseAt = now;
    return true;
  }
  resume(now = Date.now()) {
    if (!this.paused) return false;
    this.deadline += now - this.pauseAt;
    this.paused = false;
    this.pauseAt = null;
    return true;
  }
  snapshot(now = Date.now()) {
    return { phase: this.phase, mode: this.mode, level: this.level, path: this.path, challengeTrack: this.challengeTrack, wordNumber: this.index == null ? 0 : this.index + 1, total: this.total || 0, score: this.score, correct: this.correct, target: this.target, challengePassed: this.mode === 'challenge' && this.phase === 'finished' ? this.challengePassed : undefined, lives: this.lives, paused: this.paused, seconds: this.phase === 'playing' && this.timed ? this.remaining(now) : null, currentPlayer: this.player?.name, players: this.players?.map(p => ({ ...p })), clue: this.phase === 'playing' && this.hints.includes('definition') ? this.word.definition : undefined, lastResult: ['feedback', 'finished'].includes(this.phase) ? this.history.at(-1) : undefined };
  }
}
