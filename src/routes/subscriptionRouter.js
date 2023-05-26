import express from 'express';

const { Router } = express;
import { SubscriptionController } from '../controllers';
import {
  subscriptionQueryValidation,
  subscriptionPostBodyValidation,
  subscriptionStatusQueryValidation,
  subscriptionIdParamValidation,
  subscriptionUpdateBodyValidation,
  userIdParamValidation
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
  '/subscription-service/getUserSubscriptions/:userId',
  userIdParamValidation,
  validationHandler,
  SubscriptionController.getUserSubscriptions
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
  '/subscription-service/updateSubscription/:subscriptionId',
  subscriptionUpdateBodyValidation,
  validationHandler,
  SubscriptionController.updateSubscription
);

router.delete(
  '/subscription-service/deleteSubscription/:subscriptionId',
  subscriptionIdParamValidation,
  validationHandler,
  SubscriptionController.deleteSubscription
);

router.delete(
  '/subscription-service/deleteSubscriptions/:userId',
  userIdParamValidation,
  validationHandler,
  SubscriptionController.deleteSubscriptions
);

export default router;
