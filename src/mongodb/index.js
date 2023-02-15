'use strict';

import config from '../config';
import { ISSUE_SUBSCRIPTION_TYPE, VIDEO_SUBSCRIPTION_TYPE } from '../constants';
import models from '../models';
import { badRequest } from '../response-codes';
import {
  createMoment,
  getSubscriptionStartDate,
  getSubscriptionEndDate
} from '../utilities';

const { dbUser, dbPass, clusterName, dbName } = config.sources.database;

export const generateDBUri = () => {
  return `mongodb+srv://${dbUser}:${dbPass}@${clusterName}.ybdno.mongodb.net/${dbName}?retryWrites=true&w=majority`;
};

const queryOps = { __v: 0, _id: 0 };

export const getSubscriptions = async query => {
  try {
    const { Subscription } = models;
    const page = parseInt(query.page);
    const limit = parseInt(query.limit);
    const skipIndex = (page - 1) * limit;
    return await Subscription.find({ ...query }, queryOps)
      .sort({ _id: 1 })
      .limit(limit)
      .skip(skipIndex)
      .sort({ endDate: 'asc' })
      .exec();
  } catch (err) {
    console.log('Error getting subscriptions data from db: ', err);
  }
};

export const getUserSubscriptions = async userId => {
  try {
    const { Subscription } = models;
    const subscription = await Subscription.find({ userId });
    return subscription;
  } catch (err) {
    console.log('Error getting subscription data from db by id: ', err);
  }
};

export const getSubscription = async subscriptionId => {
  try {
    const { Subscription } = models;
    const subscription = await Subscription.findOne({ subscriptionId });
    return subscription;
  } catch (err) {
    console.log('Error getting subscription data from db by id: ', err);
  }
};

export const getSubscriptionStatus = async query => {
  try {
    const { Subscription } = models;
    const { subscriptionId } = query;
    const subscription = await Subscription.findOne({ subscriptionId });
    if (subscription) {
      const endDate = createMoment(subscription.endDate);
      const currentDate = createMoment();
      const diffInMonths = endDate.diff(currentDate, 'months');
      const diffInWeeks = endDate.diff(currentDate, 'weeks');
      if (Math.sign(diffInMonths) > 0) {
        return [`Subscription ends in ${diffInMonths} months.`];
      }
      if (Math.sign(diffInMonths) === 0) {
        return [`Subscription ends in ${diffInWeeks} weeks.`];
      } else {
        return [`Subscription expired ${diffInMonths} months ago.`];
      }
    }
    return [''];
  } catch (err) {
    console.log('Error getting subscription data to db: ', err);
  }
};

/**
 * Issues: individual purchase (lifetime) and yearly subscriptions (bucket up to six)
 * Videos: month and yearly subscriptions (access or no access) to paid videos
 */
export const createSubscription = async payload => {
  try {
    const { Subscription } = models;
    const { type, recurring, product } = payload;
    //Issue logic
    if (type === ISSUE_SUBSCRIPTION_TYPE) {
      if (recurring === 'one-time') {
        const body = {
          ...payload,
          left: product === 'single' ? 0 : 6 - payload.ids.length,
          startDate: getSubscriptionStartDate(),
          purchaseDate: getSubscriptionStartDate(),
          access: 'LIFE-TIME'
        };
        const newSubscription = new Subscription(body);
        const createdSubscription = await newSubscription.save();
        return [null, createdSubscription];
      }
      //yearly
      else {
        const body = {
          ...payload,
          left: product === 'single' ? 0 : 6 - payload.ids.length,
          startDate: getSubscriptionStartDate(),
          endDate: getSubscriptionEndDate(recurring),
          purchaseDate: getSubscriptionStartDate(),
          access: 'YEARLY'
        };
        const newSubscription = new Subscription(body);
        const createdSubscription = await newSubscription.save();
        return [null, createdSubscription];
      }
    } else if (type === VIDEO_SUBSCRIPTION_TYPE) {
      const body = {
        ...payload,
        startDate: getSubscriptionStartDate(),
        endDate: getSubscriptionEndDate(product),
        purchaseDate: getSubscriptionStartDate(),
        access: product
      };
      const newSubscription = new Subscription(body);
      const createdSubscription = await newSubscription.save();
      return [null, createdSubscription];
    }
  } catch (err) {
    console.log('Error saving subscription data to db: ', err);
  }
};

//Keeps track of remaining subscriptions avaiable and updating endDate.
export const updateSubscription = async (subscriptionId, payload) => {
  try {
    const { Subscription } = models;
    const { id } = payload;
    const filter = { _id: subscriptionId };
    const subscription = await Subscription.findOne(filter);
    if (subscription) {
      if (subscription.ids.length > 5) {
        return badRequest('You have no more slots for subscriptions');
      }
      const newIds = [...subscription.ids, id];
      const options = { upsert: true, new: true };
      const update = {
        ids: newIds,
        left: 6 - newIds.length
      };

      const updatedSubscription = await Subscription.findOneAndUpdate(
        filter,
        update,
        options
      );
      if (updatedSubscription) {
        return [null, updatedSubscription];
      }
    }
    return badRequest('Subscription with ID provided doesnt exist');
  } catch (err) {
    console.log('Error updating issue data to db: ', err);
  }
};
