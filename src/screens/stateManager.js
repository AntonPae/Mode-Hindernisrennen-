export const State = {
  EDITOR: 'EDITOR',
  BACKGROUND_SELECT: 'BACKGROUND_SELECT',
  TOWN: 'TOWN',
  HOME: 'HOME',
  ICECREAM: 'ICECREAM',
  PETSITTING: 'PETSITTING',
  GAME: 'GAME'
};

export class StateManager {
  constructor() {
    this.currentState = State.EDITOR;
    this.listeners = [];

    this.editorScreen = document.getElementById('editor-screen');
    this.bgSelectScreen = document.getElementById('bg-select-screen');
    this.townScreen = document.getElementById('town-screen');
    this.homeScreen = document.getElementById('home-screen');
    this.iceCreamScreen = document.getElementById('icecream-screen');
    this.petSittingScreen = document.getElementById('pet-sitting-screen');
    this.gameScreen = document.getElementById('game-screen');
  }

  setState(newState, payload = {}) {
    this.currentState = newState;
    this.updateUI();
    this.notifyListeners(newState, payload);
  }

  getState() {
    return this.currentState;
  }

  onStateChange(callback) {
    this.listeners.push(callback);
  }

  notifyListeners(state, payload) {
    this.listeners.forEach(cb => cb(state, payload));
  }

  updateUI() {
    if (this.editorScreen) this.editorScreen.classList.add('hidden');
    if (this.bgSelectScreen) this.bgSelectScreen.classList.add('hidden');
    if (this.townScreen) this.townScreen.classList.add('hidden');
    if (this.homeScreen) this.homeScreen.classList.add('hidden');
    if (this.iceCreamScreen) this.iceCreamScreen.classList.add('hidden');
    if (this.petSittingScreen) this.petSittingScreen.classList.add('hidden');
    if (this.gameScreen) this.gameScreen.classList.add('hidden');

    if (this.editorScreen) this.editorScreen.classList.remove('active');
    if (this.bgSelectScreen) this.bgSelectScreen.classList.remove('active');
    if (this.townScreen) this.townScreen.classList.remove('active');
    if (this.homeScreen) this.homeScreen.classList.remove('active');
    if (this.iceCreamScreen) this.iceCreamScreen.classList.remove('active');
    if (this.petSittingScreen) this.petSittingScreen.classList.remove('active');
    if (this.gameScreen) this.gameScreen.classList.remove('active');

    switch (this.currentState) {
      case State.EDITOR:
        if (this.editorScreen) {
          this.editorScreen.classList.remove('hidden');
          this.editorScreen.classList.add('active');
        }
        break;
      case State.BACKGROUND_SELECT:
        if (this.bgSelectScreen) {
          this.bgSelectScreen.classList.remove('hidden');
          this.bgSelectScreen.classList.add('active');
        }
        break;
      case State.TOWN:
        if (this.townScreen) {
          this.townScreen.classList.remove('hidden');
          this.townScreen.classList.add('active');
        }
        break;
      case State.HOME:
        if (this.homeScreen) {
          this.homeScreen.classList.remove('hidden');
          this.homeScreen.classList.add('active');
        }
        break;
      case State.ICECREAM:
        if (this.iceCreamScreen) {
          this.iceCreamScreen.classList.remove('hidden');
          this.iceCreamScreen.classList.add('active');
        }
        break;
      case State.PETSITTING:
        if (this.petSittingScreen) {
          this.petSittingScreen.classList.remove('hidden');
          this.petSittingScreen.classList.add('active');
        }
        break;
      case State.GAME:
        if (this.gameScreen) {
          this.gameScreen.classList.remove('hidden');
          this.gameScreen.classList.add('active');
        }
        break;
    }
  }
}
