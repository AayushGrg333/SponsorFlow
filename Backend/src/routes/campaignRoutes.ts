import Express  from "express";
import verifyToken from "../middlewares/verifytoken";
const router = Express.Router();
import { 
     createCampaignController,
     getCampaignController,
     listCampaignsController,
     updateCampaignController,
     deleteCampaignController,

} from "../controllers/feature/campaignControllers";

//routes
router.get("/", listCampaignsController);
router.get("/:campaignId", getCampaignController);
router.post("/create", verifyToken, createCampaignController);
router.put("/:campaignId", verifyToken, updateCampaignController);
router.delete("/:campaignId", verifyToken, deleteCampaignController);


export default router;
