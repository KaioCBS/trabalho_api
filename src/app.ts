import express, { type Express } from "express";
import { Routes } from "./routes";

export class App {
    private server: Express;
    constructor() {
        this.server = express();
        this.server.use(express.json());
        new Routes(this.server);
    }

    public start(port: number){
        this.server.listen(port, (error) => {
            if (error){
                console.error(error);
                return;
            }

            console.log("server is runnnin on port 3000");
        });
    }
}