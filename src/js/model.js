import { API_URL, KEY } from "./config";
import { AJAX } from "./helpers";

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: 10
    },
    bookMarks: []
}

const createRecipeObject = (data)=> {
    let { data: { recipe } } = data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && {key: recipe.key})
    }
}

export const loadRecipe = async function(id) {
    try {        
        const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
        
        state.recipe = createRecipeObject(data);

        if (state.bookMarks.some(bookMark => bookMark.id === id))
            state.recipe.bookMarked = true;
        else
            state.recipe.bookMarked = false;
    } catch (err) {
        throw err;
    }
}

export const loadSearchResults = async (query) => {
    try {
        state.search.query = query;
        const { data } = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
        state.search.results = data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && {key: rec.key})
            }
        });
        state.search.page = 1;
    } catch (err) {
        throw err;
    }
}

export const getSearchResultsPage = (page = state.search.page)=> {
    state.search.page = page;
    const start = (page-1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;
    return state.search.results.slice(start, end);
}

export const updateServings = (newServings)=> {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    });
    state.recipe.servings = newServings;
}

const persistBookMarks = ()=> {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookMarks));
}

export const addBookMark = (recipe)=> {
    state.bookMarks.push(recipe);

    if (recipe.id === state.recipe.id) state.recipe.bookMarked = true; 

    persistBookMarks();
}

export const deleteBookMark = function(id) {
    const index = state.bookMarks.findIndex(el => el.id === id);
    state.bookMarks.splice(index, 1);

    if (id === state.recipe.id) state.recipe.bookMarked = false; 

    persistBookMarks();
}

export const uploaddRecipe = async (newRecipe)=> {
    try {
        const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith('ingredient') 
        && entry[1] !== "").map(ing => {
            const ingArray = ing[1].split(',').map(el => el.trim());
            if (ingArray.length !== 3)
                throw new Error("Wrong ingredient format, please input correct format!");
            const [ quantity, unit, description ] = ingArray;
            return { quantity: quantity ? +quantity: null, unit, description }
        })
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients
        }
        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        addBookMark(state.recipe)
    } catch (err) {
        throw err;
    }
} 

const init = ()=> {
    const storage = localStorage.getItem('bookmarks');

    if (storage) state.bookMarks = JSON.parse(storage);
}

init();