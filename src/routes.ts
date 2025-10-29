import { type Express } from "express";
import { ExitsModule } from "./modules/exits/exits.module";
export class Routes{
    constructor(app: Express){
        new ExitsModule(app);
    }
}