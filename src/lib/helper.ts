import axios from 'axios'
import { typesShortLinks } from '@lib/interface'

async function shortlinks(url: string, types?: typesShortLinks) {
    switch(types) {
        case 'tinyurl': {
            const data = await axios.get(`https://tinyurl.com/api-create.php?url=${url}`)
            return data.data
        }
        break
        default: {
            const data = await axios.get(`https://tinyurl.com/api-create.php?url=${url}`)
            return data.data
        }
    }
}

export {
    shortlinks
}