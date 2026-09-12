import assert from 'node:assert/strict';
import { adaptiveDeck, CHALLENGES, SpellingGame } from '../dist/game.mjs';
import { WORDS, WORD_PATHS } from '../dist/words.mjs';

assert.equal(WORDS.length, 120);
assert.equal(new Set(WORDS.map(item => item.word)).size, 120);
for (const path of Object.keys(WORD_PATHS)) {
  assert.equal(WORDS.filter(item => item.path === path).length, 30, `${path} path size`);
}
for (const item of WORDS) {
  assert.match(item.word, /^[a-z]+$/);
  assert.ok(item.definition.length > 5);
  assert.ok(item.sentence.includes('{word}'));
}

const weakProgress = {
  apple: { attempts: 3, correct: 0, lastCorrect: false, nextDue: 0 },
  bridge: { attempts: 3, correct: 3, lastCorrect: true, nextDue: Date.now() - 1 }
};
const adaptive = adaptiveDeck(WORDS.filter(item => item.path === 'kids'), 10, weakProgress, () => .42);
assert.equal(adaptive.length, 10);
assert.ok(adaptive.some(item => item.word === 'apple'));
assert.ok(adaptive.some(item => item.word === 'bridge'));

for (const [track, config] of Object.entries(CHALLENGES)) {
  const game = new SpellingGame(WORDS, () => .31);
  game.start({ mode: 'challenge', challenge: track });
  assert.equal(game.total, config.total);
  assert.equal(game.path, config.path);
  assert.equal(game.deck.length, config.total);
  assert.ok(game.deck.every(item => item.path === config.path));
}

const game = new SpellingGame(WORDS, () => .25);
game.start({ mode: 'show', level: 'hard', path: 'kids' }, 1000);
assert.equal(game.secondsPerWord, 30);
assert.ok(game.deck.every(item => item.path === 'kids'));
const answer = game.word.word;
const correct = game.submit(answer, 2000);
assert.equal(correct.correct, true);
assert.ok(correct.points >= 200);
assert.equal(game.phase, 'feedback');
assert.equal(game.submit(answer, 2000), null);
assert.equal(game.next(2000), true);
const missed = game.submit('wrong', 2500);
assert.equal(missed.correct, false);
assert.equal(game.lives, 2);

const practice = new SpellingGame(WORDS, () => .5);
practice.start({ mode: 'practice', level: 'easy', path: 'beginner' }, 1000);
assert.equal(practice.timed, false);
assert.equal(practice.remaining(999999), Infinity);
assert.equal(practice.pause(2000), true);
assert.equal(practice.resume(5000), true);

console.log('Spellstage engine tests passed.');
