# Entwicklungsplan: Custom Runner mit Charakter-Editor

Dieses Dokument dient als Schritt-für-Schritt-Anleitung für das Entwickler-Tool **Jules**, um das Spiel modular aufzubauen.

---

## 1. Projektübersicht

Ein webbasiertes 2D-Hindernis-Rennspiel (Endless Runner) mit einem integrierten Charakter-Editor.

### Kern-Features:
* **Charakter-Editor:**
  * Anpassung von Körpergröße (Höhe/Breite), Gesicht und Frisur.
  * Kleidungsauswahl (Oberteil, Hose, Schuhe) mit wählbaren Schnitten.
  * Farb-Anpassung der Kleidung (ohne Texturverlust).
  * Sticker-System zum Freien Platzieren von Decals/Mustern auf der Kleidung.
  * Auswahl einer Spezial-Fähigkeit (z. B. "Schnell sein" / Supersprint).
* **Hintergrund-Auswahl (Pre-Race):**
  * Vor jedem Rennen wählt der Spieler ein Themen-Setting (z. B. Höhle/Hölle, Grüne Wiese, Neon-City).
* **Hindernisrennen (Gameplay):**
  * Running-Mechanik mit auszuweichenden Hindernissen (Zäune, Höhlen/Abgründe).
  * On-Screen Touch-Steuerung (Pfeiltasten unten links/rechts) für mobile Geräte und PC.
  * Anwendung der gewählten Fähigkeit im Rennen.
* **Technik:**
  * HTML5 Canvas, Vanilla JavaScript (ES6 Modules) / Vite.
  * Scharfes, nicht-verschwommenes Skalieren für High-DPI-Displays (Crisp Canvas Rendering).

---

## 2. Ordnerstruktur im Repository

```text
/
├── assets/
│   ├── audio/         # Soundeffekte (Sprung, Sprint, Kollision)
│   ├── sprites/       # Basis-Grafiken (Körper, Frisuren, Kleidung)
│   ├── stickers/      # Sticker-Grafiken (Sterne, Flammen, Herz, etc.)
│   └── backgrounds/   # Hintergrund-Ebenen (Höhle, Wiese, City)
├── src/
│   ├── editor/
│   │   ├── characterData.js     # Datenstruktur (PlayerConfig)
│   │   ├── characterRenderer.js # Zeichnen des Charakters & Farb-Shader/Tinting
│   │   └── editorUI.js          # Event-Handling für Regler, Farbwähler & Sticker
│   ├── game/
│   │   ├── runnerEngine.js      # Game Loop, Physik & Scroll-Speed
│   │   ├── obstacles.js         # Generierung von Zäunen & Gruben
│   │   └── controls.js          # Touch-Pfeiltasten & Tastatur-Steuerung
│   ├── screens/
│   │   ├── backgroundSelect.js  # Auswahlscreen für Level-Hintergründe
│   │   └── stateManager.js      # Szenen-Wechsel (Editor -> Background -> Game)
│   ├── style.css                # Responsive UI & Canvas-Layout
│   └── main.js                  # Haupt-Einstiegspunkt
├── index.html                   # Haupt-Container & UI-Overlay
├── PLAN.md                      # Dieser Entwicklungsplan
└── README.md                    # Projekt-Beschreibung
```

---

## 3. Umsetzungs-Phasen für Jules

### Phase 1: Projekt-Grundgerüst & State-Management
* **Ziel:** Eine lauffähige Web-App mit funktionierendem Szenen-Wechsel.
* **Tasks für Jules:**
  * Erstelle die Verzeichnisstruktur und die Dateien index.html, src/style.css und src/main.js.
  * Richte ein responsive HTML5-Canvas ein, das sich an verschiedene Bildschirmgrößen anpasst und Unschärfe verhindert (imageRendering: pixelated oder High-DPI Canvas Scaling).
  * Implementiere den stateManager.js mit drei Zuständen:
    * State.EDITOR (Charakter-Creator)
    * State.BACKGROUND_SELECT (Hintergrund-Auswahl)
    * State.GAME (Rennen)

