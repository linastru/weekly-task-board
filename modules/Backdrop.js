class Backdrop {
  backdropEl;
  finishTaskEditCB;

  constructor(finishTaskEditCB) {
    this.finishTaskEditCB = finishTaskEditCB;
  }

  render() {
    this.backdropEl = document.createElement('div');
    this.backdropEl.classList.add('backdrop');
    this.backdropEl.addEventListener('click', this.clickHandler.bind(this));
    this.backdropEl.style.height = document.documentElement.scrollHeight + 'px';
    this.backdropEl.style.width = document.documentElement.scrollWidth + 'px';
    return this.backdropEl;
  }

  clickHandler() {
    this.finishTaskEditCB();
  }

  remove() {
    this.backdropEl.remove();
  }
}

export { Backdrop }