const getAllKeys = () => {
  const container = document.querySelector('.kbd-form');
  const keys = container.querySelectorAll('button');
  // console.log(keys, keys[47].value);
  return keys;
};

class Keyboard {

  constructor() {
  /*
    this._eventHandlers = {
      oninput: null,
      onclose: null
    };
  */
    this._hidden = true;
    this._field = document.querySelector('.writing-field');
    this._container = document.querySelector('.keyboard');
    this._keys = getAllKeys();
    this._hideBtn = document.querySelector('.hide');
    this._lang = 'en';
    this._caps = false;
    this._text = '';
  }

  init() {
    // console.log('render and init keyboard!');
    this._hideBtn.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.toggleKbd();
    });
    this._field.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.openKbd();
    });

    this._keys.forEach((item) => item.addEventListener('click', (evt) => {
      evt.preventDefault();
      const value = item.value;
      console.log(value);
      if (value === 'capslock') {
        const capsKey = document.querySelector('.capslock');
        this.toggleCapsLock(capsKey);
      } else if (value === 'lang') {
        const langKey = document.querySelector('.language');
        this.changeLang(langKey);
      } else if (value === 'enter') {
        this.printSymbol(`\n`);
      } else if (value === 'backspace') {
        this.cutLastSymbol();
      } else {
        this.printSymbol(value);
      }
    }));
  }

  printSymbol(symbol) {
    this._text += symbol;
    this._field.innerHTML = this._text;
  }

  cutLastSymbol() {
    this._text = this._text.slice(0, -2);
  }

  getPressedKeyValue(key) {
    const value = key.value;
    console.log(value);
    return value;
  }

  toggleCapsLock(key) {
    this._caps = !this._caps;
    key.classList.toggle('active');
    const letters = document.querySelectorAll('.letter');
    if (!!this._caps) {
      this.lettersToCaps(letters);
    } else if (!this._caps) {
      this.lettersToLower(letters);
    }
  }

  changeLang(key) {
    key.classList.toggle('active');
    if (this._lang === 'ru') {
      this._lang = 'en'; 
      key.textContent = 'EN';
    } else if (this._lang === 'en') {
      this._lang = 'ru';
      key.textContent = 'RU';
    }
  }

  lettersToCaps(letters) {
    letters.forEach((item) => {
      item.textContent = item.textContent.toUpperCase();
      item.value = item.value.toUpperCase();
    });
  }

  lettersToLower(letters) {
    letters.forEach((item) => {
      item.textContent = item.textContent.toLowerCase();
      item.value = item.value.toLowerCase();
    });
  }

  openKbd() {
    this._hidden = false;
    this._container.classList.remove('hidden');
    this._hideBtn.textContent = 'Hide';
  }

  toggleKbd() {
    this._hidden = !this._hidden;
    this._container.classList.toggle('hidden');
    if (!!this._hidden) {
      this._hideBtn.textContent = 'Show';
    }
    if (!this._hidden) {
      this._hideBtn.textContent = 'Hide';
    }
  }

}

window.addEventListener('DOMContentLoaded', () => {
  const kbd = new Keyboard();
  kbd.init();
  // kbd.lettersToCaps();
});