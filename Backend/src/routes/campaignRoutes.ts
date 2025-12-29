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
router.get("/", listCampaignsController);
router.get("/:campaignId", getCampaignController);
router.post("/", verifyToken, createCampaignController);
router.put("/:campaignId", verifyToken, updateCampaignController);
router.delete("/:campaignId", verifyToken, deleteCampaignController);
router.get("/companies/:companyId/campaigns", getCampaignByCompanyController);


export default router;
