const axios = require('axios');
const movieModel = require('./movieModel');
//const { param } = require('./movieRoutes');

const with_genres = {
    "action": 28,
    "adventure": 12,
    "animation": 16,
    "comedy": 35,
    "crime": 80,
    "documentary": 99,
    "drama": 18,
    "family": 10751,
    "fantasy": 14,
    "history": 36,
    "horror": 27,
    "music": 10402,
    "mystery": 9648,
    "romance": 10749,
    "science fiction": 878,
    "tv": 10770,
    "thriller": 53,
    "war": 10752,
    "western": 37
};


function setUndefinedToEmptyStrings(param) {
    if (param === undefined) {
        return '';
    } else {
        return param;
    }
}

// Etsi elokuvia hakutermin perusteella
async function searchMovies(req, res) {
    const { query, page, year, language } = req.query;
    const apiKey = process.env.TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&page=${page}&year=${year}&language=${language}`;

    try {
        const response = await axios.get(url);
        const data = response.data;
        const movies = data.results.map(result => new movieModel(
            result.id,
            result.title,
            result.poster_path
        )).filter(movie => movie.poster_path !== null);
        res.json(movies);
    } catch (error) {
        console.error('Virhe elokuvien hakemisessa:', error);
        res.status(500).json({ message: 'Virhe palvelimella' });
    }
}

// Etsi elokuvia erilaisilla parametreilla, kuten suosituimmuuden perusteella
async function discoverMovies(req, res) {
    const { sort_by, page, year, language, genre } = req.query;
    const apiKey = process.env.TMDB_API_KEY;
    let genreId = '';

    if (genre === 'all' || genre === undefined) {
        genreId = '';
    } else {
        genreId = with_genres[genre];
    }

    console.log(setUndefinedToEmptyStrings(genre));
    paramYear = setUndefinedToEmptyStrings(year);
    paramLanguage = setUndefinedToEmptyStrings(language);
    paramPage = setUndefinedToEmptyStrings(page);
    paramSort_by = setUndefinedToEmptyStrings(sort_by);

    console.log('genreId:', genreId);
    console.log('sort_by:', paramSort_by);
    console.log('page:', paramPage);
    console.log('year:', paramYear);
    console.log('language:', paramLanguage);
    console.log('genre:', genre);

    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&sort_by=${paramSort_by}&page=${paramPage}&primary_release_year=${paramYear}&language=${paramLanguage}`;

    try {
        const response = await axios.get(url);
        const data = response.data;
        const movies = data.results.map(result => new movieModel(
            result.id,
            result.title,
            result.poster_path
        )).filter(movie => movie.poster_path !== null);
        res.json(movies);
    } catch (error) {
        console.error('Virhe elokuvien löytämisessä:', error);
        res.status(500).json({ message: 'Virhe palvelimella' });
    }
}

// Hae elokuva ID:n perusteella
async function getMovieById(req, res) {
    const apiKey = process.env.TMDB_API_KEY;
    const movieId = req.params.id;
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const movieData = response.data;
        res.json(movieData);
    } catch (error) {
        console.error('Virhe elokuvan hakemisessa:', error);
        res.status(500).json({ message: 'Virhe palvelimella' });
    }
}

module.exports = {
    searchMovies,
    discoverMovies,
    getMovieById
};