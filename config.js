var config = {
  host: process.env.HOST || 'http://localhost',
  port: process.env.PORT,
  announcementUrl: 'https://www.odu.edu/announcements',
  mongoLabUri: process.env.MONGOLAB_URI || 'mongodb://localhost:27017'
};

module.exports = config;
