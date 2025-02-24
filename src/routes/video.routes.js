import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
import {
  getAllVideos,
  publishVideo,
  getVideoById,
  updateVideoThumbnail,
  deleteVideo,
  tooglePublishStatus,
  deleteVideoThumbnail,
} from "../controllers/video.controller.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getAllVideos)
  .post(
    upload.fields([
      { name: "videoFile", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    publishVideo
  );

router.route("/:videoId").get(getVideoById);

router.route("/video/:videoId").delete(deleteVideo);

router
  .route("/thumbnail/:videoId")
  .delete(deleteVideoThumbnail)
  .patch(upload.single("thumbnail"), updateVideoThumbnail);

router.route("/toggle/publish/:videoId").patch(tooglePublishStatus);

export default router;
