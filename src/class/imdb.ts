import axios from "axios"
import cheerio from 'cheerio'
import { extraOptions } from '../lib/interface'
import { shortlinks } from '../lib/helper'

interface searchOptions {
    shortUrl?: boolean
}

interface results {
    title: string,
    posterUrl: string,
    ratings: string,
    releaseYears: string
}

class Imdb {
    /**
     * Search movie details by title
     * @param title 
     * @param extraOptions 
     * @returns List movie or film
     */
    async searchMovieDetails(title: string, extraOptions?: searchOptions) {
        const { shortUrl } = extraOptions
        const html = await axios.get(`https://www.imdb.com/search/title/?title=${title}&title_type=movie`)
        const $ = cheerio.load(html.data)
        const results: results[] = []
        const judul = []
        $('div.lister-item.mode-advanced > div:nth-child(3) > h3 > a').get().map(rest => {
            judul.push(rest.children[0])
        })
        const releaseYears = []
        $('div.lister-item.mode-advanced > div:nth-child(3) > h3 > span:nth-child(3)').get().map(rest => {
            releaseYears.push(rest.children[0])
        })
        const poster = [] 
        $('div.lister-item.mode-advanced > div:nth-child(2) > a > img').get().map(rest => {
            poster.push(rest.attribs)
        })
        const durations = []
        $('div.lister-item.mode-advanced > div:nth-child(3) > p:nth-child(2) > span.runtime').get().map(rest => {
            durations.push(rest.children[0])
        })
        const genre = []
        $('div.lister-item.mode-advanced > div:nth-child(3) > p:nth-child(2) > span.genre').get().map(rest => {
            genre.push(rest.children[0])
        })
        const ratings = []
        $('div.lister-item.mode-advanced > div:nth-child(3) > div.ratings-bar > div:nth-child(1) > strong').get().map(rest => {
            ratings.push(rest.children[0])
        })
        const description = []
        $('div.lister-item.mode-advanced > div:nth-child(3) > p.text-muted').get().map(rest => {
            description.push(rest.children[0])
        })
        const length = judul.length > 10 ? 10 : judul.length
        for (let i = 0; i < length; i++) {
            const releaseTahun = releaseYears[i].data.replace('(', '').replace(')', '')
            let descriptions = '';
            try {
                descriptions += description[i].data.split('\n')[1].trim()
            } catch (error) {
                descriptions += 'Unknown'
            }
            let genres = ''
            try {
                genres += genre[i].data.replace(/\s/g, '')
            } catch (error) {
                genres += 'Unknown'
            }
            let rating = ''
            try {
                rating += ratings[i].data
            } catch (error) {
                rating += 'Unknown'
            }
            const obj = {
                title: judul[i].data,
                posterUrl: shortUrl ? poster[i].src : shortlinks(poster[i].src),
                releaseYears: releaseTahun,
                genre: genres,
                ratings: rating,
                description: descriptions
            }
            results.push(obj)
        }
        return results
    }

    /**
     * Get top rated movies
     * @param pages total page results
     * @returns {string[]} List film
     */
    async getTopRatedMovies(options?: extraOptions) {
        let { pages, shortUrl, shortUrlName } = options
        if (!pages) {
            pages = 30
        }
        const html = await axios.get('https://www.imdb.com/chart/top/')
        const $ = cheerio.load(html.data)
        const results: results[] = []
        const title = []
        const thumbs = []
        const ratings = []
        const releaseDates = []
        $('td.titleColumn > a').get().map(rest => {
            title.push(rest.attribs.title)
        })
        $('td.titleColumn > span').get().map(rest => {
            releaseDates.push(rest.children[0])
        })
        $('td.ratingColumn.imdbRating > strong').get().map(rest => {
            ratings.push(rest.children[0])
        })
        $('td.posterColumn > a > img').get().map(rest => {
            thumbs.push(rest.attribs)
        })
        if (pages >= title.length) {
            pages = title.length
        } else if (title.length < pages) {
            pages = title.length
        }
        for (let i = 0; i < pages; i++) {
            const thumbsUrl = shortUrl ? await shortlinks(thumbs[i].src, shortUrlName) : thumbs[i].src
            const obj = { 
                title: title[i],
                posterUrl: thumbsUrl,
                ratings: ratings[i].data,
                releaseYears: releaseDates[i].data.replace('(', '').replace(')', ''),
            }
            results.push(obj)
        }
        return results
    }

