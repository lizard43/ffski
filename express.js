const axios = require('axios')
const express = require('express')
const app = express()
const port = 3333

// CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// expose REST API
app.get('/players/:format/:year/:teamsize', async (req, res) => {

  try {
    const f = req.params.format;
    const y = req.params.year;
    const t = req.params.teamsize;
    const resp = await axios.get("https://fantasyfootballcalculator.com/api/v1/adp/" + f + "?teams=" + t + "&year=" + y);
    const players = resp.data.players;
    res.status(200).json({ players });
  } catch (error) {
    res.status(400).json([{player_id: 0, name: error.code}]);
  }
})

// serve API
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})