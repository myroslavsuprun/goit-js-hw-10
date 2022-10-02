import { Notify } from 'notiflix';

const BASE_URL = 'https://restcountries.com/v3.1/name/';

async function fetchCountries(countryName) {
  const urlToFetch = `${BASE_URL}${countryName}?fields=capital,population,languages,flags,name`;
  try {
    const countryResponse = await fetch(urlToFetch);
    const countryResponseJSON = await countryResponse.json();
    return countryResponseJSON;
  } catch {
    Notify.failure('Oops, there is a mistake occured. We are working on it');
  }
}

export { fetchCountries };
