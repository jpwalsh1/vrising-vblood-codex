#!/usr/bin/env node
/*
 * validate.js — integrity checks for the V Rising V Blood Codex boss data.
 *
 * Reads src/part_bosses.js (the BOSSES array) and src/part_tail.html (the
 * SCHOOL colour map), then enforces the rules the guide depends on:
 *
 *   1. Every card has exactly 2 spell slots.
 *   2. The ultimate slot holds a real ultimate (or "—" for pre-ultimate
 *      Act I bosses).
 *   3. No ultimate appears in a regular spell slot.
 *   4. Every named ability maps to a spell school (for colour-coding).
 *   5. Progression: no ability is recommended before the level at which it
 *      unlocks. Same-level cases are reported as soft warnings (legal when
 *      the prerequisite boss is killed first in route order).
 *
 * Exit code is non-zero if any HARD issue is found, so it can gate a commit.
 */
const fs = require('fs');
const path = require('path');

const root = __dirname;
const bossesSrc = fs.readFileSync(path.join(root, 'src/part_bosses.js'), 'utf8');
const tailSrc = fs.readFileSync(path.join(root, 'src/part_tail.html'), 'utf8');

// The colour-var object referenced by the data; values are irrelevant here.
const C = { blood: 'x', frost: 'x', shadow: 'x', holy: 'x', storm: 'x', ember: 'x' };

// Pull the two data structures out of the source files.
eval(bossesSrc.match(/const BOSSES = \[[\s\S]*?\n\];/)[0].replace('const ', 'var '));
eval(tailSrc.match(/const SCHOOL = \{[\s\S]*?\};/)[0].replace('const ', 'var '));

const school = n => SCHOOL[n] || '';
const none = v => !v || v === '—';

// One ultimate per school (plus a few alternates the game offers).
const ULTS = new Set([
  'Heart Strike', 'Crimson Beam',            // Blood
  'Chaos Barrage', 'Merciless Charge',       // Chaos
  'Army of the Dead', 'Volatile Arachnid',   // Unholy
  'Arctic Leap', 'Ice Block', 'Arctic Storm',// Frost
  'Lightning Typhoon', 'Raging Tempest',     // Storm
  'Wisp Dance', 'Spectral Guardian'          // Illusion
]);

// Level at which each ability first becomes available (1.1 standard route).
const UNLOCK = {
  // Veils
  'Veil of Blood': 40, 'Veil of Chaos': 30, 'Veil of Bones': 27,
  'Veil of Frost': 44, 'Veil of Illusion': 35, 'Veil of Storm': 50,
  // Regular spells
  'Chaos Volley': 30, 'Power Surge': 30, 'Aftershock': 20,
  'Shadowbolt': 0, 'Blood Rite': 0, 'Blood Rage': 20,
  'Blood Fountain': 57, 'Sanguine Coil': 57, 'Carrion Swarm': 57,
  'Corrupted Skull': 47, 'Bone Explosion': 27, 'Ward of the Damned': 37,
  'Soulburn': 63, 'Death Knight': 63, 'Unholy Chains': 63,
  'Spectral Wolf': 27, 'Phantom Aegis': 27, 'Wraith Spear': 27,
  'Frost Bat': 20, 'Cold Snap': 20, 'Ice Nova': 20,
  'Crystal Lance': 53, 'Frost Barrier': 44,
  'Cyclone': 50, 'Ball Lightning': 50, 'Discharge': 50,
  'Polarity Shift': 60, 'Lightning Curtain': 60, 'Lightning Tendrils': 60,
  // Ultimates
  'Heart Strike': 37, 'Crimson Beam': 61, 'Chaos Barrage': 37,
  'Merciless Charge': 37, 'Army of the Dead': 63, 'Volatile Arachnid': 63,
  'Arctic Leap': 53, 'Ice Block': 53, 'Raging Tempest': 58,
  'Lightning Typhoon': 58, 'Spectral Guardian': 53, 'Wisp Dance': 53
};

const hard = [];
const warn = [];

for (const b of BOSSES) {
  if (b.spells.length !== 2) hard.push(`[!=2 spell slots] ${b.name}`);
  if (!none(b.ult) && !ULTS.has(b.ult)) hard.push(`[ult slot not an ultimate] ${b.name} -> ${b.ult}`);
  for (const sp of b.spells) {
    if (!none(sp) && ULTS.has(sp)) hard.push(`[ultimate in spell slot] ${b.name} -> ${sp}`);
  }
  for (const x of [b.veil, ...b.spells, b.ult]) {
    if (!none(x) && !school(x)) hard.push(`[no school mapping] ${b.name} -> ${x}`);
  }
  const check = (a, slot) => {
    if (none(a)) return;
    if (UNLOCK[a] === undefined) { hard.push(`[unknown unlock] ${b.name} -> ${a}`); return; }
    if (UNLOCK[a] > b.lvl) hard.push(`[TOO EARLY] ${b.name} GL${b.lvl} ${slot}: ${a} (unlocks GL${UNLOCK[a]})`);
    else if (UNLOCK[a] === b.lvl) warn.push(`[same-level / kill-order] ${b.name} GL${b.lvl} ${slot}: ${a}`);
  };
  check(b.veil, 'veil');
  b.spells.forEach(s => check(s, 'spell'));
  check(b.ult, 'ult');
  if (b.altUlt) {
    if (!ULTS.has(b.altUlt)) hard.push(`[altUlt not an ultimate] ${b.name} -> ${b.altUlt}`);
    if (!school(b.altUlt)) hard.push(`[altUlt no school mapping] ${b.name} -> ${b.altUlt}`);
    check(b.altUlt, 'altUlt');
  }
}

const byAct = a => BOSSES.filter(b => b.act === a).length;
console.log(`Bosses: ${BOSSES.length}  (I:${byAct(1)} II:${byAct(2)} III:${byAct(3)} IV:${byAct(4)} endgame:${byAct('boss')})`);

if (hard.length) {
  console.log('\nHARD ISSUES:');
  hard.forEach(i => console.log('  ' + i));
} else {
  console.log('\u2713 No hard violations: slots valid, schools mapped, progression legal.');
}

if (warn.length) {
  console.log('\nSame-level notes (legal if the source boss is killed first):');
  warn.forEach(i => console.log('  ' + i));
}

process.exit(hard.length ? 1 : 0);
