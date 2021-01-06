const getAllKeys = () => {
  const container = document.querySelector('.kbd-form');
  const keys = container.querySelectorAll('button');
  return keys;
};

getCursorPosition = (elem) => {
  if (elem.selection) {
      elem.focus();
      let range = elem.selection.createRange();
      let rangeLength = range.textContent.length > 0 ? range.textContent.length : 1;
      // console.log(range, rangeLength, elem.textContent.length, range.textContent.length);
      range.moveStart('character', -elem.textContent.length);
      let start = range.textContent.length - rangeLength;
      // console.log('начало и конец выделения-1 ', start, start + rangeLength);
      return {
          'start': start,
          'end': start + rangeLength
      };
  } else if (elem.selectionStart || elem.selectionStart === '0') {
    // console.log('начало и конец выделения-2 ', elem.selectionStart, elem.selectionEnd);
      return {
          'start': elem.selectionStart,
          'end': elem.selectionEnd
      };
  } else {
    // console.log('начало и конец без выделения ', elem.textContent.length);
      return {
          'start': elem.textContent.length,
          'end': elem.textContent.length
      };
  }
};

setCursorPosition = (elem, position) => {
  if (elem.setSelectionRange) {
      elem.focus();
      elem.setSelectionRange(position.start, position.end);
     // console.log('ставим курсор в позицию: ', position);
  } else if (elem.createTextRange) {
      let range = elem.createTextRange();
      range.collapse(true);
      range.moveEnd('character', position.end);
      range.moveStart('character', position.start);
      range.select();
      // console.log('ставим курсор в позицию с выделением текста: ', position);
  }
};    
class Keyboard {

  constructor() {
    this._hidden = true;
    this._field = document.querySelector('.writing-field');
    this._container = document.querySelector('.keyboard');
    this._letters = document.querySelectorAll('.letter');
    this._hideBtn = document.querySelector('.hide');
    this._capsKey = document.querySelector('.capslock');
    this._langKey = document.querySelector('.language');
    this._keys = getAllKeys();
    this._lang = 'en';
    this._caps = false;
    this._text = this._field.textContent;
    // this._position = this._field.textContent.length - 1;
    this._position = {
      'start': 0,
      'end': 0
    };
  }

  init() {
    this._hideBtn.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.toggleKbd();
    });
    this._field.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.openKbd();
    });

    // this._position = getCursorPosition(this._field);
      // console.log(this._position);
    // setCursorPosition(this._field, this._position);

    this._keys.forEach((item) => item.addEventListener('click', (evt) => {
      evt.preventDefault();
      // this._position = getCursorPosition(this._field);
      // setCursorPosition(this._field, this._position);
      const value = item.value;
      if (value === 'capslock') {
        this.toggleCapsLock(this._capsKey);
      } else if (value === 'lang') {
        this.changeLang();
      } else if (value === 'enter') {
        this.printSymbol(`\n`);
      } else if (value === 'backspace') {
        this.cutLastSymbol();
      } else if (value === 'quote') {
        this.printSymbol(`"`);
      } else {
        this.printSymbol(value);
      }
    }));

    document.addEventListener('keydown', (evt) => {
      evt.preventDefault();
      // this._position = getCursorPosition(this._field);
      // setCursorPosition(this._field, this._position);
      const value = evt.key;
      if (value === 'Enter') {
        this.printSymbol(`\n`);
      } else if (value === 'CapsLock') {
        this.toggleCapsLock(this._capsKey);
      } else if (value === 'Backspace') {
        this.cutLastSymbol();
      } else if ((evt.shiftKey && evt.altKey) || (evt.shiftKey && evt.ctrlKey)) {
        this.changeLang();
      } else if (value === 'Tab' || value === 'Shift' || value === 'Alt' || value === 'Control' || value === 'Esc' || value === 'NumLock' || value === 'ArrowUp' || /* value === 'ArrowLeft' || value === 'ArrowRight' || */ value === 'ArrowDown' || value === 'Clear' || value === 'PageUp' || value === 'PageDown' || value === 'End' || value === 'Home' || value === 'Delete' || value === 'Insert') {
        return;
      } else if (value === 'F1' || value === 'F2' || value === 'F3' || value === 'F4' || value === 'F5' || value === 'F6' || value === 'F7' || value === 'F8' || value === 'F9' || value === 'F10' || value === 'F11' || value === 'F12') {
        return;
      } else if (value === 'ArrowLeft') {
        this._position = getCursorPosition(this._field);
        this._position.start -= 1;
        this._position.end -= 1;
        setCursorPosition(this._field, this._position);
      } else if (value === 'ArrowRight') {
        this._position = getCursorPosition(this._field);
        this._position.start += 1;
        this._position.end += 1;
        setCursorPosition(this._field, this._position);
      } else {
        this.printSymbol(value);
      } 
    });
  }

  printSymbol(symbol) {
    this._position = getCursorPosition(this._field);
    setCursorPosition(this._field, this._position);
    // console.log('до добавления символа: ', this._text, this._position);
    this._text = this._text.slice(0, this._position.start) + symbol + this._text.slice(this._position.end);
    this._field.textContent = this._text;
    this._position = getCursorPosition(this._field);
    setCursorPosition(this._field, this._position);
    // console.log('после добавления символа: ', this._text, this._position);
  }

  cutLastSymbol() {
    // const start = this._text.length - 1;
    // const end = this._text.length;
    this._position = getCursorPosition(this._field);
    setCursorPosition(this._field, this._position);
    // console.log('откуда и докуда вырезаем? ', this._position.start, this._position.end, this._field.textContent, this._text);
    // if (this._position.start === this._position.end) {
      // this._text = this._text.slice(0, -1);
    if ((this._position.start === this._text.length - 1) && (this._position.end === this._text.length - 1)) {
      this._text = this._text.slice(0, -1);
    } else {
      this._text = this._text.slice(0, this._position.start) + this._text.slice(this._position.end);
    }  
    this._position = getCursorPosition(this._field);
    setCursorPosition(this._field, this._position);
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

  changeLang() {
    this._langKey.classList.toggle('active');
    if (this._lang === 'ru') {
      this._lang = 'en'; 
      this._langKey.textContent = 'EN';
      this._letters.forEach((item) => item.classList.toggle('invisible'));
    } else if (this._lang === 'en') {
      this._lang = 'ru';
      this._langKey.textContent = 'RU';
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