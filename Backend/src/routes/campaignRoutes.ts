import Express  from "express";
import verifyToken from "../middlewares/verifytoken";
const router = Express.Router();
import { 
     createCampaignController,
     getCampaignController,
     listCampaignsController,
     updateCampaignController,
     deleteCampaignController,
     getCampaignByCompanyController

} from "../controllers/feature/campaignControllers";

//routes
router.get("/campaigns", listCampaignsController);
router.get("/campaigns/ :campaignId", getCampaignController);
router.post("/campaigns", verifyToken, createCampaignController);
router.put("/campaigns/:campaignId", verifyToken, updateCampaignController);
router.delete("/campaigns/:campaignId", verifyToken, deleteCampaignController);
router.get("/companies/:companyId/campaigns", getCampaignByCompanyController);


export default router;
