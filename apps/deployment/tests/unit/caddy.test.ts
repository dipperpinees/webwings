// import path from "path";
// import {StaticCaddyService} from "../../src/lib/caddy"
// import { existsSync, unlinkSync } from "fs";
// import {Container} from "typedi";

// afterEach(() => {
//     unlinkSync(path.resolve("caddy", "static", "test.caddyfile"));
// });

// test('create new config', () => {
//     const caddy = Container.;
//     caddy.new({id: "test", domain: "test.com", staticPath: path.resolve()});
//     expect(existsSync(path.resolve("caddy", "static", "test.caddyfile"))).toBeTruthy();
// });