# Mode-Hindernisrennen-

Ein 2D-Endless-Runner-Spiel mit integriertem Charakter-Editor.

[Spiel online spielen](https://antonpae.github.io/Mode-Hindernisrennen-)

## Deployment / GitHub Pages

Das Projekt wird automatisch bei jedem Push/Merge auf den `main`-Branch über GitHub Actions (`.github/workflows/deploy.yml`) gebaut und sofort auf GitHub Pages veröffentlicht.

### Hinweise zum Erscheinen neuer Änderungen:
1. **Build- und Bereitstellungszeit:** Nach dem Mergen eines Pull Requests benötigt die GitHub Action in der Regel etwa **1 bis 2 Minuten**, um das Projekt zu bauen und die Seite bereitzustellen. Unter dem Reiter **Actions** im GitHub-Repository kann der aktuelle Status des Deployments in Echtzeit verfolgt werden.
2. **Browser- und CDN-Cache:** GitHub Pages setzt standardmäßig einen Cache-Header (`Cache-Control: max-age=600`, d. h. bis zu 10 Minuten). Zudem speichert der Webbrowser statische Dateien im Cache.
   - Um die neueste Version sofort zu sehen, führe im Browser einen **Hard Refresh** durch:
     - **Windows / Linux:** `Strg + F5` oder `Strg + Shift + R`
     - **Mac:** `Cmd + Shift + R`
     - **Mobilgeräte:** Browser-Tab schließen und neu aufrufen bzw. Browser-Verlauf/Cache leeren.

Falls der Deploy-Workflow mit einer Fehlermeldung bezüglich GitHub Pages fehlschlägt:
1. Navigiere im GitHub-Repository zu **Settings** -> **Pages**.
2. Wähle unter **Source** die Option **GitHub Actions** aus.
3. Führe den Workflow erneut aus (**Actions** -> **Deploy Spiel to GitHub Pages** -> **Run workflow**).