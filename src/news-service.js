import axios from 'axios';

const API_KEY = '34344088-cfac681c64979560ee45228c3';
const BASE_URL = 'https://pixabay.com/api';

export default class NewsApiService {
    constructor() {
        this.searchTerm = ' ';
        this.page = 1;
    }

    fetchHits() {
        const url = `${BASE_URL}/?key=${API_KEY}&q=${this.searchTerm}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;

        return axios.get(url)
            .then(response => response.data)
            .then(data => {
                this.incrementPage();

                return data.hits;
            });
    }
        
    incrementPage() {
        this.page += 1;
    }
    
    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchTerm;
    }

    set query(newQuery) {
        this.searchTerm = newQuery;
    }

}
