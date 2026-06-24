# Claude Code Handoff — V Rising V Blood Codex

Paste the prompt below into Claude Code (run it from inside the unzipped
`vrising-vblood-codex/` folder). It carries the full context of how this
project was built so you can continue without re-explaining anything.

---

## PROMPT TO PASTE INTO CLAUDE CODE

I'm continuing a project that was started in a chat session. It's a single-page,
dark-themed reference guide for the V Blood bosses in the game **V Rising**
(patch 1.1). You are now working in the project folder locally. Please start by
reading `README.md`, `index.html`, and the three files in `src/` to understand
the structure.

### What this is

A self-contained `index.html` listing 62 V Blood bosses across four acts plus
the Mortium endgame. Each boss has a card with a fight summary and a recommended
loadout: weapon, blood type, one movement **veil**, two **spells**, and one
**ultimate**.

### How it's authored (important)

The page is built from three fragments concatenated in order:

- `src/part_head.html` — CSS, hero, controls, primer, and the `ACTS` metadata object
- `src/part_bosses.js` — the `BOSSES` data array (this is what changes most often)
- `src/part_tail.html` — the `SCHOOL` colour map, the render/`kitRows` logic, and filter/search

`index.html` is the concatenation of those three, committed so the page works
with no build step. Rebuild with `bash build.sh`. **Never hand-edit
`index.html` directly** — edit the `src/` fragment and rebuild, or the next
build will clobber your change.

### Rules the data must satisfy (enforced by `node validate.js`)

1. Every boss card has exactly **2 spell slots**.
2. The **ultimate slot** holds a real ultimate (or `"—"` for early Act I bosses
   that don't have one yet).
3. **No ultimate** ever appears in a regular spell slot.
4. Every named ability maps to a **spell school** in the `SCHOOL` object (for
   colour-coding).
5. **Progression rule:** no ability may be recommended on a boss whose gear
   level is below the level at which that ability unlocks. A boss's own reward
   is never used as a tool for its own fight. Same-level cases are allowed
   (kill-order dependent) and the validator reports them as soft warnings only.

Run `node validate.js` after any data change. It exits non-zero on a hard
violation, so it's safe to use as a pre-commit gate.

### Workflow for any change

1. Edit the relevant `src/` file.
2. `bash build.sh`
3. `node validate.js` (must pass)
4. Open `index.html` to verify visually.
5. Commit.

### The task I want to do now

**Publish this to GitHub.** A local git repo has already been initialized with
one commit. Please:

1. Confirm the working tree is clean (`git status`) and the build is current
   (`bash build.sh && node validate.js`).
2. Create a new GitHub repo named `vrising-vblood-codex` and push to it. Use the
   GitHub CLI if it's installed and authenticated:
   ```
   gh repo create vrising-vblood-codex --public --source=. --remote=origin --push
   ```
   If `gh` isn't available, tell me and I'll create the empty repo in the
   GitHub web UI, then you add the remote and push:
   ```
   git remote add origin https://github.com/<MY_USERNAME>/vrising-vblood-codex.git
   git branch -M main
   git push -u origin main
   ```
3. Optionally enable **GitHub Pages** (Settings → Pages → deploy from `main`,
   root) so `index.html` is served as a live site, and add the resulting URL to
   the top of `README.md`.

> Note on credentials: do not enter my GitHub password or tokens directly. Use
> `gh`'s existing auth, or the system git credential helper. If authentication
> isn't set up, stop and walk me through `gh auth login` rather than handling
> secrets yourself.

### Possible follow-up work (ask me before starting any of these)

- Add the **Act I forms/utility bosses** detail or an "unlocks what" reference table.
- Add an **alternate-ultimate** note on cards where a second viable ult exists
  (e.g. Blood's Heart Strike vs Crimson Beam).
- Add a **gear/jewel progression** section or a printable cheat-sheet view.
- Re-verify the roster and unlock levels against the **latest** V Rising patch
  (the data reflects 1.1; later patches may shift levels or add bosses).
- Tint the **blood-type** names to match in-game blood colours.

Please begin by reading the files and running the build + validator, then tell
me the current state before pushing anything.

---

## Quick reference (for you, the human)

From the unzipped folder:

```bash
bash build.sh        # rebuild index.html from src/
node validate.js     # check the boss data (needs Node.js)
open index.html      # macOS; use xdg-open on Linux, start on Windows
```

GitHub publish, if doing it yourself with the GitHub CLI:

```bash
gh auth login                       # one-time, if not already authenticated
gh repo create vrising-vblood-codex --public --source=. --remote=origin --push
```
