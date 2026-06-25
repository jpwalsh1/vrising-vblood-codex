# CLAUDE.md — V Rising V Blood Codex

Dark-themed, single-page reference for every V Blood boss in V Rising (patch 1.1).
64 bosses across four acts plus the Mortium endgame. Each card shows a fight summary
and a progression-legal loadout: weapon, blood type, veil, two spells, one ultimate.

Live site: https://jpwalsh1.github.io/vrising-vblood-codex/
Repo: https://github.com/jpwalsh1/vrising-vblood-codex

---

## Commands

```bash
bash build.sh       # rebuild index.html from src/ fragments
node validate.js    # check boss data — exits non-zero on any hard violation
open index.html     # preview locally (macOS)
```

Always run both after any data change. The validator is safe to use as a pre-commit gate.

---

## Architecture

`index.html` is built by concatenating three source fragments in order:

| File | Contains |
|---|---|
| `src/part_head.html` | CSS, hero, sticky nav/filters, primer section, `ACTS` metadata object |
| `src/part_bosses.js` | `BOSSES` data array — edit this most often |
| `src/part_tail.html` | `SCHOOL` colour map, `BT_CLASS` blood colours, `kitRows()` render logic, filter/search |

**Never hand-edit `index.html` directly.** The next `bash build.sh` will clobber any change made there. Always edit the relevant `src/` file and rebuild.

---

## Boss data shape

```js
{
  act: 2,                          // 1–4, or "boss" for Mortium endgame
  lvl: 47,                         // gear level
  name: "Kriig the Undead General",
  epithet: "the risen captain",
  loc: "Static · Haunted Iron Mine, Dunley",
  ac: C.shadow,                    // accent colour (C = {blood, frost, shadow, holy, storm, ember})
  threat: "…",                     // what the fight does to you (HTML ok, bold key phrases)
  weapon: "…",
  gate: "…",                       // gear/abilities you'll already have when you arrive
  blood: [["Brute", "why"]],       // one or more [type, reason] pairs
  veil: "Veil of Blood",           // movement slot ("—" if none available yet)
  spells: ["Chaos Volley", "Spectral Wolf"],  // exactly two entries ("—" allowed early)
  ult: "Chaos Barrage",            // ultimate slot ("—" if none available yet)
  altUlt: "Merciless Charge",      // optional: alternate ultimate for a different build
  tip: "…",                        // fight advice (HTML ok)
  reward: "…"                      // what killing it unlocks (shown in card header + expanded)
}
```

---

## Validation rules (enforced by validate.js)

1. Every card has **exactly 2 spell slots**.
2. The `ult` slot must be a real ultimate or `"—"` (early Act I only).
3. No ultimate may appear in a regular spell slot.
4. Every named ability must map to a school in the `SCHOOL` object (for colour-coding).
5. **Progression:** no ability recommended on a boss below the level it unlocks.
   Same-level cases (kill-order dependent) are soft warnings only.
6. `altUlt` (optional) is also checked: must be an ultimate, mapped to a school, progression-legal.

The `UNLOCK` table in `validate.js` is the authoritative source for which gear level
each ability becomes available. Update it if new bosses or patches shift unlock levels.

---

## Spell schools and blood-type colours

Spell pills are coloured by school — `SCHOOL` map in `src/part_tail.html`.
Blood type names are coloured by `BT_CLASS` in `src/part_tail.html` (Brute = orange,
Rogue = amber, Scholar = purple, Warrior = bronze, Creature = green, Draculin = crimson,
Worker = blue). Add new types to both `BT_CLASS` and the CSS in `src/part_head.html`.

---

## Workflow for any change

1. Edit the relevant `src/` file.
2. `bash build.sh`
3. `node validate.js` (must pass clean)
4. Open `index.html` to eyeball the result.
5. Commit — include `index.html` in the commit (it's the deployable artefact).

GitHub Pages serves `main` branch root, so every push to `main` auto-deploys.

---

## Enhancement backlog

Roughly priority-ordered. Ask before starting any of these.

### Completed

- ~~**Printable / cheat-sheet view**~~ — done. Toggle button + `@media print` landscape table.
- ~~**Shareable card anchor links**~~ — done. `#slug` on each card, clipboard copy, hash routing.
- ~~**Act I utility-boss annotations**~~ — done. Gold/amber gate chips + purple form-unlock chips on 10 bosses.
- ~~**Blood-type colour tinting**~~ — done. `BT_CLASS` map + coloured spans on all blood entries.
- ~~**Alternate-ultimate notes**~~ — done. `altUlt` field on 12 bosses, shown as small alt pill.
- ~~**Unlock reward preview**~~ — done. Collapsed card header shows reward line in gold monospace.
- ~~**Mobile card layout tweak**~~ — done. Sub-400px tweaks: hide reward preview, tighten header padding.
- ~~**Brutal difficulty notes**~~ — done. `brutal` field on all 64 bosses; ember-red callout below threat text. ~30 bosses have real mechanic changes, rest flagged as stat-scaling only.

### Ready to build

- ~~**Per-card loadout builder**~~ — done. "Customize Build" button on each expanded card opens
  a `<dialog>` with tabs for Weapon (dual-tier grid), Blood (all 7 types with descriptions),
  Veil, Spell 1, Spell 2, Ultimate. Spell panels default to "Recommended" filter (boss defaults);
  school filter tabs drill into full spell list. Locked spells (above boss GL) shown at 38% opacity,
  tappable for details + unlock source, but not selectable. State persists via `localStorage`
  keyed by `vbc-build-{slug}`.

- ~~**Shareable build links**~~ — done. URL scheme `#boss-slug/Weapon/Blood/Veil/Spell1/Spell2/Ult`
  (slash-delimited, `+` for spaces). "Copy Link" button in dialog footer encodes current build.
  On load, if hash has 7 segments the dialog opens automatically with that build loaded and footer
  shows "Import Build" instead of "Save Build". URL param wins on fresh load; localStorage wins
  on return visits.

### Completed (continued)

- ~~**Gear progression checkpoints**~~ — done. Four panels before Act II/III/IV/Endgame, each with 6 bullet points (weapon tier, armor, stations, veil, spells, resources). Show/hide with act filters.

### Future / post-loadout-builder

- **Multiple saved builds per boss + import** — allow users to save more than one build per boss,
  with one designated as "active" that displays on the card. When viewing a shared build URL, show
  an "Import this build" button so users can save it to their own codex without overwriting their
  existing build. The active build indicator and build list management (rename, delete, reorder)
  can live in the dialog. Shared URLs should reconcile against existing saves: if the user already
  has a build for that boss, offer to save as a new slot rather than overwriting.

### Needs research / data work

- **Alternate-ultimate expansion** — currently 12 bosses have `altUlt`. Could extend
  to more bosses or add a second alt where multiple builds diverge significantly.

### Low priority / quality of life

- **Patch verification pass** — data reflects V Rising 1.1 (Invaders of Oakveil).
  Stunlock Studios has announced no further major updates (studio moving to new game in
  same universe), so the 1.1 data should remain stable. Low-effort spot-check only if
  a balance hotfix ships.

- **Dark/light mode toggle** — currently dark-only. Low priority for a game-reference page.

- **Filter by blood type** — add blood-type filter buttons alongside the act filters.
