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
refs.loadMoreBtn.style.display = 'none';

async function onSearch(e) {
  e.preventDefault();

  clearGallery();
  
  newsApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  if (newsApiService.query === '') {
    refs.loadMoreBtn.style.display = 'none';
    return;
  }
  newsApiService.resetPage();
  
  try {
    const data = await newsApiService.fetchHits();
    if (data.totalHits === 0) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      refs.loadMoreBtn.style.display = 'none';
    } else {
      renderImages(data.hits);
      Notify.info(`Hooray! We found ${data.totalHits} images.`);
      refs.loadMoreBtn.style.display = 'inline-block';
    }
  } catch (error) {
    console.error(error);
  }
}

async function onLoadMore() {
  try {
    const data = await newsApiService.fetchHits();
    renderImages(data.hits);
  } catch (error) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    refs.loadMoreBtn.style.display = 'none';
    console.error(error);
  }
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

function clearGallery() {
  refs.gallery.innerHTML = '';
}