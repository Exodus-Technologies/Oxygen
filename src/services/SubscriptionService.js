'use strict';

import {
  getSubscriptions,
  getSubscriptionStatus,
  getSubscription,
  createSubscription,
  updateSubscription,
  getUserSubscriptions,
  deleteSubscription,
  deleteSubscriptions
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

exports.updateSubscription = async (subscriptionId, payload) => {
  try {
    const [error, updatedSubscription] = await updateSubscription(
      subscriptionId,
      payload
    );
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

exports.deleteSubscription = async subscriptionId => {
  try {
    const [error, deletedSubscription] = await deleteSubscription(
      subscriptionId
    );
    if (deletedSubscription) {
      return [204];
    }
    return badRequest(error.message);
  } catch (err) {
    console.log('Error deleting subscription: ', err);
    return badImplementationRequest('Error deleting subscription.');
  }
};

exports.deleteSubscriptions = async userId => {
  try {
    const [error, deletedSubscriptions] = await deleteSubscriptions(userId);
    if (deletedSubscriptions) {
      return [204];
    }
    return badRequest(error.message);
  } catch (err) {
    console.log('Error deleting subscriptions by user: ', err);
    return badImplementationRequest('Error deleting subscriptions by user.');
  }
};
