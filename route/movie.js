const Movie = require('../models/movie')
const auth = require('../middleware/auth');

app.post('/movie', auth, async (req, res) => {
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
        const movies = await Movie.find();
        res.status(200).send(movies);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
