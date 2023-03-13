
import { Notify } from 'notiflix';
import NewsApiService from './news-service';
import './css/styles.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery')
};

const newsApiService = new NewsApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();

  newsApiService.query = e.currentTarget.elements.searchQuery.value.trim();
    newsApiService.resetPage();
    
  newsApiService.fetchHits()
      .then(data => {
      if (data.totalHits === 0) {
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      } else {
        renderImages(data.hits);
      }
    })
    .catch(error => {
      console.error(error);
    });
}


function onLoadMore() {
    newsApiService.fetchHits()
        .then(data => {
            renderImages(data.hits);
        })
        .catch(error => {
            console.error(error);
        });
}

function renderImages(hits) {
    const markup = hits
        .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
            return `
        <div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
        <p class="info-item">
        <b>Likes: ${likes}</b>
        </p>
        <p class="info-item">
        <b>Views: ${views}</b>
        </p>
        <p class="info-item">
        <b>Comments: ${comments}</b>
        </p>
        <p class="info-item">
        <b>Downloads: ${downloads}</b>
        </p>
        </div>
        </div>
        `;
        })
        .join('');

    refs.gallery.insertAdjacentHTML('beforeend', markup);
}


