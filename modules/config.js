let envs = {}
if(process.env.NODE_ENV !=="production"){
	const dotenv = require("dotenv");
	const result = dotenv.config();
	envs = result.parsed
}

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || envs.FIREBASE_API_KEY,
  authDomain: process.env.AUTH_DOMAIN || envs.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL || envs.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID || envs.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || envs.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || envs.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID || envs.FIREBASE_APP_ID
};

const mongoConfig = process.env.DB_CONNECTION  || envs.DB_CONNECTION ;
const jwtPassword = process.env.JWT_PASSWORD  || envs.JWT_PASSWORD ;

const config = {
	firebaseConfig,
  /*mongoConfig,*/
  jwtPassword
}

exports.firebaseConfig = firebaseConfig
//exports.mongoConfig = mongoConfig


module.exports = config;
