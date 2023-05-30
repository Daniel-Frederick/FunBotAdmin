require('dotenv').config(); //This lets the docuent access the .env class

const {Client, IntentsBitField} = require('discord.js');
const SpotifyWebApi = require('spotify-web-api-node');

// All the things the bot has access to
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
})

// Tell you when the bot is online
client.on('ready', (c) => {
    console.log(`${c.user.tag} is online.`);

    // Set the spotify access token
    setSpotifyAccessToken();
})

// Spotify Web API client
const spotifyApi = new SpotifyWebApi({
    // Both obtained in the spotify developers website and creating a new app
    clientId: process.env.SPOTIFY_CLIENT_ID, // Spotify client ID 
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,  // Spotify client secret
});

// Spotify access token
async function setSpotifyAccessToken() {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body['access_token']);
}

// Randomly select a song from the spotify playlist
async function getRandomSongFromPlaylist(playlistId) {
    const data = await spotifyApi.getPlaylistTracks(playlistId, { limit: 100 });
    const tracks = data.body.items;
    const randomIndex = Math.floor(Math.random() * tracks.length);
    const randomTrack = tracks[randomIndex].track;

    return randomTrack;
}

client.on('messageCreate', (msg) => { // msg = access to a message
    // Makes sure that the bot does not repeat itself
    if(msg.author.bot) {return;} 

    // Picks a random Song from a Spotify playlist
    if(msg.content === '/randomsong'){
            getRandomSongFromPlaylist(process.env.SPOTIFY_PLAYLIST_ID)
            .then((song) => {
                const songName = song.name;
                const artists = song.artists.map((artist) => artist.name).join(', ');
                console.log(songName + ' by ' + artists);
                msg.reply(songName + ' by ' + artists);
            })
            .catch((error) => {
                console.error('Error: ', error)
            })
    }
})

//My discord bot TOKEN
client.login(process.env.TOKEN);