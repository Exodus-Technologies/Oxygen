'use strict';

import {
  getSubscriptions,
  getSubscriptionStatus,
  getSubscription,
  createSubscription,
<<<<<<< HEAD
  updateSubscription
=======
  updateSubscription,
  getUserSubscriptions
>>>>>>> d89219b (Fixed subscriptions issues)
} from '../mongodb';
import { badImplementationRequest, badRequest } from '../response-codes';

exports.getSubscriptions = async query => {
  try {
    const subscriptions = await getSubscriptions(query);
    if (subscriptions) {
      return [
        200,
        {
          message: 'Successful fetch for subscription with query params.',
          subscriptions
        }
      ];
    }
    return badRequest(`No subscriptions found with selected query params.`);
  } catch (err) {
    console.log('Error getting all subscriptions: ', err);
    return badImplementationRequest('Error getting subscriptions.');
  }
};

<<<<<<< HEAD
=======
exports.getUserSubscriptions = async userId => {
  try {
    const subscription = await getUserSubscriptions(userId);
    if (subscription) {
      return [
        200,
        {
          message: 'Successful fetch for subscriptions with user id.',
          subscription
        }
      ];
    }
    return badRequest(`No subscriptions found with user id: ${userId}.`);
  } catch (err) {
    console.log('Error getting remaining time on subscription: ', err);
    return badImplementationRequest(
      'Error getting remaining time on subscription.'
    );
  }
};

>>>>>>> d89219b (Fixed subscriptions issues)
exports.getSubscription = async subscriptionId => {
  try {
    const subscription = await getSubscription(subscriptionId);
    if (subscription) {
      return [
        200,
        {
          message: 'Successful fetch for subscription with id.',
          subscription
        }
      ];
    }
    return badRequest(`No subscriptions found with id: ${subscriptionId}.`);
  } catch (err) {
    console.log('Error getting remaining time on subscription: ', err);
    return badImplementationRequest(
      'Error getting remaining time on subscription.'
    );
  }
};

exports.getSubscriptionStatus = async query => {
  try {
    const [message] = await getSubscriptionStatus(query);
    if (message) {
      return [
        200,
        {
          subscriptionStatus: message
        }
      ];
    }
    return badRequest(`No subscriptions found with query.`);
  } catch (err) {
    console.log('Error getting remaining time on subscription: ', err);
    return badImplementationRequest(
      'Error getting remaining time on subscription.'
    );
  }
};

exports.createSubscription = async payload => {
  try {
    const [error, subscription] = await createSubscription(payload);
    if (subscription) {
      return [
        200,
        {
          message: 'Successful creation of subscription.',
          subscription
        }
      ];
    }
    return badRequest(error.message);
  } catch (err) {
    console.log('Error creating subscription: ', err);
    return badImplementationRequest('Error creating subscription.');
  }
};

<<<<<<< HEAD
exports.updateSubscription = async payload => {
  try {
    const [error, updatedSubscription] = await updateSubscription(payload);
=======
exports.updateSubscription = async (subscriptionId, payload) => {
  try {
    const [error, updatedSubscription] = await updateSubscription(subscriptionId, payload);
>>>>>>> d89219b (Fixed subscriptions issues)
    if (updatedSubscription) {
      return [
        200,
        {
          message: 'Successful update of subscription.',
          updatedSubscription
        }
      ];
    }
    return badRequest(error.message);
  } catch (err) {
    console.log('Error updating subscription: ', err);
    return badImplementationRequest('Error updating subscription.');
  }
};
