'use strict';

require('dotenv').config();

const config = {
  NODE_ENV: process.env.NODE_ENV,
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  defaultCacheTtl: parseInt(process.env.DEFAULT_CACHE_TTL, 10),
  sources: {
    database: {
      clusterName: process.env.CLUSTER_NAME,
      dbName: process.env.DB_NAME,
      dbUser: process.env.DB_USER,
      dbPass: process.env.DB_PASS,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    },
    subscription: {
      android: {
        packageName: process.env.GOOGLE_PACKAGE_NAME,
        clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
        privateKey: process.env.GOOGLE_PRIVATE_KEY
      },
      apple: {
        issuer: process.env.APPLE_ISSUER,
        keyId: process.env.APPLE_KEY_ID,
        privateKey: process.env.APPLE_PRIVATE_KEY
      }
    }
  }
};

export default config;
