require('dotenv').config();

const { 
  Client, 
  GatewayIntentBits, 
  ActivityType 
} = require('discord.js');

const {
  joinVoiceChannel,
  VoiceConnectionStatus,
  entersState,
} = require('@discordjs/voice');

const TOKEN = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

let connection = null;
let reconnecting = false;

async function connectVoice() {
  try {
    const guild = client.guilds.cache.get(GUILD_ID);

    if (!guild) {
      console.log('Guild tidak ditemukan');
      return;
    }

    console.log('Mencoba masuk voice...');

    connection = joinVoiceChannel({
      channelId: CHANNEL_ID,
      guildId: GUILD_ID,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false,
    });

    connection.on(VoiceConnectionStatus.Ready, () => {
      console.log('Bot berhasil masuk voice');
      reconnecting = false;
    });

    connection.on(VoiceConnectionStatus.Disconnected, async () => {
      if (reconnecting) return;

      reconnecting = true;

      console.log('Bot disconnect, mencoba reconnect...');

      try {
        await entersState(connection, VoiceConnectionStatus.Signalling, 5_000);
      } catch {
        try {
          connection.destroy();
        } catch {}

        setTimeout(() => {
          connectVoice();
        }, 5000);
      }
    });

  } catch (err) {
    console.log('Error voice:', err);

    setTimeout(() => {
      connectVoice();
    }, 10000);
  }
}

client.once('clientReady', async () => {
  console.log(`${client.user.tag} online`);

  client.user.setPresence({
    activities: [
      {
        name: 'TIDUR',
        type: ActivityType.Watching,
      },
    ],
    status: 'idle',
  });

  connectVoice();
});

client.on('error', console.error);

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);

client.login(TOKEN);