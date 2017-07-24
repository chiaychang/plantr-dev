// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'        : '157758501458012', // your App ID
        'clientSecret'    : '078b7de600bae65567b2c4d76d8e26f6', // your App Secret
        'callbackURL'     : 'https://plantr-dev3.herokuapp.com/auth/facebook/callback',
        'profileFields'   : ['emails']
    },

    'twitterAuth' : {
        'consumerKey'        : 'KhUqwyeruE6CrysjjtM8gE1RI',
        'consumerSecret'     : '83Mr1jZ8RAymQqXeiJrn6sJxIAy1tV2blKwGiZ9ua139UePro6',
        'callbackURL'        : 'https://plantr-dev3.herokuapp.com/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'         : '542620950462-qcv465k0sc50q0phvoj2l3m5lnase691.apps.googleusercontent.com',
        'clientSecret'     : 'dy8R_gBDd9DWbMabQpC6Xpx4',
        'callbackURL'      : 'https://plantr-dev3.herokuapp.com/auth/google/callback'
    }

};