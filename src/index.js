require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const ytdl = require('ytdl-core');
const PREFIX = '!';
const opusscript = require("opusscript");

let servers = {};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', function (message) {

  let args = message.content.substring(PREFIX.length).split(" ");

  switch (args[0]) {
    case 'play':

      function play(connection, message) {
        let server = servers[message.guild.id];

        server.dispatcher = connection.play(ytdl(server.queue[0], { filter: "audioonly" }));

        server.queue.shift();

        server.dispatcher.on("end", function () {
          if (server.queue[0]) {
            play(connection, message);
          } else {
            connection.disconnect();
          }
        });
      }

      if (!args[1]) {
        message.channel.send("Necesitas proporcionar un link!");
        return;
      }

      if (!message.member.voice.channel) {
        message.channel.send("Debes de estar en un canal para reproducirlo!");
        return;

      }

      if (!servers[message.guild.id]) servers[message.guild.id] = {
        queue: []
      }

      let server = servers[message.guild.id];

      server.queue.push(args[1]);

      if (!message.member.voice.connection) message.member.voice.channel.join('766250023108739082').then(function (connection) {
        console.log("conectado al canal")
        play(connection, message);
        message.reply('DESARROLLALA PAPUUUU🤟🏽🎧🙌🏽')
      })

      break;

    case 'skip':
      (async function () {
        let server = await servers[message.guild.id];
        if (server.dispatcher) server.dispatcher.end();
        message.channel.send("Saltando a la siguiente cancion!")
      })();
      break;


    case 'stop':
      (async function () {
        let server = await servers[message.guild.id];
        if (message.guild.voice.connection) {
          for (let i = server.queue.length - 1; i >= 0; i--) {
            server.queue.splice(i, 1);
            
          }

          server.dispatcher.end();
          message.channel.send("la cancion ce fini garçon.")
          console.log('se detiene la cola')
        }
      })();
      if (message.guild.connection) message.guild.voice.connection.disconnect();
      
      break;
   
  }
})

client.login(process.env.MUSICTOKEN);