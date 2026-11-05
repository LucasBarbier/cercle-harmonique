// Tests du moteur harmonique et du générateur d'études (sans navigateur).
// Lancer : npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const ctx = { window: {} };
vm.createContext(ctx);
for (const f of ['www/js/harmony.js', 'www/js/etude.js', 'www/js/accomp.js']) {
  vm.runInContext(readFileSync(new URL('../' + f, import.meta.url), 'utf8'), ctx, { filename: f });
}
const { HT, ET, AC } = ctx.window;
const mod12 = n => ((n % 12) + 12) % 12;

const load = (text, key) => {
  const sh = HT.parseSheet(text);
  const { tl, totalBeats } = HT.buildTimeline(sh, sh.meta.beats || 4);
  const k = HT.parseKey(key || sh.meta.key) || HT.detectKey(tl);
  HT.analyze(tl, k);
  return { sh, tl, totalBeats, k };
};

test('lecture des chiffrages', () => {
  const tones = s => HT.parseChord(s, false).tones.map(t => t.label).join(' ');
  assert.equal(tones('Dm7b5'), '1 ♭3 ♭5 ♭7');
  assert.equal(tones('G13b9'), '1 3 5 ♭7 ♭9 13');
  assert.equal(HT.parseChord('Ao7', false).kind, 'dim7');
  assert.equal(HT.parseChord('Rém7', true).root.L, 'D');
  assert.ok(HT.parseChord('Xyz', false).error);
});

test('analyse : II–V–I et dominantes secondaires', () => {
  const { tl } = load('| Dm7 | G7 | Cmaj7 | A7 | Dm7 G7 | Cmaj7 |', 'C');
  const lab = Array.from(tl, e => e.chord.an.label);
  assert.deepEqual(lab.slice(0, 4), ['ii7', 'V7', 'IΔ7', 'V7/ii']);
});

test('substitution tritonique', () => {
  const { tl } = load('| Dm7 Db7 | Cmaj7 |', 'C');
  assert.equal(tl[1].chord.an.role, 'subV');
});

test('détection de tonalité (Autumn Leaves)', () => {
  const { k } = load('| Cm7 | F7 | Bbmaj7 | Ebmaj7 | Am7b5 | D7 | Gm6 | % |');
  assert.deepEqual({ ...k }, { tonic: 7, mode: 'minor' });
});

test('génération : une note par division, dans le registre, notes d\'accord sur les temps forts', () => {
  const { tl, totalBeats } = load('| Dm7 | G7 | Cmaj7 | % |', 'C');
  for (const sub of [1, 2, 3]) {
    const ns = ET.generate(tl, totalBeats, 4, { sub, motif: 'wave', fill: 'mix', start: 'near', lo: 55, hi: 79, ten: false, app: false, loop: true }, 3);
    assert.equal(ns.length, totalBeats * sub);
    for (const n of ns) {
      assert.ok(n.m >= 52 && n.m <= 82, `hors registre : ${n.m}`);
      if (n.cs) assert.equal(n.role, 'ct');
    }
  }
});

test('génération : entrée sur la tierce', () => {
  const { tl, totalBeats } = load('| Dm7 | G7 | Cmaj7 |', 'C');
  const ns = ET.generate(tl, totalBeats, 4, { sub: 2, motif: 'wave', fill: 'none', start: 'third', lo: 55, hi: 79, ten: false, app: false, loop: true }, 1);
  assert.deepEqual(Array.from(ns.filter(n => n.cs), n => n.label), ['♭3', '3', '3']);
});

test('rythme : mesures complètes, anticipations, déterminisme', () => {
  const { tl, totalBeats } = load('| Dm7 | G7 | Cmaj7 | A7 | Dm7 G7 | Em7 A7 | Dm7 | G7 | Cmaj7 | % |', 'C');
  for (const rhy of ['phrase', 'sync', 'ballad']) for (const seed of [1, 2, 3, 4, 5]) {
    const o = { sub: 2, motif: 'random', fill: 'mix', start: 'near', lo: 55, hi: 81, ten: true, app: true, loop: true, rhy, slur: true, bow: true };
    const ns = ET.generate(tl, totalBeats, 4, o, seed);
    assert.equal(ns.length, totalBeats * 2);
    // chaque mesure : la somme des valeurs (notes et silences) fait 4 temps
    for (let b = 0; b < totalBeats / 4; b++) {
      const bar = ns.slice(b * 8, b * 8 + 8);
      assert.ok(!bar[0].hold, `${rhy}/${seed} : mesure ${b + 1} commence par une prolongation`);
      assert.equal(bar.filter(n => !n.hold).reduce((s, n) => s + n.dur, 0), 4, `${rhy}/${seed} : mesure ${b + 1}`);
    }
    for (let i = 0; i < ns.length; i++) {
      const n = ns[i];
      // une note tenue ne passe un changement d'accord que si elle est attaquée juste avant (anticipation)
      if (n.hold && !n.rest && n.cs) assert.ok(ns[i - 1].ant, `${rhy}/${seed} : tenue sur changement d'accord en ${i}`);
      if (n.ant) assert.equal(n.m, ns[i + 1].m);
      if (n.slS) assert.ok(!n.rest && !n.hold);
    }
    assert.deepEqual(ET.generate(tl, totalBeats, 4, o, seed), ns);
  }
});

