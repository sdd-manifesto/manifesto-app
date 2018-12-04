import * as express from "express";
import { getFile } from "./content";

export const policyRouter = express.Router();

policyRouter.get("/cookie-policy.html", async (req: express.Request, res: express.Response) => {
    const policy = await getFile("legal/COOKIE_POLICY.md");
    res.render("policy", { policy });
});

policyRouter.get("/privacy-policy.html", async (req: express.Request, res: express.Response) => {
    const policy = await getFile("legal/PRIVACY_POLICY.md");
    res.render("policy", { policy });
});
