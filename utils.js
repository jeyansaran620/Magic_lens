const data = require('./data');

module.exports = {
  getImageDataFromResults: (results) => {
    if (results && results.length) {
      const mostMatched = results[0] && results[0].species && results[0].species.scientificNameWithoutAuthor;
      if (mostMatched) {
        const normalizedScientificName = mostMatched.toLowerCase().replace(/\s/g, '');
        if (data[normalizedScientificName]) {
          return {
            fullyMatched: true,
            score: parseInt(results[0].score * 100, 10),
            ...data[normalizedScientificName]
          };
        } else {
          return {
            fullyMatched: false,
            score: parseInt(results[0].score * 100, 10),
            scientificName: mostMatched,
            commonNames: results[0].commonNames,
          }
        }
      }
    }
    return {};
  }
}