// ---- accompagnement (accomp.js) ----

test('boucle : bornes et accord suivant restent dans la région', () => {
  const { tl, totalBeats } = load('| Dm7 | G7 | Cmaj7 | A7 | Dm7 G7 | Cmaj7 |', 'C');
  const region = { a: 1, b: 3 };
  assert.deepEqual({ ...AC.bounds(tl, totalBeats, region) }, { start: 4, end: 16 });
  assert.deepEqual({ ...AC.bounds(tl, totalBeats, null) }, { start: 0, end: totalBeats });
  assert.equal(AC.nextIdx(3, tl.length, true, region), 1);
  assert.equal(AC.prevIdx(1, tl.length, true, region), 3);
  assert.equal(AC.nextIdx(tl.length - 1, tl.length, false, null), -1);
  assert.equal(AC.nextIdx(tl.length - 1, tl.length, true, null), 0);
});

test('pompe : un coup par temps, 1 et 3 graves, 2 et 4 étouffés ; valse : 1 puis deux étouffés', () => {
  const { tl } = load('| Gm6 | Am6 D7 |', 'Gm');
  const hits = AC.compLine(tl, 4, 'guitar');
  assert.deepEqual(Array.from(hits, h => h.t), [0, 1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(Array.from(hits, h => h.kind), ['low', 'chop', 'low', 'chop', 'low', 'chop', 'low', 'chop']);
  assert.equal(hits[6].ev, 2);
  const w = load('mesure: 3/4\n| Dm7 | G7 |', 'C');
  assert.deepEqual(Array.from(AC.compLine(w.tl, 3, 'guitar'), h => h.kind), ['low', 'chop', 'chop', 'low', 'chop', 'chop']);
});

test('basse à deux temps : fondamentale sur 1, quinte sur 3', () => {
  const { tl, totalBeats } = load('| Cmaj7 | G7 |', 'C');
  const b = AC.bassLine(tl, totalBeats, 4, { style: 'two' }, 1);
  assert.deepEqual(Array.from(b, n => n.t), [0, 2, 4, 6]);
  assert.deepEqual(Array.from(b, n => mod12(n.m)), [0, 7, 7, 2]);
});

test('walking bass : une noire par temps, dans le registre, fondamentale puis approche de l\'accord suivant', () => {
  const src = '| Dm7 | G7 | Cmaj7 | A7 | Dm7 G7 | Cmaj7 | Cm/Eb | Ddim G7 |';
  const { tl, totalBeats } = load(src, 'C');
  const [lo, hi] = AC.BASS_RANGE;
  for (let seed = 1; seed <= 20; seed++) {
    const b = AC.bassLine(tl, totalBeats, 4, { style: 'walk', loop: true }, seed);
    assert.equal(b.length, totalBeats);
    b.forEach((n, k) => assert.equal(n.t, k));
    for (const n of b) assert.ok(n.m >= lo && n.m <= hi, `hors registre : ${n.m}`);
    tl.forEach((ev, i) => {
      const notes = b.filter(n => n.ev === i);
      const bassPc = (ev.chord.bass || ev.chord.root).pc;
      assert.equal(mod12(notes[0].m), bassPc, `accord ${i} : première note`);
      if (notes.length > 1) {
        const nx = tl[(i + 1) % tl.length].chord, tpc = (nx.bass || nx.root).pc;
        const last = mod12(notes[notes.length - 1].m - tpc);
        assert.ok([1, 11, 7, 5].includes(last), `accord ${i} : approche ${last}`);
      }
    });
  }
  // même graine, même ligne
  const a1 = AC.bassLine(tl, totalBeats, 4, { style: 'walk' }, 5), a2 = AC.bassLine(tl, totalBeats, 4, { style: 'walk' }, 5);
  assert.deepEqual(Array.from(a1, n => n.m), Array.from(a2, n => n.m));
});

test('walking bass dans une boucle : le dernier accord prépare le premier de la boucle', () => {
  const { tl, totalBeats } = load('| Dm7 | G7 | Cmaj7 | Bb7 | Ebmaj7 |', 'C');
  const region = { a: 0, b: 1 };
  for (let seed = 1; seed <= 10; seed++) {
    const b = AC.bassLine(tl, totalBeats, 4, { style: 'walk', region }, seed);
    const last = b.filter(n => n.ev === 1).pop();
    assert.ok([1, 11, 7, 5].includes(mod12(last.m - 2)), `approche de Ré : ${last.m}`);
  }
});
