'use strict';

import NodeCache from 'node-cache';
import { validationResult } from '../validations';
import config from '../config';

const nodeCache = new NodeCache();
const { defaultCacheTtl } = config;

const requestResponse = (req, res, next) => {
  console.info(`${req.method} ${req.originalUrl}`);
  res.on('finish', () => {
    console.info(
      `${res.statusCode} ${res.statusMessage}; ${res.get('X-Response-Time')} ${
        res.get('Content-Length') || 0
      }b sent`
    );
  });
  next();
};

const errorHandler = (err, req, res, next) => {
  err && console.error('Error: ', err);
  res.status(err.status || 500).send(err.message);
};

const cache = () => {
  return (req, res, next) => {
    const key = `__express__${req.originalUrl || req.url}`;
    const cachedBody = nodeCache.get(key);
    if (cachedBody) {
      res.send(JSON.parse(cachedBody));
      return;
    } else {
      res.sendResponse = res.send;
      res.send = body => {
        nodeCache.set(key, body, defaultCacheTtl);
        res.sendResponse(body);
      };
      next();
    }
  };
};

const validationHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export { requestResponse, errorHandler, cache, validationHandler };
