import { getImagesByQuery } from './js/pixabay-api';
import { createGallery, clearGallery, showLoader, hideLoader, showLoadMoreButton, hideLoadMoreButton } from './js/render-functions';
import iziToast from 'izitoast';
import "izitoast/dist/css/iziToast.min.css";

function smoothScrollAfterLoad() {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
  
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
}

const gallery = document.querySelector('.gallery');
const form = document.querySelector('.form');
const input = document.querySelector('[name="search-text"]');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more');

let currentQuery = '';
let currentPage = 1;
const PER_PAGE = 15;

hideLoadMoreButton();

form.addEventListener('submit', async function (event) {
  event.preventDefault();
  const inputValue = input.value.trim();

  if (inputValue === '') {
    iziToast.warning({
      title: 'Caution',
      message: 'You forgot important data',
    });
    return;
  }

  currentQuery = inputValue;
  currentPage = 1;

  clearGallery();
  showLoader(); 
  hideLoadMoreButton();

  try {
      const res = await getImagesByQuery(currentQuery, currentPage);
    //   console.log('Total hits:', res.totalHits);

    if (res.hits.length === 0) {
      iziToast.warning({
        title: 'Caution',
        message: 'Sorry, no images matching your search query.',
      });
      return;
    }

    createGallery(res.hits);

    const maxPages = Math.ceil(res.totalHits / PER_PAGE);
    if (currentPage < maxPages) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({
        title: 'Info',
        message: "You've reached the end of the search results.",
      });
    }

    currentPage++;
  } catch (error) {
    console.error('Error: ', error);
    iziToast.error({
      title: 'Error',
      message: 'Error fetching images.',
    });
  } finally {
    hideLoader(); 
  }
});

loadMoreBtn.addEventListener('click', async () => {
  showLoader(); 
  hideLoadMoreButton();

  try {
    const res = await getImagesByQuery(currentQuery, currentPage);

    if (res.hits.length === 0) {
      iziToast.info({
        title: 'Info',
        message: 'No more images to load.',
      });
      return;
    }

    createGallery(res.hits);
    smoothScrollAfterLoad();

    const maxPages = Math.ceil(res.totalHits / PER_PAGE);
    if (currentPage < maxPages) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({
        title: 'Info',
        message: "You've reached the end of the search results.",
      });
    }

    currentPage++; 
  } catch (error) {
    console.error('Error: ', error);
    iziToast.error({
      title: 'Error',
      message: 'Could not load more images',
    });
  } finally {
    hideLoader(); 
  }
});