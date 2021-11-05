const dotenv = require('dotenv');

const conf = dotenv.config({
    path: `${__dirname}/../.env`
});

if (conf.error) {
    //throw new Error(conf.error.message);
}

module.exports = {
    API_URL: process.env.API_URL
};