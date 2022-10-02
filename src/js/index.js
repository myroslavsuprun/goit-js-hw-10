import '../css/styles.css';
import { fetchCountries } from './fetchCountries';
import '../styles.scss';
import { getRefs } from './refs';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

getRefs().searchField.addEventListener(
  'input',
  debounce(onSearchFormInput, DEBOUNCE_DELAY)
);

function onSearchFormInput(e) {
  if (e.target.value === '') {
    clearCountryInfo();
    clearCountryList();
    getRefs().countryInfo.classList.remove('card');
    return;
  }

  fetchCountriesResponse(
    e.target.value,
    createCountriesResponse,
    fetchCountriesFailureResponse
  );
}

function createCountriesResponse(response) {
  if (response.length >= 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }
  if (response.length >= 2 && response.length <= 9) {
    createMarkupCountryList(response);
    return;
  }
  createMarkupCountryCard(response);
}

function createMarkupCountryList(countries) {
  clearCountryInfo();
  getRefs().countryInfo.classList.remove('card');

  const textMarkup = countries.reduce((textMarkup, country) => {
    const toAdd = `
          <li class="list-group-item"><img class="me-3" src="${country.flags.svg}" alt="${country.name.official} flag" width="50">${country.name.official}</li>
      `;
    textMarkup += toAdd;
    return textMarkup;
  }, '');

  getRefs().countryList.innerHTML = textMarkup;
}

function createMarkupCountryCard(country) {
  clearCountryList();
  getRefs().countryInfo.classList.add('card');

  const countryCardMarkup = `
      <img src="${country[0].flags.svg}" class="card-img-top" alt="${
    country[0].name.official
  } flag">
      <div class="card-body">
        <h5 class="card-title">${country[0].name.official}</h5>
        <ul class="list-group list-group-flush">
          <li class="list-group-item"><span class="fw-bold">Capital: </span>${
            country[0].capital[0]
          }</li>
          <li class="list-group-item"><span class="fw-bold">Population: </span>${
            country[0].population
          }</li>
          <li class="list-group-item"><span class="fw-bold">Languages: </span>${tansformLanguagesToText(
            country[0].languages
          )}</li>
        </ul>
      </div>
  `;

  getRefs().countryInfo.innerHTML = countryCardMarkup;
}

function tansformLanguagesToText(languages) {
  let languagesMarkup = '';
  let total = 0;
  const languagesLength = Object.keys(languages).length;

  for (language in languages) {
    total += 1;
    if (total === languagesLength) {
      languagesMarkup += languages[language];
    } else {
      languagesMarkup += languages[language] + ', ';
    }
  }

  return languagesMarkup;
}

function fetchCountriesResponse(country, callbackSuccess, callbackFailure) {
  fetchCountries(country).then(callbackSuccess).catch(callbackFailure);
}

function fetchCountriesFailureResponse() {
  Notify.failure('Oops, there is no country with such name.');
  clearCountryList();
  clearCountryInfo();
  getRefs().countryInfo.classList.remove('card');
}

function clearCountryList() {
  getRefs().countryList.innerHTML = '';
}

function clearCountryInfo() {
  getRefs().countryInfo.innerHTML = '';
}
