import { google } from 'googleapis';

const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

import {
  getSubscriptions,
  getSubscriptionStatus,
  getSubscription,
  createSubscription,
  updateSubscription
} from '../mongodb';
import { badImplementationRequest, badRequest } from '../response-codes';
import config from '../config';
import { generateAppleJwtToken } from '../utilities';

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

exports.updateSubscription = async payload => {
  try {
    const [error, updatedSubscription] = await updateSubscription(payload);
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

exports.getSubscriptionProducts = async platform => {
  let response = [];
  if (platform === 'android') {
    response = await getAvailableAndroidSubscriptions();
  } else if (platform === 'ios') {
    response = await getAvailableAppleSubscriptions();
  }
  return [200, response];
};

async function getAvailableAppleSubscriptions() {
  const URL_APPLE_CONNECT_API = 'https://api.appstoreconnect.apple.com/v1';
  const appleJwtToken = generateAppleJwtToken();
  if (!appleJwtToken) {
    return [];
  }

  const config = {
    headers: {
      Authorization: `Bearer ${appleJwtToken}`
    }
  };

  const urlApps = `${URL_APPLE_CONNECT_API}/apps?filter[name]=Sheen Magazine`;
  const response = await fetch(urlApps, config);
  const data = await response.json();

  if (data.length) {
    const { id: appId } = data[0];

    const urlInAppPurchaseProducts = `${URL_APPLE_CONNECT_API}/apps/${appId}/inAppPurchases?filter[inAppPurchaseType]=NON_CONSUMABLE`;

    const response = await fetch(urlInAppPurchaseProducts, config);
    const data = await response.json();

    return data.map(({ id, attributes }) => ({
      id,
      type: attributes.productId
    }));
  }

  return [];
}

async function getAvailableAndroidSubscriptions() {
  const { packageName, clientEmail, privateKey } = config.subscription.apple;

  const client = new google.auth.JWT(clientEmail, undefined, privateKey, [
    'https://www.googleapis.com/auth/androidpublisher'
  ]);

  const androidApi = google.androidpublisher({ version: 'v3', auth: client });

  await client.authorize();

  const response = await androidApi.inappproducts.list({ packageName });

  const result = response.data.inappproduct.map(({ sku }) => ({
    id: sku || '',
    type: sku || undefined
  }));
  return result || [];
}
