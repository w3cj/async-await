const request = require('request');
const rp = require('request-promise');

async function getFirstMovie() {
    try {
        const resultsBody = await rp('https://omdb-api.now.sh/?s=star%20wars');
        const results = JSON.parse(resultsBody);
        const movieBody = await rp('https://omdb-api.now.sh/?i=' + results.Search[0].imdbID);
        const movie = JSON.parse(movieBody);
        return movie;
    } catch (error) {
        console.log('Error!', error);
    }

}

(async function () {
  const movie = await getFirstMovie();
  console.log(movie);
})();
//
// getFirstMovie()
//     .then(movie => {
//         console.log(movie);
//     });
