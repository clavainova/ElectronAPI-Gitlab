let jwt = undefined;
let authData = {};
module.exports = {

    setJwt: (jwt) => {
        jwt = jwt;
    },

    setAuthData: (auth) => {
        authData = auth;
    },

    getJwt: () => {
        return jwt;
    },

    getAuthData: () => {
        return authData;
    }
}