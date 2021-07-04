import axios from "axios"
import cheerio from 'cheerio'
import { extraOptions } from '../lib/interface'
import { shortlinks } from '../lib/helper'

class Imdb {
    /**
     * Get top rated movies
     * @param pages total page results
     * @returns {string[]} List film
     */
    async getTopRatedMovies(options: extraOptions) {
        let { pages, shortUrl, shortUrlName } = options
        if (!pages) {
            pages = 30
        }
        const html = await axios.get('https://www.imdb.com/chart/top/')
        const $ = cheerio.load(html.data)
        const results = []
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
                thumbnails: thumbsUrl,
                ratings: ratings[i].data,
                releaseYears: releaseDates[i].data.replace('(', '').replace(')', ''),
            }
            results.push(obj)
        }
        return results
    }
}

export {
    Imdb
}