import { config } from "../config";
import { App } from "./app";

function bootstrap(){
const app = new App();
app.start(config.port);
}

bootstrap();