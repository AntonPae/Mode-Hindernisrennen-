export class ControlsManager {
  constructor() {
    this.keys = {
      left: false,
      right: false,
      duck: false,
      jump: false,
      ability: false
    };

    this.jumpPressed = false;
    this.abilityPressed = false;

    this.initKeyboard();
    this.initTouch();
  }

  initKeyboard() {
    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          this.keys.left = true;
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          this.keys.right = true;
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          this.keys.duck = true;
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
        case ' ':
          if (!this.keys.jump) this.jumpPressed = true;
          this.keys.jump = true;
          e.preventDefault();
          break;
        case 'e':
        case 'E':
        case 'Shift':
          if (!this.keys.ability) this.abilityPressed = true;
          this.keys.ability = true;
          break;
      }
    });

    window.addEventListener('keyup', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          this.keys.left = false;
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          this.keys.right = false;
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          this.keys.duck = false;
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
        case ' ':
          this.keys.jump = false;
          break;
        case 'e':
        case 'E':
        case 'Shift':
          this.keys.ability = false;
          break;
      }
    });
  }

  initTouch() {
    const bindButton = (id, keyName, triggerPress = false) => {
      const btn = document.getElementById(id);
      if (!btn) return;

      const handleStart = (e) => {
        e.preventDefault();
        if (triggerPress && !this.keys[keyName]) {
          if (keyName === 'jump') this.jumpPressed = true;
          if (keyName === 'ability') this.abilityPressed = true;
        }
        this.keys[keyName] = true;
      };

      const handleEnd = (e) => {
        e.preventDefault();
        this.keys[keyName] = false;
      };

      btn.addEventListener('touchstart', handleStart, { passive: false });
      btn.addEventListener('touchend', handleEnd, { passive: false });
      btn.addEventListener('mousedown', handleStart);
      btn.addEventListener('mouseup', handleEnd);
      btn.addEventListener('mouseleave', handleEnd);
    };

    bindButton('touchLeft', 'left');
    bindButton('touchRight', 'right');
    bindButton('touchDuck', 'duck');
    bindButton('touchJump', 'jump', true);
    bindButton('touchAbility', 'ability', true);
  }

  consumeJumpPress() {
    if (this.jumpPressed) {
      this.jumpPressed = false;
      return true;
    }
    return false;
  }

  consumeAbilityPress() {
    if (this.abilityPressed) {
      this.abilityPressed = false;
      return true;
    }
    return false;
  }

  reset() {
    this.keys.left = false;
    this.keys.right = false;
    this.keys.duck = false;
    this.keys.jump = false;
    this.keys.ability = false;
    this.jumpPressed = false;
    this.abilityPressed = false;
  }
}
