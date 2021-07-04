const {
    Imdb
} = require('../build/index')

const imdb = new Imdb()

async function starts() {
    const data = await imdb.getTopRatedMovies(10)
    console.log(data)
}

starts()