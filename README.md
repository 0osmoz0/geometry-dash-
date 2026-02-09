# Geometry Dash (sans assets)

Clone de Geometry Dash en HTML5 Canvas, sans images ni sprites : tout est dessiné en formes géométriques (rectangles, triangles, dégradés).

## Lancer le jeu

Le chargement du niveau (JSON) nécessite un serveur HTTP. **Ne pas ouvrir `index.html` directement** (file://) à cause des restrictions CORS.

### Option 1 : serveur Node (recommandé)

```bash
npx serve .
```

Puis ouvrir http://localhost:3000 dans le navigateur.

### Option 2 : Python

```bash
python3 -m http.server 8000
```

Puis ouvrir http://localhost:8000.

### Option 3 : VS Code

Avec l’extension "Live Server", clic droit sur `index.html` → "Open with Live Server".

---

## Contrôles

- **Espace** ou **clic** (ou **tap** sur mobile) : sauter
- **P** ou **Échap** : pause / reprendre
- **F** : plein écran

## Contenu

- **Menu** : Jouer, Niveaux, Paramètres
- **Niveau 1** : enchaînement de blocs et spikes (~60 s)
- **Game Over** : Rejouer ou retour au menu
- **Sons** : bips (saut, mort) via Web Audio API, sans fichiers audio

## Structure du projet

- `index.html` : point d’entrée, canvas
- `css/style.css` : mise en page plein écran
- `js/` : `main.js`, `game.js`, `player.js`, `level.js`, `collision.js`, `renderer.js`, `menu.js`, `audio.js`
- `levels/level1.json` : données du premier niveau (obstacles en coordonnées monde)

Aucune dépendance : HTML, CSS et JavaScript uniquement.
