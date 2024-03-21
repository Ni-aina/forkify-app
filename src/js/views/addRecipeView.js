import View from "./view";

class addRecipe  extends View {
    _parentElement = document.querySelector('.upload');
    _message = "Recipe was successfully uploaded :)";
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');

    constructor () {
        super();
        this._addHandlerShowWindow();
        this._addHandlerHiddenWindow();
    }

    toggleWindow() {
        this._window.classList.toggle('hidden');
        this._overlay.classList.toggle('hidden');
    }

    _addHandlerShowWindow() {
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }

    _addHandlerHiddenWindow() {
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    }

    addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit', function(e) {
            e.preventDefault();
            const dataArray = [...new FormData(this)];
            const data = Object.fromEntries(dataArray);
            handler(data);
        });
    }

    _generateMarkup() {}
   
}

export default new addRecipe();