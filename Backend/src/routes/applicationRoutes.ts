import Express  from "express";
import verifyToken from "../middlewares/verifytoken";
import {createApplication
     ,getApplicationsByCampaign,
     getApplicationDetails,
     updateApplicationStatus,
deleteApplication,
getApplicationsByInfluencer
} from "../controllers/feature/applicationControllers"
const router = Express.Router()

//routes
router.post("/campaigns/:campaignId/applications",verifyToken,createApplication);
router.get("/campaigns/:campaignId/applications",verifyToken,getApplicationsByCampaign);
router.get("/applications/:applicationId",verifyToken,getApplicationDetails);
router.patch("/applications/:applicationId/status",verifyToken,updateApplicationStatus);
router.delete("/applications/:applicationId",verifyToken,deleteApplication);
router.get("/:influencerId/applications",verifyToken,getApplicationsByInfluencer);



export default router;