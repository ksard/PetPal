const { oauth2Client } = require("../config/helper");
const dotenv = require("dotenv");
dotenv.config();

const getLoginUrl = (req, res) => {
    const { state } = req.query;

    res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
    res.header('Referrer-Policy', 'no-referrer-when-downgrade'); //no referrer when using http while testing
    const authorizeUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: process.env.SCOPE,
        prompt: 'consent',
        state: state
    })
    res.json({ url: authorizeUrl });
};

const getUserData = async (req, res) => {
    const data = await callUserInfo();
    res.status(200).json(data)
}

async function callUserInfo() {
    const accessToken = oauth2Client.credentials.access_token;
    const response = await fetch(process.env.OAUTH_USERINFO, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const data = await response.json();
    return data;
}
const getTokens = async (req, res, next) => {
    const code = req.query.code;
    try {
        const { state } = req.query;
        const resToken = await oauth2Client.getToken(code);
        if (resToken.res.status === 200 && resToken.tokens) {
            req.session.isLoggedIn = true;
            req.session.tokens = res.tokens;
            await oauth2Client.setCredentials(resToken.tokens);
            const userData = await callUserInfo();
            if (userData) {
                req.session.user = userData;
                if (!(state==null)) {
                    res.redirect(state);
                }
                else {
                    res.redirect(process.env.CLIENT_URL);
                }
            }
            else {
                res.status(200).json({
                    success: false,
                    message: "User Login Failed",
                });
            }

        }
    }
    catch (e) {
        console.error(e)
        res.status(500).json({
            success: false,
            message: e.message
        });
    }


}

const logout = async (req, res) => {
    try {
        req.session.destroy();
        if (!oauth2Client.credentials || !oauth2Client.credentials?.id_token) {
            return res.status(200).json({ success: true, message: "Logout successful" })
        }
        const revokeRes = await oauth2Client.revokeCredentials();
        if (revokeRes.status === 200) {
            res.status(200).json({ success: true, message: "Logout successful" })

        }
        else {
            res.status(200).json({ success: false, message: "Logout failed" })

        }

    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const isAuthenticated = async (req, res, next) => {
    try {
        if (req.session.user && oauth2Client.credentials.id_token) {

            const loginTicket = await oauth2Client.verifyIdToken({ idToken: oauth2Client.credentials.id_token, audience: process.env.CLIENT_ID });
            if (loginTicket && oauth2Client.eagerRefreshThresholdMillis && oauth2Client.eagerRefreshThresholdMillis < Number(process.env.TOKEN_REFRESH)) {
                const tokenRes = await oauth2Client.refreshAccessToken();
                oauth2Client.setCredentials(tokenRes.credentials);
            }
            next();
        } else {
            res.status(401).json({ success: false, message: 'Unauthorized' });
        }
    }
    catch (error) {
        console.error(error)
        res.status(401).json({ success: false, message: error.message });
    }
};


module.exports = { getLoginUrl, getTokens, getUserData, isAuthenticated, logout };