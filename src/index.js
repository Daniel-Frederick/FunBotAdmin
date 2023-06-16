require("dotenv").config(); //This lets the docuent access the .env class

const { Client, IntentsBitField } = require("discord.js");
const SpotifyWebApi = require("spotify-web-api-node");

// All the things the bot has access to
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

// Tell you when the bot is online
client.on("ready", (c) => {
  console.log(`${c.user.tag} is online.`);

  // Set the spotify access token
  setSpotifyAccessToken();
});

// Spotify Web API client
const spotifyApi = new SpotifyWebApi({
  // Both obtained in the spotify developers website and creating a new app
  clientId: process.env.SPOTIFY_CLIENT_ID, // Spotify client ID
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET, // Spotify client secret
});

// Spotify access token
async function setSpotifyAccessToken() {
  const data = await spotifyApi.clientCredentialsGrant();
  spotifyApi.setAccessToken(data.body["access_token"]);
}

// Randomly select a song from the spotify playlist
async function getRandomSongFromPlaylist(playlistId) {
  const data = await spotifyApi.getPlaylistTracks(playlistId, { limit: 100 });
  const tracks = data.body.items;
  const randomIndex = Math.floor(Math.random() * tracks.length);
  const randomTrack = tracks[randomIndex].track;

  return randomTrack;
}

// Gets the bot's choice of rock, paper, or scissors
const botChoice = (userValue) => {
  // Random number generator between 0-2
  let botValue = Math.floor(Math.random() * 3);
  console.log("botValue : ", botValue);

  /*
  Converting the botValue number to a String value to compare with the userValue parameter
  If botValue = 0 => rock
  If botValue = 1 => paper
  If botValue = 2 => scissors
  */
  if (botValue === 0) {
    //botValue = "rock";
    return "rock";
  } else if (botValue === 1) {
    //botValue = "paper";
    return "paper";
  } else {
    //botValue = "scissors";
    return "scissors";
  }
};

// Gets the result of the game rock, paper, scissors
const rpsResult = (userValue, botsChoice) => {
  // return true if the user won
  // return false if the user lost
  // return null if the game is a draw
  if (
    // Win
    (userValue === "rock" && botsChoice === "scissors") ||
    (userValue === "paper" && botsChoice === "rock") ||
    (userValue === "scissors" && botsChoice === "paper")
  ) {
    return "win!";
  } else if (
    // Loss
    (userValue === "scissors" && botsChoice === "rock") ||
    (userValue === "rock" && botsChoice === "paper") ||
    (userValue === "paper" && botsChoice === "scissors")
  ) {
    return "loss!";
  } else {
    // Draw
    return "draw!";
  }
};

client.on("messageCreate", (msg) => {
  // msg = access to a message
  // Makes sure that the bot does not repeat itself
  if (msg.author.bot) {
    return;
  }

  // Picks a random Song from a Spotify playlist
  if (msg.content === "/randomsong") {
    getRandomSongFromPlaylist(process.env.SPOTIFY_PLAYLIST_ID)
      .then((song) => {
        const songName = song.name;
        const artists = song.artists.map((artist) => artist.name).join(", ");
        console.log(songName + " by " + artists);
        msg.reply(songName + " by " + artists);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  }

  // Play Rock, Paper, Scissors against the bot!
  if (
    msg.content === "/rps rock" ||
    msg.content === "/rps paper" ||
    msg.content === "/rps scissors"
  ) {
    // Get user's choice
    const userValue = msg.content.substring(5);
    console.log("userValue: ", userValue);

    // Get bot's choice
    const botsChoice = botChoice(userValue);
    console.log("botChoice(userValue) : ", botsChoice);

    // Get the result of the game
    const result = rpsResult(userValue, botsChoice);
    console.log("rpsResult: ", result);

    // Print the intro, user's choice, bot's choice, and the result
    msg.reply(
      "Welcome to rock, paper, scissors!\nYou chose: " +
        userValue +
        ".\nThe Bot chose: " +
        botsChoice +
        ".\nThe result is a " +
        result
    );
  }
});

//My discord bot TOKEN
client.login(process.env.TOKEN);
