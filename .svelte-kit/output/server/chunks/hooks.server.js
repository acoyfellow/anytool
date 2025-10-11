import { i as initAuth } from "./auth.js";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { H as building } from "./app-server.js";
import { error } from "@sveltejs/kit";
const handle = async ({ event, resolve }) => {
  if (building) return await resolve(event);
  try {
    const db = event.platform?.env?.DB;
    if (!db) return error(500, "D1 database not available");
    const auth = initAuth(db, event.platform?.env);
    try {
      const session = await auth.api.getSession({
        headers: event.request.headers
      });
      event.locals.user = session?.user || null;
      event.locals.session = session?.session || null;
    } catch (sessionError) {
      console.error("Session loading error:", sessionError);
      event.locals.user = null;
      event.locals.session = null;
    }
    const response = await svelteKitHandler({ event, resolve, auth, building });
    return response;
  } catch (err) {
    console.error(err);
    return error(500, "Service temporarily unavailable");
  }
};
export {
  handle
};
