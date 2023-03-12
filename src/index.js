
import { Notify } from 'notiflix';
import NewsApiService from './news-service';
import './css/styles.css';

const refs = {
    searchForm: document.querySelector('.search-form'),
    loadMoreBtn: document.querySelector('.load-more'),
    gallery: document.querySelector('.gallery')
}

const newsApiService = new NewsApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();

  newsApiService.query = e.currentTarget.searchQuery.value.trim();
    newsApiService.resetPage();
    
  newsApiService.fetchArticles()
      .then(({ data }) => {
      if (data.total === 0) {
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      } else {
        renderImages(data.hits);
      }
    })
    .catch(error => {
      Notify.failure('Something went wrong. Please try again later.');
      console.error(error);
    });
}


function onLoadMore() {
    newsApiService.fetchArticles()
        .then(({ data }) => {
            renderImages(data.hits);
        })
        .catch(error => {
            Notify.failure('Something went wrong. Please try again later.');
            console.error(error);
        });
}


function renderImages(hits) {
    const markup = hits
        .map(hit => {
        return `
            <div class="photo-card">
                <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
                <div class="stats">
                    <p class="stats-item">
                        <i class="material-icons">thumb_up</i>
                        ${hit.likes}
                    </p>
                    <p class="stats-item">
                        <i class="material-icons">visibility</i>
                        ${hit.views}
                    </p>
                    <p class="stats-item">
                        <i class="material-icons">comment</i>
                        ${hit.comments}
                    </p>
                    <p class="stats-item">
                        <i class="material-icons">cloud_download</i>
                        ${hit.downloads}
                    </p>
                </div>
            </div>
        `;
    }).join('');

    refs.gallery.insertAdjacentHTML('beforeend', markup);
}
