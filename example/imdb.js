const {
    Imdb
} = require('simplegrabber')

const imdb = new Imdb()

async function starts() {
    const data = await imdb.getTopRatedMovies({
        shortDownloadUrl: false,
        pages: 10
    })
    console.log(data)
}

starts()