    /**
     * Get popular movies
     * @param options 
     * @returns List popular movies / film
     */
    async getPopularMovies(options?: extraOptions) {
        let { pages, shortUrl, shortUrlName } = options
        if (!pages) {
            pages = 30
        }
        const html = await axios.get('https://www.imdb.com/chart/moviemeter')
        const $ = cheerio.load(html.data)
        const results: results[] = []
        const title = []
        const thumbs = []
        const ratings = []
        const releaseDates = []
        $('td.titleColumn > a').get().map(rest => {
            title.push(rest.attribs.title)
        })
        $('td.titleColumn > span').get().map(rest => {
            releaseDates.push(rest.children[0])
        })
        $('td.ratingColumn.imdbRating > strong').get().map(rest => {
            ratings.push(rest.children[0])
        })
        $('td.posterColumn > a > img').get().map(rest => {
            thumbs.push(rest.attribs)
        })
        if (pages >= title.length) {
            pages = title.length
        } else if (title.length < pages) {
            pages = title.length
        }
        for (let i = 0; i < pages; i++) {
            const thumbsUrl = shortUrl ? await shortlinks(thumbs[i].src, shortUrlName) : thumbs[i].src
            const obj = { 
                title: title[i],
                posterUrl: thumbsUrl,
                ratings: ratings[i].data,
                releaseYears: releaseDates[i].data.match(/([0-9])/gi).join(''),
            }
            results.push(obj)
        }
        return results
    }

    /**
     * Get lowest rated movies
     * @param options 
     * @returns List film / movies
     */
    async getLowestRatedMovies(options?: extraOptions) {
        let { pages, shortUrl, shortUrlName } = options
        if (!pages) {
            pages = 30
        }
        const html = await axios.get('https://www.imdb.com/chart/bottom')
        const $ = cheerio.load(html.data)
        const results: results[] = []
        const title = []
        const thumbs = []
        const ratings = []
        const releaseDates = []
        $('td.titleColumn > a').get().map(rest => {
            title.push(rest.attribs.title)
        })
        $('td.titleColumn > span').get().map(rest => {
            releaseDates.push(rest.children[0])
        })
        $('td.ratingColumn.imdbRating > strong').get().map(rest => {
            ratings.push(rest.children[0])
        })
        $('td.posterColumn > a > img').get().map(rest => {
            thumbs.push(rest.attribs)
        })
        if (pages >= title.length) {
            pages = title.length
        } else if (title.length < pages) {
            pages = title.length
        }
        for (let i = 0; i < pages; i++) {
            const thumbsUrl = shortUrl ? await shortlinks(thumbs[i].src, shortUrlName) : thumbs[i].src
            const obj = { 
                title: title[i],
                posterUrl: thumbsUrl,
                ratings: ratings[i].data,
                releaseYears: releaseDates[i].data.match(/([0-9])/gi).join(''),
            }
            results.push(obj)
        }
        return results
    }

    /**
     * Get most populer tv shows
     * @param options
     * @returns List popular shows
     */
    async getPopularTvShows(options?: extraOptions) {
        let { pages, shortUrl, shortUrlName } = options
        if (!pages) {
            pages = 30
        }
        const html = await axios.get('https://www.imdb.com/chart/tvmeter')
        const $ = cheerio.load(html.data)
        const results: results[] = []
        const title = []
        const thumbs = []
        const ratings = []
        const releaseDates = []
        $('td.titleColumn > a').get().map(rest => {
            title.push(rest.attribs.title)
        })
        $('td.titleColumn > span').get().map(rest => {
            releaseDates.push(rest.children[0])
        })
        $('td.ratingColumn.imdbRating > strong').get().map(rest => {
            ratings.push(rest.children[0])
        })
        $('td.posterColumn > a > img').get().map(rest => {
            thumbs.push(rest.attribs)
        })
        if (pages >= title.length) {
            pages = title.length
        } else if (title.length < pages) {
            pages = title.length
        }
        for (let i = 0; i < pages; i++) {
            const thumbsUrl = shortUrl ? await shortlinks(thumbs[i].src, shortUrlName) : thumbs[i].src
            const obj = { 
                title: title[i],
                posterUrl: thumbsUrl,
                ratings: ratings[i].data,
                releaseYears: releaseDates[i].data.match(/([0-9])/gi).join(''),
            }
            results.push(obj)
        }
        return results
    }

    /**
     * Get top rated tv shows
     * @param options 
     * @returns List top rated tv shows
     */
    async getTopRatedTvShows(options?: extraOptions) {
        let { pages, shortUrl, shortUrlName } = options
        if (!pages) {
            pages = 30
        }
        const html = await axios.get('https://www.imdb.com/chart/toptv')
        const $ = cheerio.load(html.data)
        const results: results[] = []
        const title = []
        const thumbs = []
        const ratings = []
        const releaseDates = []
        $('td.titleColumn > a').get().map(rest => {
            title.push(rest.attribs.title)
        })
        $('td.titleColumn > span').get().map(rest => {
            releaseDates.push(rest.children[0])
        })
        $('td.ratingColumn.imdbRating > strong').get().map(rest => {
            ratings.push(rest.children[0])
        })
        $('td.posterColumn > a > img').get().map(rest => {
            thumbs.push(rest.attribs)
        })
        if (pages >= title.length) {
            pages = title.length
        } else if (title.length < pages) {
            pages = title.length
        }
        for (let i = 0; i < pages; i++) {
            const thumbsUrl = shortUrl ? await shortlinks(thumbs[i].src, shortUrlName) : thumbs[i].src
            const obj = { 
                title: title[i],
                posterUrl: thumbsUrl,
                ratings: ratings[i].data,
                releaseYears: releaseDates[i].data.match(/([0-9])/gi).join(''),
            }
            results.push(obj)
        }
        return results
    }
}

export {
    Imdb
}