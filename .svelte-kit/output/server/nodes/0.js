import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.D9uDIWRb.js","_app/immutable/chunks/D5ZjBwPo.js","_app/immutable/chunks/CsMi2wPb.js","_app/immutable/chunks/C2QGexOf.js"];
export const stylesheets = ["_app/immutable/assets/0.gUSe26vJ.css"];
export const fonts = [];
