require('dotenv').config();
const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: true }));
// setting the spotify-api goes here:
const clientId = process.env.CLIENTID;
const clientSecret = process.env.CLIENTSECRET;

const spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body.access_token);
  })
  .catch((error) => {
    console.log('Something went wrong when retrieving an access token', error);
  });

// the routes go here:
app.get('/', (req, res, next) => {
  res.render('index');
});

app.post('/artists', (req, res, next) => {
  const { artist } = req.body;
  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      // console.log('The received data from the API: ', data.body.artists.items);
      res.render('artists', data.body.artists);
    })

    .catch((err) => {
      console.log('The error while searching artists occurred: ', err);
    });
});

app.get('/albums/:artistId', async (req, res, next) => {
  const { artistId } = req.params;
  try {
    const albums = await spotifyApi.getArtistAlbums(artistId);
    // console.log('albums: ', albums);
    res.render('albums', albums.body);
  } catch (err) {
    console.log(err);
  }
});

app.get('/tracks/:albumId', async (req, res, next) => {
  const { albumId } = req.params;
  try {
    const tracks = await spotifyApi.getAlbumTracks(albumId);
    // console.log('tracks', tracks);
    res.render('tracks', tracks.body);
  } catch (err) {
    console.log(err);
  }
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
