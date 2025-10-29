import { Router, type Request, type Response, type Express } from "express";
import { v4 as uuid } from "uuid";
import { Exit } from "./types";

export class ExitsService{
    exits: Exit[] = [];

    constructor() {}

   create(userId: String) {
        const exit ={
            id: uuid(),
           createdAt: new Date(),
           userId, 
        };

        this.exits.push(exit);
        return exit;
    }

     getAll(){
        return this.exits;
    }
}