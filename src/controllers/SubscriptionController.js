'use strict';

import { SubscriptionService } from '../services';

exports.getSubscriptions = async (req, res, next) => {
  try {
    const { query } = req;
    const [statusCode, response] = await SubscriptionService.getSubscriptions(
      query
    );
    res.status(statusCode).send(response);
  } catch (err) {
    console.log(`Error with getting subscriptions: `, err);
    next(err);
  }
};

exports.createSubscription = async (req, res, next) => {
  try {
    const { body } = req;
    const [statusCode, response] = await SubscriptionService.createSubscription(
      body
    );
    res.status(statusCode).send(response);
  } catch (err) {
    console.log(`Error with getting subscriptions: `, err);
    next(err);
  }
};

exports.updateSubscription = async (req, res, next) => {
  try {
    const { body } = req;
    const [statusCode, response] = await SubscriptionService.updateSubscription(
      body
    );
    res.status(statusCode).send(response);
  } catch (err) {
    console.log(`Error with updating subscription: `, err);
    next(err);
  }
};

exports.getSubscriptionStatus = async (req, res, next) => {
  try {
    const { query } = req;
    const [statusCode, response] =
      await SubscriptionService.getSubscriptionStatus(query);
    res.status(statusCode).send(response);
  } catch (err) {
    console.log(`Error with getting subscription status: `, err);
    next(err);
  }
};
