# Cercle Harmonique — guide pour Claude Code

Application d'analyse harmonique de grilles d'accords (jazz manouche, jazz) et générateur d'études mélodiques. Web statique sans framework, empaquetée pour mobile avec Capacitor.

## Commandes
- `npm install` — dépendances (Vite pour le serveur de dev, Capacitor pour le mobile)
- `npm run dev` — serveur local sur http://localhost:5173 (rechargement auto)
- `npm test` — tests du moteur (Node ≥ 20, sans navigateur) : `tests/engine.test.mjs`
- `npm run android` — synchronise `www/` et lance sur l'émulateur Android
- `npm run android:live` — idem avec rechargement à chaud depuis Vite

Après toute modification de `www/`, lancer `npm test`. Pour le mobile, `npx cap sync` recopie `www/` dans les projets natifs.

## Architecture (`www/`)
Quatre scripts classiques chargés dans l'ordre par `index.html`, qui communiquent par des globales :

| Fichier | Rôle | Expose |
|---|---|---|
| `js/harmony.js` | Parsing des chiffrages et des grilles (`parseChord`, `parseSheet`), timeline (`buildTimeline`), tonalité (`detectKey`, `parseKey`), analyse fonctionnelle (`analyze` : degrés, fonctions T/SD/D, V7/x, subV, II–V, emprunts), gamme d'accord, conduite des voix | `window.HT` |
| `js/etude.js` | Générateur de lignes : temps forts = notes d'accord selon un motif, temps faibles = notes de passage (diatonique, chromatique, encerclement) via une petite recherche par coût | `window.ET.generate(tl,total,bpb,opts,seed)` |
| `js/accomp.js` | Accompagnement, calcul pur : boucle sur une partie de la grille (`bounds`, `nextIdx`, `prevIdx`), rythmes d'accords (`compLine` : pompe, piano Charleston, nappe), basses (`bassLine` : fondamentale, deux temps, walking déterministe par graine) | `window.AC` |
| `js/app.js` | Interface : cercle SVG, grille, transport (requestAnimationFrame), synthèse Web Audio (guitare et basse en Karplus-Strong, piano, nappe ; accompagnement programmé ~100 ms en avance par `schedule()`), vue Étude (partition paginée + portée qui défile en flux infini), instruments transpositeurs, import d'image | — |
| `css/styles.css` | Jetons de couleur (thèmes clair/sombre) puis composants | — |

Conventions :
- Hauteurs en MIDI ; classes de hauteur `pc` 0–11 ; orthographe `{L:'C'..'B', a:-2..2}`. Toujours épeler à partir des lettres (`spellFrom`, `stepScale`, `tSpell`), jamais depuis le seul `pc`.
- Notation FR/EN : `HT.O.notation`, et toujours afficher via `HT.nn(L,a)`.
- Les registres de `INST` (app.js) sont en hauteur **écrite** ; le son réel = écrit − `semi`.
- Le générateur est déterministe pour une graine donnée (`mulberry32`) : utile pour les tests.
- Toutes les couleurs passent par les variables CSS (`--ink`, `--next`, `--mel`…), jamais de couleur en dur dans les composants.
- Langue de l'interface : français.

## Dépendances à l'hébergement claude.ai
L'appli a d'abord été publiée comme Artifact claude.ai. Deux fonctions utilisent `window.claude`, absent ici :
- **Lecture de grille depuis une image** (`claude.use('sample')`) : désactivée hors claude.ai. Pour la réactiver, ajouter un petit backend (ex. fonction serverless) qui appelle l'API Claude avec une clé côté serveur. Ne jamais mettre de clé API dans l'appli.
- **Téléchargement SVG** (`claude.use('downloads')`) : remplacé ici par un lien blob. Sur mobile, prévoir `@capacitor/filesystem` + `@capacitor/share`.

## Pistes ouvertes
- Import de grilles depuis une URL (voir README, section guitarejazzmanouche.com : à faire seulement avec l'accord du site)
- Armure de clé (actuellement tout en altérations accidentelles)
- Export MIDI / MusicXML (possible hors claude.ai)
- Modules ES + bundler si le code grossit (aujourd'hui volontairement sans build)
