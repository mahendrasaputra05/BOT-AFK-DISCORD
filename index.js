require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const TOKEN = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('clientReady', () => {
  console.log(`${client.user.tag} online`);

  const guild = client.guilds.cache.get(GUILD_ID);

  if (!guild) {
    console.log('Server tidak ditemukan');
    return;
  }

  joinVoiceChannel({
    channelId: CHANNEL_ID,
    guildId: guild.id,
    adapterCreator: guild.voiceAdapterCreator,
    selfDeaf: true,
    selfMute: false
  });

  console.log('Bot masuk voice');
});

client.login(TOKEN);