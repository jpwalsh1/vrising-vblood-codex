# V Rising V Blood Codex

**Live site:** https://jpwalsh1.github.io/vrising-vblood-codex/


A dark-themed, single-page reference for every V Blood boss in **V Rising** (patch 1.1, *Invaders of Oakveil*), from the first wolf in Farbane Woods to Dracula in Mortium. Each boss card gives a fight summary plus a recommended loadout — weapon, blood type, movement veil, two spells, and an ultimate — using **only abilities you would already have unlocked when you reach that boss**.

62 bosses across four acts plus the Mortium endgame.

## Features

- **Progression-aware loadouts.** A boss's own reward is never recommended as a tool for its own fight. Every ability is checked against the level at which it unlocks (see `validate.js`).
- **School-coloured abilities.** Veils, spells, and ultimates are tinted by spell school — Blood, Chaos, Frost, Unholy, Illusion, Storm — with a legend.
- **Correct slotting.** One movement veil, two regular spells, one ultimate per card. No ultimate is ever placed in a spell slot.
- **Filter + search.** Filter by act (I–IV plus endgame) or search by boss, region, weapon, or ability.
- **Self-contained.** `index.html` has no external dependencies beyond Google Fonts. Open it in any browser.

## Project layout

```
.
├── index.html              # the built, deployable guide — open this
├── build.sh                # reassembles index.html from src/ fragments
├── validate.js             # integrity + progression checks for the boss data
├── src/
│   ├── part_head.html      # CSS, hero, controls, primer, ACTS metadata
│   ├── part_bosses.js      # the BOSSES data array (the thing you edit most)
│   └── part_tail.html      # SCHOOL colour map, render logic, filter/search
├── README.md
├── LICENSE
└── .gitignore
```

The guide is authored in three fragments so the large boss-data array stays separate from the markup and logic. `index.html` is the concatenation of the three `src/` files; it is committed so the page works without a build step.

## Editing

1. Edit the relevant file in `src/` (usually `src/part_bosses.js` to change a loadout or add a boss).
2. Rebuild: `bash build.sh`
3. Validate: `node validate.js`  (exits non-zero on any hard issue)
4. Open `index.html` to eyeball the result, then commit.

### Boss data shape

Each entry in `BOSSES`:

```js
{
  act: 2,                         // 1–4, or "boss" for the Mortium endgame group
  lvl: 47,                        // gear level
  name: "Kriig the Undead General",
  epithet: "the risen captain",
  loc: "Static · Haunted Iron Mine, Dunley",
  ac: C.shadow,                   // accent colour (damage school feel)
  threat: "…",                    // what the fight does to you
  weapon: "…",
  gate: "…",                      // what you'll already have in hand here
  blood: [["Brute", "why"]],      // one or more blood-type suggestions
  veil: "Veil of Blood",          // movement slot ("—" if none yet)
  spells: ["Chaos Volley", "Spectral Wolf"],  // exactly two ("—" placeholders allowed early)
  ult: "Chaos Barrage",           // ultimate slot ("—" if none yet)
  tip: "…",
  reward: "…"                     // what killing it unlocks
}
```

`validate.js` enforces the slot rules, the school mapping, and the unlock-before-use progression rule.

## Data sources

Boss roster, levels, locations, and unlock sources were compiled from the V Rising community wikis and boss databases for patch 1.1. Loadouts are sensible starting points, not the only viable builds — V Rising lets you respec freely, so adapt to your blood quality, jewels, and playstyle.

## License

MIT — see `LICENSE`. V Rising is a trademark of Stunlock Studios; this is an unofficial fan-made reference and is not affiliated with or endorsed by Stunlock Studios.
