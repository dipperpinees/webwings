import path from "path";
import { Service } from 'typedi';

@Service()
export class Config {
    caddyPath: string = path.resolve("caddy");
    projectPath: string = path.resolve("projects");
}