### Phase 2: Charakter-Editor
* **Ziel:** Vollständige Anpassung der Figur inkl. Speicherung im PlayerConfig-Objekt.
* **Tasks für Jules:**
  * Datenmodell (characterData.js):
    * Erstelle das JavaScript-Objekt PlayerConfig zur Speicherung von Höhe, Breite, Gesichts-ID, Frisur, Kleidungs-Farben, Sticker-Koordinaten und Fähigkeit.
  * Körper & Proportionalität (characterRenderer.js):
    * Implementiere Regler für Körperhöhe und -breite. Die Kleidung muss sich dynamisch an die Knochen/Punkte des Körpers anpassen, ohne zu verpixeln.
  * Kleidung & Farbanpassung:
    * Erstelle Auswahlmöglichkeiten für Oberteile, Hosen und Schuhe sowie deren Schnitte (z. B. Hoody, Oversize, Shorts).
    * Binde Farb-Picker ein, die Kleidungselemente per Farbüberlagerung (Color Tinting) ohne Schattenverlust einfärben.
  * Sticker-System:
    * Ermögliche das Auswählen und Platzieren von Stickern auf der Kleidung. Speichere deren relative Position (x, y) und Skalierung im PlayerConfig-Objekt.
  * Fähigkeiten-Auswahl:
    * Füge Radio-Buttons oder Auswahl-Karten für Fähigkeiten wie "speed_boost" (Supersprint) oder "double_jump" hinzu.

### Phase 3: Pre-Race Hintergrund-Auswahlscreen
* **Ziel:** Der Spieler wählt vor dem Rennstart die Umgebung.
* **Tasks für Jules:**
  * Erstelle das Modul src/screens/backgroundSelect.js.
  * Baue ein Karussell oder drei Auswahlkarten mit Vorschaubildern:
    * Höhle / Hölle: Dunkelrote/violette Felsen, Lava-Elemente.
    * Grüne Wiese: Klassischer Parcours mit blauem Himmel.
    * Neon-City: Dunkles Nacht-Szenario.
  * Speichere das gewählte Theme im gameConfig.background-Objekt und leite nach der Auswahl zum Renn-Screen weiter.

### Phase 4: Hindernisrennen & Steuerung
* **Ziel:** Actionreiches Rennen mit den individuellen Charakter-Daten und Touch-Steuerung.
* **Tasks für Jules:**
  * Runner-Engine (runnerEngine.js):
    * Implementiere die Game Loop (RequestAnimationFrame) mit Parallax-Scrolling des gewählten Hintergrunds.
    * Zeichne den im Editor erstellten Charakter auf Basis der PlayerConfig als rennende Figur.
  * Hindernisse (obstacles.js):
    * Spawne Zäune (erfordern Sprung) und Höhlen/Gruben (erfordern rechtzeitiges Ausweichen oder Fähigkeitseinsatz).
    * Implementiere präzise 2D-Kollisionsboxen (Hitboxes).
  * Touch-Steuerung (controls.js):
    * Füge am unteren linken Bildschirmrand On-Screen-Pfeiltasten (Links, Rechts, Ducken) ein.
    * Füge am unteren rechten Bildschirmrand Action-Buttons (Sprung, Fähigkeit) ein.
    * Binde Tastatur-Events (Pfeiltasten / WASD / Leertaste) als Alternative für PC ein.
  * Fähigkeiten-Mechanik:
    * Binde die im Editor gewählte Fähigkeit ein. Bei Aktivierung von "speed_boost" erhöht sich die Scroll-Geschwindigkeit temporär und der Charakter wird kurzzeitig unverwundbar.

### Phase 5: Feinschliff, Grafikschärfe & Deployment
* **Tasks für Jules:**
  * Optimiere die Canvas-Auflösung, sodass das Spiel auf mobilen Geräten sowie Retina-/High-DPI-Bildschirmen gestochen scharf gerendert wird.
  * Ergänze einfache Soundeffekte für Aktionen (Sprung, Fähigkeit, Kollision).
  * Teste das Spiel auf Responsive-Layouts (Mobile & Desktop).
  * Erstelle eine GitHub Actions Workflow-Datei (.github/workflows/deploy.yml) für automatisches Deployment auf GitHub Pages.

---

## 4. Datenmodell-Referenz (PlayerConfig)

```javascript
export const PlayerConfig = {
  body: {
    height: 1.0,      // Skalierung Höhe (0.8 bis 1.2)
    width: 1.0,       // Skalierung Breite (0.8 bis 1.2)
    faceId: 'face_1',
    hairId: 'hair_3',
    hairColor: '#4a2e00'
  },
  clothes: {
    top: { style: 'hoodie', color: '#0055ff', stickers: [] },
    pants: { style: 'jeans', color: '#222222' },
    shoes: { style: 'sneakers', color: '#ffffff' }
  },
  ability: 'speed_boost' // Mögliche Werte: 'speed_boost', 'double_jump'
};
```

---

## 5. Arbeitsanweisungen für Jules

* Arbeite die Phasen strikt der Reihe nach ab.
* Erstelle nach jedem abgeschlossenen Task einen sauberen Commit mit aussagekräftiger Nachricht (z. B. feat: add character editor UI and scaling logic).
* Achte darauf, dass der Code modular aufgebaut ist und keine monolithischen Dateien entstehen.
