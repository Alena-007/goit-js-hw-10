import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const listEl = document.querySelector('.country-list');
const cardDiv = document.querySelector('.country-info');
const inputEl = document.querySelector('#search-box');
const DEBOUNCE_DELAY = 300;

const createListItems = item =>
  `<li class="country-item"><img class="country-flag" src="${item.flags.svg}" alt="flag of ${item.name.official}" ><h2>${item.name.official}</h2></li>`;

const createCardItems = item =>
  `<li class="country-item-card"><img class="country-flag-card" src="${
    item.flags.svg
  }" alt="${item.name.official}" ><h2 class="country-title-card">${
    item.name.official
  }</h2><p class="country-descr-card"><span class="bold">Capital: </span> ${
    item.capital
  }</p><p class="country-descr-card"><span class="bold">Population: </span>${
    item.population
  }</p><p class="country-descr-card"><span class="bold">Languages: </span>${Object.values(
    item.languages
  ).join(', ')}</p></li>`;

const generateListItems = array =>
  array.reduce((acc, item) => acc + createListItems(item), '');

const generateCardItems = array =>
  array.reduce((acc, item) => acc + createCardItems(item), '');

const insertListItems = array => {
  const result = generateListItems(array);
  listEl.insertAdjacentHTML('beforeend', result);
};

const insertCardItems = array => {
  const result = generateCardItems(array);
  cardDiv.insertAdjacentHTML('beforeend', result);
};

inputEl.addEventListener('input', debounce(onSearchСountries, DEBOUNCE_DELAY));

function onSearchСountries(evt) {
  evt.preventDefault();
  clearInput();
  const country = evt.target.value.trim();
  if (country !== '') {
    fetchCountries(country)
      .then(data => {
        if (data.length > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (data.length >= 2 && data.length <= 10) {
          insertListItems(data);
        } else if (data.length === 1) {
          listEl.innerHTML = '';
          insertCardItems(data);
        }
      })
      .catch(error => {
        Notify.failure('Oops, there is no country with that name');
      });
  } else {
    clearInput();
  }
}

function clearInput() {
  listEl.innerHTML = '';
  cardDiv.innerHTML = '';
}
