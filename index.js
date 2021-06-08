// http://<CLIENT IP>:<CLIENT PORT>/player/playback/playMedia?key=%2Flibrary%2Fmetadata%2F<MEDIA ID>&offset=0&X-Plex-Client-Identifier=<CLIENT ID>&machineIdentifier=<SERVER ID>&address=<SERVER IP>&port=<SERVER PORT>&protocol=http&path=http%3A%2F%2F<SERVER IP>%3A<SERVER PORT>%2Flibrary%2Fmetadata%2F<MEDIA ID>
const axios = require("axios");
/**
 * Load environment variables from the .env file, where API keys and passwords are stored.
 */
require("dotenv").config();

async function getSessions() {
  console.log("RUNNING");
  const response = await axios.get(
    `http://${process.env.PLEX_IP}:${process.env.PLEX_PORT}/status/sessions?X-Plex-Token=${process.env.PLEX_TOKEN}`
  );
  if (response.data.MediaContainer.size === 0) {
    return false;
  }
  response.data.MediaContainer.Metadata.map(async (data) => {
    if (data.Player.remotePublicAddres !== undefined) {
      console.log("NOT REMOTE SKIPPING");
      return false;
    }
    if (data.User.title === process.env.PLEX_OWNER) {
      console.log("IS POWNER SKIPPING");

      return false;
    } else {
      console.log("SKIPPED");

      await axios.get(
        `http://${process.env.PLEX_IP}:${process.env.PLEX_PORT}/status/sessions/terminate?sessionId=${data.Session.id}&X-Plex-Token=${process.env.PLEX_TOKEN}&reason=Sorry%20but%20remote%20streaming%20is%20now%20allowed.`
      );
      return true;
    }
  });
}

getSessions();

setInterval(getSessions, 5000);
