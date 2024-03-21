import View from "./view";
import previewView from "./previewView";

class Bookmarks  extends View {
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it :)";
    _message = "";

    addHandlerLoad(handler) {
        window.onload = ()=> handler()
    }

    _generateMarkup() {
        return this._data.map(bookMark => previewView._generateMarkup(bookMark, false)).join('');
    }
   
}

export default new Bookmarks();