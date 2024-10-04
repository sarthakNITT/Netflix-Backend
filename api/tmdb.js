require('dotenv').config();
const axios = require('axios');
const TMDB_API_KEY = process.env.API_KEY; // Replace with your API key
const BASE_URL = 'https://api.themoviedb.org/3';
if (!process.env.MONGODB_URL || !process.env.JWT_SECRET_CODE || !process.env.API_KEY) {
    console.error('Please set all environment variables');
    process.exit(1);
}


// Function to get popular movies
const getPopularMovies = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/movie/popular`, {
            params: { api_key: TMDB_API_KEY }
        });
        return response.data.results;  // Return an array of popular movies
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        throw error;
    }
};

// Function to search for movies by title
const searchMovies = async (query) => {
    try {
        const response = await axios.get(`${BASE_URL}/search/movie`, {
            params: { api_key: TMDB_API_KEY, query }
        });
        return response.data.results;  // Return the search results
    } catch (error) {
        console.error('Error searching for movies:', error);
        throw error;
    }
};

// Get details of a single movie by ID
const getMovieDetails = async (movieId) => {
    try {
        const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
            params: { api_key: TMDB_API_KEY }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        throw error;
    }
};

module.exports = {
    getPopularMovies,
    searchMovies,
    getMovieDetails
};
