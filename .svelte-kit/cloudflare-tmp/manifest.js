export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["anytool.svg","apple-touch-icon.png","favicon-96x96.png","favicon.ico","favicon.png","favicon.svg","site.webmanifest","web-app-manifest-192x192.png","web-app-manifest-512x512.png"]),
	mimeTypes: {".svg":"image/svg+xml",".png":"image/png",".webmanifest":"application/manifest+json"},
	_: {
		client: {start:"_app/immutable/entry/start.BQh9rZQC.js",app:"_app/immutable/entry/app.Rci29JHO.js",imports:["_app/immutable/entry/start.BQh9rZQC.js","_app/immutable/chunks/DgSQH2XE.js","_app/immutable/chunks/DjTaFVjF.js","_app/immutable/chunks/CsMi2wPb.js","_app/immutable/chunks/Ck19dI_4.js","_app/immutable/chunks/C2QGexOf.js","_app/immutable/entry/app.Rci29JHO.js","_app/immutable/chunks/CsMi2wPb.js","_app/immutable/chunks/DjTaFVjF.js","_app/immutable/chunks/Ck19dI_4.js","_app/immutable/chunks/C2QGexOf.js","_app/immutable/chunks/D5ZjBwPo.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/auth/[...all]",
				pattern: /^\/api\/auth(?:\/([^]*))?\/?$/,
				params: [{"name":"all","optional":false,"rest":true,"chained":true}],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/auth/_...all_/_server.ts.js'))
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

export const prerendered = new Set([]);

export const base_path = "";
