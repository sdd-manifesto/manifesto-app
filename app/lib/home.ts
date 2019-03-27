import * as dateFormat from "dateformat";
import * as express from "express";
import * as moment from "moment";
import { GitInfo } from "../index";
import { Auth0Config } from "./auth";
import {
    getFile,
    MarkdownConverter,
} from "./content";
import { database } from "./mongo";

export const homeRouter = express.Router();

homeRouter.use((req, res, next) => {
    res.locals.version = GitInfo.version;
    res.locals.sha = GitInfo.sha;
    res.locals.date = dateFormat(new Date(GitInfo.date), "mmmm d, yyyy");
    next();
});

homeRouter.get("/", async (req: express.Request, res: express.Response) => {
    await renderHome(req, res);
});

homeRouter.get("/i18n/:language", async (req: express.Request, res: express.Response) => {
    await renderHome(req, res);
});

async function renderHome(req: express.Request, res: express.Response): Promise<void> {
    const db = await database();
    const sigs = db.collection("signatures");

    const count = await sigs.countDocuments({ signed: true });
    const profiles = await sigs.find({ signed: true }).sort({ ts: -1 }).limit(66).toArray();
    profiles.forEach(p => {
        p.ago = moment(p.ts).fromNow();
    });
    const message = req.flash("info");
    const fileName = req.params.language ? `README_${req.params.language}.md` : "README.md";

    const html = await getFile(fileName, async content =>
        MarkdownConverter(content.split("\n").slice(2).join("\n")));
    const state = nonce();

    req.session.state = state;

    res.render("home", {
        profiles,
        count,
        html,
        message,
        auth0: Auth0Config,
        state,
    });
}

homeRouter.get("/signatures.html", async (req: express.Request, res: express.Response) => {

    const db = await database();
    const sigs = db.collection("signatures");

    const count = await sigs.countDocuments({ signed: true });

    res.render("signatures", {
        count,
    });
});

function nonce(length: number = 40): string {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
