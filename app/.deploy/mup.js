
module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method
      host: '34.204.108.150',
      username: 'ubuntu',
      pem: '~/Downloads/rl.pem' //'~/.ssh/id_rsa'
    }
  },

  app: {
    name: 'vid2cleantxt-online',
    path: '../',

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://
      ROOT_URL: "https://vid2cleantxt-online.jonathanlehner.com",
      MONGO_URL: process.env.MONGO_URL,
      PORT: 3009,
    },

    docker: {
      // change to 'abernix/meteord:base' if your app is using Meteor 1.4 - 1.5
      image: 'guillim/meteord:node14.18.2',
      //buildInstructions: [
      //  'RUN apt-get install -y gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget'
      //]
    },

    volumes: {
        // passed as '-v /host/path:/container/path' to the docker run command
        '/home': '/home',
    },

    deployCheckWaitTime: 60,
    deployCheckPort: 3009, // might have to delete this
    enableUploadProgressBar: true
  },

  proxy: {
    domains: 'vid2cleantxt-online.jonathanlehner.com',
    ssl: {
      letsEncryptEmail: 'jonathan@milliwayszurich.com',
      forceSSL: true 
    },
    nginxLocationConfig: './config.txt'
  }

};
