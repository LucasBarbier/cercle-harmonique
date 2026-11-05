# Cercle Harmonique

Analyse de grilles d'accords (jazz manouche, jazz) sur un cercle chromatique ou des quintes, et générateur d'études mélodiques à travailler sur la grille : partition paginée ou portée qui défile, pour instrument en Ut, violon, clarinette en Si♭, saxophones alto et ténor.

## Utiliser l'appli

| | |
|---|---|
| **Dans le navigateur** | [lucasbarbier.github.io/cercle-harmonique](https://lucasbarbier.github.io/cercle-harmonique/) : rien à installer, fonctionne aussi sur téléphone. |
| **Android** | Téléchargez `cercle-harmonique-<version>.apk` dans la [dernière version](https://github.com/LucasBarbier/cercle-harmonique/releases/latest), ouvrez le fichier sur le téléphone et autorisez l'installation depuis cette source. |
| **Hors ligne, sur ordinateur** | Téléchargez `cercle-harmonique-web-<version>.zip` dans la [dernière version](https://github.com/LucasBarbier/cercle-harmonique/releases/latest), dézippez-le et ouvrez `index.html`. |

L'APK n'est pas distribué par le Play Store : Android affiche donc un avertissement à l'installation. Les mises à jour s'installent par-dessus la version précédente, en gardant vos réglages.

## Ce que fait l'appli
- **Grille** : saisie en texte (`| Dm7 | G7 | Cmaj7 |`, notation anglaise ou française), analyse fonctionnelle (degrés, tonique / sous-dominante / dominante, II–V, dominantes secondaires, substitutions tritoniques, emprunts), affichage « accords seuls » en grand.
- **Cercle** : notes de l'accord, accord suivant, notes communes, mouvements des voix, gamme de l'accord.
- **Lecture** : tempo, boucle sur une partie de la grille, accompagnement (pompe manouche, piano, nappe) et basse (fondamentale, deux temps, walking).
- **Études** : lignes générées sur la grille (arpèges, notes guides, notes de passage, approches chromatiques, encerclements), styles rythmiques (phrasé, syncopé, notes longues), swing, liaisons d'archet, instruments transpositeurs. Mode défilement en plein écran.
- Thème clair ou sombre, interface pensée pour le téléphone (portrait et paysage).

## Développer
Prérequis : [Node.js 20+](https://nodejs.org). L'appli est en HTML, CSS et JavaScript sans framework ni étape de compilation (dossier `www/`).

```bash
npm install
npm run dev      # http://localhost:5173, rechargement automatique
npm test         # tests du moteur harmonique et du générateur
```

`CLAUDE.md` décrit l'architecture et les conventions du code.

### Android
1. Installez [Android Studio](https://developer.android.com/studio) (il fournit le SDK, l'émulateur et Java).
2. Pointez `JAVA_HOME` vers un JDK 17 ou 21 (celui d'Android Studio convient), puis :
   ```bash
   npm run android        # copie www/ et lance sur l'émulateur ou le téléphone branché
   npm run android:open   # ouvre le projet dans Android Studio
   ```
3. Téléphone réel : activez les options pour les développeurs et le débogage USB. Sur Xiaomi, activez aussi « Installer via USB ».

**Version signée** : créez une clé avec `keytool`, puis un fichier `android/keystore.properties` (jamais versionné) :
```properties
storeFile=C:/chemin/vers/ma-cle.jks
storePassword=...
keyAlias=...
keyPassword=...
```
puis `cd android && ./gradlew assembleRelease`. L'APK est dans `android/app/build/outputs/apk/release/`. Gardez toujours la même clé : Android refuse une mise à jour signée par une autre.

### Site web
Chaque push sur `main` lance les tests puis publie `www/` sur GitHub Pages (`.github/workflows/pages.yml`).

## Pistes
- Import de grilles depuis guitarejazzmanouche.com, uniquement avec l'accord du site : leur base de grilles est protégée en tant que base de données (Code de la propriété intellectuelle), même si une suite d'accords seule ne l'est pas. Sur leurs pages, les chiffrages utilisent une police spéciale (`CΜί` pour `Cm7`) qu'un import devra traduire.
- Armure de clé, export MIDI / MusicXML, lecture d'une grille depuis une photo (nécessite un petit serveur qui appelle l'API Claude).

## Structure
```
www/            l'application (HTML, CSS, JS) : c'est aussi ce qui part sur le mobile
tests/          tests du moteur (node --test)
android/        projet Android généré par Capacitor
CLAUDE.md       guide du projet pour Claude Code
```

## Licence
[MIT](LICENSE) © 2026 Lucas Barbier
