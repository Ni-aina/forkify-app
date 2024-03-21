import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";
import { MODAL_CLOSE_SEC } from "./config";
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const controllerRecipe = async function() {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 1 Loading recipe
    await model.loadRecipe(id);

    const { recipe } = model.state;

    resultsView.update(model.getSearchResultsPage());

    // 2 Rendering recipe
    recipeView.render(recipe)
    
  } catch (err) {
     recipeView.renderError();
  }
}

export const controllerSearchResults = async ()=> {
  try {
    resultsView.renderSpinner();
    
    const query = searchView.getQuery();

    if (!query) return;

    await model.loadSearchResults(query);

    resultsView.render(model.getSearchResultsPage());  

    paginationView.render(model.state.search);

  } catch (err) {
    throw err;
  }
}

const controlPagination = (goToPage)=> {
  resultsView.render(model.getSearchResultsPage(goToPage));  
  paginationView.render(model.state.search);
}

const controlServings = (newServings)=> {

  model.updateServings(newServings);

  recipeView.update(model.state.recipe)

}

const controlAddBookMark = function() {
  if (!model.state.recipe.bookMarked)
    model.addBookMark(model.state.recipe);
  else if (model.state.recipe.bookMarked)
    model.deleteBookMark(model.state.recipe.id);
  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookMarks);
}

const controlBookmarks = ()=> {
  bookmarksView.render(model.state.bookMarks);
}

const controlAddRecipe = async (newRecipe)=> {
  try {
    // Show spinner
    addRecipeView.renderSpinner();
    // Upload recipe
    await model.uploaddRecipe(newRecipe);
    // Show recipe
    recipeView.render(model.state.recipe);
    //Show success message
    addRecipeView.renderMessage();
    //Render bookmark view
    bookmarksView.render(model.state.bookMarks);
    //Changer ID URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // Close form
    setTimeout(()=> {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000)
  } catch (err) {
    addRecipeView.renderError(err);
  }
}

const init = ()=> {
  bookmarksView.addHandlerLoad(controlBookmarks);
  recipeView.addHandlerRender(controllerRecipe);
  recipeView.addHandlerUpdate(controlServings);
  recipeView.addHandlerAddBookMark(controlAddBookMark);
  searchView.addHandlerSearch(controllerSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}

init();