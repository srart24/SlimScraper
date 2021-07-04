type typesShortLinks = 'tinyurl' | 'bitly'

interface extraOptions {
    pages: number,
    shortUrl?: boolean,
    shortUrlName?: typesShortLinks
}

interface searchOptions {
    shortUrl?: boolean,
    shortUrlName?: typesShortLinks
}

export {
    typesShortLinks,
    extraOptions,
    searchOptions
}