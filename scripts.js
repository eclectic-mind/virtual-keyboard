const getAllKeys = () => {
  const container = document.querySelector('.kbd-form');
  const keys = container.querySelectorAll('button');
  return keys;
};

/* 
const getCursorPosition = (element) => {
  element.focus();
  if (element.selectionStart) {
    return element.selectionStart;
  }
};
*/
/* 
getCursorPosition = (elem) => {
  let position = 0;
  if (document.selection) {
    elem.focus();
    let sel = document.selection.createRange();
    sel.moveStart ('character', -elem.value.length);
    position = sel.textContent.length;
  } else if (elem.selectionStart || elem.selectionStart === '0') {
    position = elem.selectionStart;
  }
  return position;
};
*/

getCursorPosition = (elem) => {
  if (document.selection) {
      elem.focus();
      let range = document.selection.createRange();
      let rangeLength = range.textContent.length;
      range.moveStart('character', -elem.value.length);
      let start = range.textContent.length - rangeLength;
      return {
          'start': start,
          'end': start + rangeLength
      };
  } else if (elem.selectionStart || elem.selectionStart == '0') {
      return {
          'start': elem.selectionStart,
          'end': elem.selectionEnd
      };
  } else {
      return {
          'start': 0,
          'end': 0
      };
  }
};

setCursorPosition = (elem, position) => {
  if (elem.setSelectionRange) {
      elem.focus();
      elem.setSelectionRange(position.start, position.end);
  } else if (elem.createTextRange) {
      let range = elem.createTextRange();
      range.collapse(true);
      range.moveEnd('character', position.end);
      range.moveStart('character', position.start);
      range.select();
  }
};    
class Keyboard {

  constructor() {

    this._hidden = true;
    this._field = document.querySelector('.writing-field');
    this._container = document.querySelector('.keyboard');
    this._keys = getAllKeys();
    this._letters = document.querySelectorAll('.letter');
    this._hideBtn = document.querySelector('.hide');
    this._lang = 'en';
    this._caps = false;
    this._text = '';
    this._position = this._field.textContent.length - 1;
  }

  init() {
    this._hideBtn.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.toggleKbd();
    });
    this._field.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.openKbd();
      this._position = getCursorPosition(this._field);
      console.log(this._position);
      setCursorPosition(this._field, this._position);
    });

    this._keys.forEach((item) => item.addEventListener('click', (evt) => {
      evt.preventDefault();
      this._position = getCursorPosition(this._field);
      setCursorPosition(this._field, this._position);
      // const actualPos = getCursorPosition(this._field);
      // console.log(actualPos);
      const value = item.value;
      if (value === 'capslock') {
        const capsKey = document.querySelector('.capslock');
        this.toggleCapsLock(capsKey);
      } else if (value === 'lang') {
        const langKey = document.querySelector('.language');
        this.changeLang(langKey);
      } else if (value === 'enter') {
        this.printSymbol(`\n`);
      } else if (value === 'backspace') {
        this.cutLastSymbol(this._position.start, this._position.end);
      } else if (value === 'quote') {
        this.printSymbol(`"`);
      } else {
        this.printSymbol(value);
      }
    }));

    document.addEventListener('keydown', (evt) => {
      evt.preventDefault();
      this._position = getCursorPosition(this._field);
      setCursorPosition(this._field, this._position);
      // const actualPos = getCursorPosition(this._field);
      // console.log(actualPos);
      const value = evt.key;
      if (value === 'Enter') {
        this.printSymbol(`\n`);
      } else if (value === 'CapsLock') {
        const capsKey = document.querySelector('.capslock');
        this.toggleCapsLock(capsKey);
      } else if (value === 'Backspace') {
        this.cutLastSymbol(this._position.start, this._position.end);
      } else if ((evt.shiftKey && evt.altKey) || (evt.shiftKey && evt.elemKey)) {
        const langKey = document.querySelector('.language');
        this.changeLang(langKey);
      } else if (value === 'Tab' || value === 'Shift' || value === 'Alt' || value === 'Control' || value === 'Esc' || value === 'NumLock' || value === 'ArrowUp' || value === 'ArrowLeft' || value === 'ArrowRight' ||  value === 'ArrowDown' || value === 'Clear' || value === 'PageUp' || value === 'PageDown' || value === 'End' || value === 'Home' || value === 'Delete' || value === 'Insert') {
        return;
      } else if (value === 'F1' || value === 'F2' || value === 'F3' || value === 'F4' || value === 'F5' || value === 'F6' || value === 'F7' || value === 'F8' || value === 'F9' || value === 'F10' || value === 'F11' || value === 'F12') {
        return;
      } else {
        this.printSymbol(value);
      } 
    });
  }

  printSymbol(symbol) {
    console.log(this._text, this._position);
    this._text = this._text.slice(0, this._position.start) + symbol + this._text.slice(this._position.end);
    // this._text += symbol;
    // console.log(this._text);
    this._field.innerHTML = this._text;
    this._position = getCursorPosition(this._field);
    setCursorPosition(this._field, this._position);
  }

  cutLastSymbol(start = this._text.length - 1, end = this._text.length) {
    this._text = this._text.slice(0, start) + this._text.slice(end);
    // this._text = this._text.slice(0, -1);
  }

  getPressedKeyValue(key) {
    const value = key.value;
    return value.toString();
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
      this._letters.forEach((item) => item.classList.toggle('invisible'));
    } else if (this._lang === 'en') {
      this._lang = 'ru';
      key.textContent = 'RU';
      this._letters.forEach((item) => item.classList.toggle('invisible'));
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
});