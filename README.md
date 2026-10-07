# Mode-Hindernisrennen-

Ein 2D-Endless-Runner-Spiel mit integriertem Charakter-Editor.

## Deployment / GitHub Pages

Der GitHub Actions Workflow in `.github/workflows/deploy.yml` baut das Projekt automatisch und veröffentlicht es auf GitHub Pages.

Falls der Deploy-Workflow mit einer Fehlermeldung bezüglich GitHub Pages fehlschlägt:
1. Navigiere im GitHub-Repository zu **Settings** -> **Pages**.
2. Wähle unter **Source** die Option **GitHub Actions** aus.
3. Führe den Workflow erneut aus (**Actions** -> **Deploy Spiel to GitHub Pages** -> **Run workflow**).