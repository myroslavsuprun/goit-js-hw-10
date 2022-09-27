const BASE_URL = 'https://restcountries.com/v3.1/name/';

export function fetchCountries(name) {
  urlToFetch = `${BASE_URL}${name}?fields=capital,population,languages,flags,name`;
  return fetch(urlToFetch).then(response => response.json());
}

// Нужно как-то исправить на свг и на name.official
