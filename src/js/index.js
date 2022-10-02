import '../css/styles.css';
import '../styles.scss';
import { fetchCountries } from './fetchCountries';
import { refs } from './refs';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const { searchFieldInput, countryListWrapper, countryCardWrapper } = refs;

searchFieldInput.addEventListener(
  'input',
  debounce(onSearchFieldInput, DEBOUNCE_DELAY)
);

async function onSearchFieldInput(e) {
  const countryRequestName = e.target.value;
  const countryResponse = await fetchCountries(countryRequestName);

  if (countryRequestName === '') {
    clearCountryCard();
    clearCountryList();

    return;
  }

  if (countryResponse.status === 404) {
    clearCountryCard();
    clearCountryList();

    Notiflix.Notify.failure('Oops, there is no country with that name');
  }

  if (countryResponse.length > 10) {
    Notiflix.Notify.failure(
      'Too many matches found. Please enter a more specific name.'
    );

    return;
  }

  if (countryResponse.length >= 2) {
    clearCountryCard();
    createCountriesMarkupList(countryResponse);

    return;
  }

  if (countryResponse.length === 1) {
    clearCountryList();
    createCountryCardMarkup(countryResponse[0]);

    countryCardWrapper.classList.add('card');

    return;
  }
}

function createCountryCardMarkup(country) {
  let { name, capital, population, flags, languages } = country;

  languages = languagesFromObjToStr(languages);
  population = separatePopulationWithSpaces(population.toString());

  const markup = `
    <img src="${flags.svg}" class="card-img-top" alt="${name.official} flag">
    <div class="card-body">
        <h5 class="card-title">${name.official}</h5>
        <ul class="list-group list-group-flush">
        <li class="list-group-item"><span class="fw-bold">Capital: </span>${capital}</li>
        <li class="list-group-item"><span class="fw-bold">Population: </span>${population}</li>
        <li class="list-group-item"><span class="fw-bold">Languages: </span>${languages}</li>
        </ul>
    </div>
    `;

  countryCardWrapper.innerHTML = markup;
}

function createCountriesMarkupList(countries) {
  const markupList = countries.reduce(createOneCountryMarkUp, '');
  countryListWrapper.innerHTML = markupList;
}

function createOneCountryMarkUp(totalMarkup, country) {
  const { name, flags } = country;
  const markup = `
    <li class="list-group-item">
        <img class="me-3" src="${flags.svg}"
            alt="${name.official}
            flag" width="50">${name.official}
    </li>
    `;
  return totalMarkup + markup;
}

function languagesFromObjToStr(languages) {
  return Object.values(languages).join(', ');
}

function separatePopulationWithSpaces(number) {
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function clearCountryCard() {
  countryCardWrapper.innerHTML = '';
  countryCardWrapper.classList.remove('card');
}

function clearCountryList() {
  countryListWrapper.innerHTML = '';
}
