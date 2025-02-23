import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  toggleSubscription,
  getSubscriptionChannels,
  getuserChannelSubscription,
} from "../controllers/subscription.controller.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/c/:channelId")
  .get(getSubscriptionChannels)
  .post(toggleSubscription);

router.route("/u/:subscriberId").get(getuserChannelSubscription);

export default router;
