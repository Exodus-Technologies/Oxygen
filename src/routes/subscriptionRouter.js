import express from 'express';

const { Router } = express;
import { SubscriptionController } from '../controllers';
import {
  subscriptionQueryValidation,
  subscriptionPostBodyValidation,
  subscriptionStatusQueryValidation,
  subscriptionIdParamValidation,
  subscriptionUpdateBodyValidation
  // platfromQueryValidation
} from '../validations';
import { validationHandler } from '../middlewares';

const router = Router();

router.get(
  '/subscription-service/getSubscriptions',
  subscriptionQueryValidation,
  validationHandler,
  SubscriptionController.getSubscriptions
);

router.get(
  '/subscription-service/getSubscription/:subscriptionId',
  subscriptionIdParamValidation,
  validationHandler,
  SubscriptionController.getSubscription
);

router.get(
  '/subscription-service/getSubscriptionStatus',
  subscriptionStatusQueryValidation,
  validationHandler,
  SubscriptionController.getSubscriptionStatus
);

router.post(
  '/subscription-service/createSubscription',
  subscriptionPostBodyValidation,
  validationHandler,
  SubscriptionController.createSubscription
);

router.put(
  '/subscription-service/updateSubscription',
  subscriptionUpdateBodyValidation,
  validationHandler,
  SubscriptionController.updateSubscription
);

export default router;
