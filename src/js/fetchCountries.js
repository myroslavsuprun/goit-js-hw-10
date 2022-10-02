const BASE_URL = 'https://restcountries.com/v3.1/name/';

function fetchCountries(name) {
  const urlToFetch = `${BASE_URL}${name}?fields=capital,population,languages,flags,name`;
  return fetch(urlToFetch)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .catch(() => Notify.failure('Oops, there is no country with such name'));
}

export { fetchCountries };
