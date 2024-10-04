const Movie = require('../models/movie')
const auth = require('../middleware/auth');
const { getPopularMovies, searchMovies, getMovieDetails } = require('../tmdb');

app.post('/movies', auth, async (req, res) => {
    const {title, description, genre, releaseDate} = req.body;

    try {
        const movie = new Movie({
            title,
            description,
            genre,
            releaseDate
        })
        await movie.save()
        res.send('Movie created')   
        res.status(201).json(movie)
    } catch (error) {
        console.error(error.message);
        if (err.code === 11000) {
            // Handle duplicate key error (username or email)
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        res.status(500).send('Server Error')
    }
});

app.get('/movies',auth, async (req, res) => {
    try {
        const movie = await Movie.find();
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/movies/:id', auth, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ msg: 'Movie not found' });
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update a Movie
app.put('/movies/:id', auth, async (req, res) => {
    const { title, description, genre, releaseDate } = req.body;
    
    const updatedMovie = { title, description, genre, releaseDate };
    
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, updatedMovie, { new: true });
        if (!movie) return res.status(404).json({ msg: 'Movie not found' });
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Delete a Movie
app.delete('/movies/:id', auth, async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) return res.status(404).json({ msg: 'Movie not found' });
        res.status(200).json({ msg: 'Movie deleted' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

app.get('/movies/search', auth, async (req, res) => {
    const { query } = req.query;  // Get search query from URL

    try {
        const movies = await Movie.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { genre: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        });
        res.status(200).json(movies);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

app.get('/movies', auth, async (req, res) => {
    const { page = 1, limit = 10 } = req.query;  // Default values

    try {
        const movies = await Movie.find()
            .limit(limit * 1)  // Limit the number of results
            .skip((page - 1) * limit);  // Skip to the right page

        const count = await Movie.countDocuments();  // Get total count of movies
        res.status(200).json({
            movies,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Route to fetch popular movies from TMDB
app.get('/tmdb/popular', auth, async (req, res) => {
    try {
        const movies = await getPopularMovies();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch popular movies' });
    }
});

// Route to search movies on TMDB by title
app.get('/tmdb/search', auth, async (req, res) => {
    const { query } = req.query;
    
    if (!query) return res.status(400).json({ message: 'Query is required' });

    try {
        const results = await searchMovies(query);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: 'Failed to search for movies' });
    }
});

// Route to get details of a specific movie by ID from TMDB
app.get('/tmdb/movie/:id', auth, async (req, res) => {
    const { id } = req.params;
    
    try {
        const movie = await getMovieDetails(id);
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch movie details' });
    }
});

app.get('/tmdb/movie/:id', auth, async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch movie details from TMDB
        const movie = await getMovieDetails(id);

        // Check if the movie already exists in MongoDB
        let existingMovie = await Movie.findOne({ tmdbId: id });

        if (!existingMovie) {
            // Save the movie to your database if it doesn't exist
            const newMovie = new Movie({
                title: movie.title,
                description: movie.overview,
                genre: movie.genres.map(g => g.name).join(', '),
                releaseDate: movie.release_date,
                tmdbId: id,  // Store the TMDB ID for future reference
            });

            existingMovie = await newMovie.save();
        }

        res.status(200).json(existingMovie);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch or save movie details' });
    }
});
