import Express  from "express";
import verifyToken from "../middlewares/verifytoken";
import {createApplication
     ,getApplicationsByCampaign,
     getApplicationDetails,
     updateApplicationStatus,
deleteApplication,

} from "../controllers/feature/applicationControllers"
const router = Express.Router()

//routes
router.post("/campaigns/:campaignId/applications",verifyToken,createApplication);
router.get("/campaigns/:campaignId/applications",verifyToken,getApplicationsByCampaign);
router.get("/:applicationId",getApplicationDetails);
router.patch("/status/:applicationId",verifyToken,updateApplicationStatus);
router.delete("/delete/:applicationId",verifyToken,deleteApplication);



export default router;