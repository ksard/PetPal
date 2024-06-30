const dotenv = require('dotenv');
dotenv.config()
const { OAuth2Client } = require('google-auth-library');

const oauth2Client = new OAuth2Client(
    process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.SERVER_URL+process.env.CALLBACK_URL
)

module.exports= { oauth2Client };