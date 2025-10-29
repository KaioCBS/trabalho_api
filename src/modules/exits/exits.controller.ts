import { Router, type Request, type Response, type Express } from "express";
import { v4 as uuid } from "uuid";
import { Exit } from "./types";
import { ExitsService } from "./exits.service";

export class ExitsController{
constructor(private readonly exitsService: ExitsService){
    this.create = this.create.bind(this);
    this.create = this.create.bind(this);
}

   create =(request: Request, response: Response) => {
        const { userId } = request.body;
        const result = this.exitsService.create(userId);
        response.status(201).json(result);
    }

     getAll = (_request: Request, response: Response) => {
        const result = this.exitsService.getAll();
        response.status(200).json(result);
    }
}