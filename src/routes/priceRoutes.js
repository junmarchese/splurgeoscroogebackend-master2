const express = require('express');
const router = express.Router();
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const seriesData = [];

const csvFilePath = path.join(__dirname, '../../series_data.csv');

// Read and load CSV data into memory
fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    if (row.series_title && row.series_id) {  
      seriesData.push({
        series_id: row.series_id.trim(),
        series_title: row.series_title.toLowerCase().trim()
      });
    } else {
      console.warn('Skipping row with missing required fields:', row);
    }
  })
  .on('end', () => {
    console.log('✅ Finished loading series data.');
  });

// API Endpoint for searching series_data using case-insensitive matching
router.get('/search', (req, res) => {
  console.log("I am seraching for:", req.query.q)
  const query = req.query.q?.toLowerCase().trim();
  if (!query) {
    return res.status(400).json({ message: "Please provide a valid query parameter." });
  }

  // Filter series data for partial match
  const results = seriesData.filter(item => item.series_title.includes(query));

  //console.log("result", results);

  if (results.length === 0) {
    return res.status(404).json({ message: "No matching results found." });
  }

  res.json(
    results.map(({ series_id, series_title }) => ({ seriesId: series_id, title: series_title }))
  );
});

// API Route to fetch price data from BLS API using seriesId
router.get('/fetch', async (req, res) => {
  const { seriesId } = req.query;
  if (!seriesId) {
    return res.status(400).json({ message: "Missing seriesId parameter" });
  }

  try {
    const response = await fetch(`https://api.bls.gov/publicAPI/v2/timeseries/data/${seriesId}`);
    const data = await response.json();

    console.log("result:",data )
    if (!data || !data.Results || !data.Results.series) {
      return res.status(404).json({ message: "No price data found for this series ID." });
    }


    const latestObservation = data.Results.series[0].data[0]; // Get the most recent observation
    res.json({
      value: latestObservation.value,
      periodName: latestObservation.periodName,
      year: latestObservation.year
    });
  } catch (error) {
    console.error("Error fetching BLS data:", error);
    res.status(500).json({ message: "Failed to fetch price data from BLS API" });
  }
});

module.exports = router;
