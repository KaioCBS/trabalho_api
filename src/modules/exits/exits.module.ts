import { Router, type Request, type Response, type Express } from "express";
import { v4 as uuid } from "uuid";
import { Exit } from "./types";
import { ExitsService } from "./exits.service";
import { ExitsController } from "./exits.controller";

export class ExitsModule{
    router: Router;

    constructor(app: Express) {
        this.router = Router();

        const exitsService = new ExitsService();
        const exitsController = new ExitsController(exitsService);

        this.router.post("/", exitsController.create);
        this.router.get("/", exitsController.getAll);

        app.use("/exits", this.router);
    }
}