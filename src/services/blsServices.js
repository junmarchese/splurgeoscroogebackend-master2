const axios = require('axios');

const BLS_API_URL = 'https://api.bls.gov/publicAPI/v2/timeseries/data/';
const BLS_API_KEY = process.env.BLS_API_KEY;

exports.fetchPriceData = async (seriesId) => {
  try {
    const response = await axios.get(`${BLS_API_URL}${seriesId}`, {
      params: {
        registrationkey: BLS_API_KEY,
        startyear: new Date().getFullYear() - 1,
        endyear: new Date().getFullYear(),
      }
    });

    console.log("???", response)


    return response.data.Results.series[0]?.data[0] || null;
  } catch (error) {
    throw new Error('Failed to fetch price data');
  }
};


exports.searchSeries = async (req, res) => {
    try {
      const { query } = req.query;
      const results = await searchSeriesData(query);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  