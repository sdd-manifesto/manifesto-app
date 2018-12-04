import * as express from "express";
import { getLocalFile } from "./content";

export const policyRouter = express.Router();

policyRouter.get("/cookie-policy.html", async (req: express.Request, res: express.Response) => {
    const policy = await getLocalFile("legal/COOKIE_POLICY.md");
    res.render("policy", { policy });
});

policyRouter.get("/privacy-policy.html", async (req: express.Request, res: express.Response) => {
    const policy = await getLocalFile("legal/PRIVACY_POLICY.md");
    res.render("policy", { policy });
});
