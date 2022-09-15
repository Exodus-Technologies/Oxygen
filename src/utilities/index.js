import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import config from '../config';

import { DEFAULT_TIME_FORMAT } from '../constants';

export const getSubscriptionStartDate = () => {
  return moment(new Date()).format(DEFAULT_TIME_FORMAT);
};

export const getSubscriptionEndDate = recurring => {
  const date = new Date();
  let year = moment(date).year();
  let month = moment(date).month();
  const day = moment(date).date();
  const isLeapYear = moment(date).isLeapYear();
  if (recurring === 'monthly') {
    const monthlyMomentObj = {
      year: month === 11 && day > 29 && day <= 31 ? (year += 1) : year,
      month: (month += 1),
      date: month === 1 && isLeapYear ? 29 : !isLeapYear ? day : 28
    };
    return moment(date).utc().set(monthlyMomentObj).format(DEFAULT_TIME_FORMAT);
  } else {
    const yearlyMomentObj = {
      year: (year += 1),
      month,
      date: month === 1 && isLeapYear ? 29 : !isLeapYear ? day : 28
    };
    return moment(date).utc().set(yearlyMomentObj).format(DEFAULT_TIME_FORMAT);
  }
};

export const createMoment = (date = new Date()) => {
  return moment(date);
};

export const createFormattedDate = (date = new Date()) => {
  return moment(date).format(DEFAULT_TIME_FORMAT);
};

export const createSubscriptionId = () => {
  return `subscription-${uuidv4()}`;
};

export const fancyTimeFormat = duration => {
  // Hours, minutes and seconds
  const hrs = ~~(duration / 3600);
  const mins = ~~((duration % 3600) / 60);
  const secs = ~~duration % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  let ret = '';

  if (hrs > 0) {
    ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
  }

  ret += '' + mins + ':' + (secs < 10 ? '0' : '');
  ret += '' + secs;
  return ret;
};

export const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const generateAppleJwtToken = () => {
  const { issuer, keyId, privateKey } = config.subscription.apple;
  const expirationTime = moment().add(10, 'minutes').valueOf() / 1000;

  try {
    const token = sign(
      {
        exp: Math.ceil(expirationTime)
      },
      privateKey,
      {
        issuer,
        audience: 'appstoreconnect-v1',
        algorithm: 'ES256',
        header: {
          alg: 'ES256',
          kid: keyId,
          typ: 'JWT'
        }
      }
    );
    return token;
  } catch {
    return undefined;
  }
};
