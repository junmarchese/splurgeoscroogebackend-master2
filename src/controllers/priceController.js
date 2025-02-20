const { fetchPriceData, searchSeriesData } = require('../services/blsServices.js');

exports.getPriceData = async (req, res) => {
  try {
    const { seriesId } = req.params;
    const data = await fetchPriceData(seriesId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
