import axios from 'axios';

const API_URL = 'https://api.spoonacular.com/recipes';
const API_KEY = process.env.REACT_APP_API_KEY

const searchRecipe = async (keyword,cuisines) => {
    try {
        const response = await axios.get(`${API_URL}/complexSearch`, {
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                apiKey: API_KEY,
                query: keyword,
                cuisine : cuisines.join(",")
            }
        });
        return response.data; 
    } catch (error) {
        console.error("Error searching for recipes:", error);
        return []; 
    }
};

const getRecipe = async (recipeId) => {
    try {
        const response = await axios.get(`${API_URL}/${recipeId}/information`, {
             headers: {
                'Content-Type': 'application/json',
            },
            params: {
                apiKey: API_KEY
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching recipe details:", error);
        return false
    }
};

const ApiServices = {
    getRecipe,
    searchRecipe
};

export default ApiServices;