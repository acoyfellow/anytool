import "../../chunks/async.js";
import "clsx";
import { createAuthClient } from "better-auth/client";
const authClient = createAuthClient({
  // Let Better Auth automatically determine the base URL
});
const { signIn, signOut, signUp, useSession } = authClient;
class AuthStore {
  state = { user: null, session: null, isLoading: false };
  // Reactive getters
  get user() {
    return this.state.user;
  }
  get session() {
    return this.state.session;
  }
  get isLoading() {
    return this.state.isLoading;
  }
  get isAuthenticated() {
    return !!this.state.user;
  }
  // Initialize with server data (called from layout)
  initialize(serverUser, serverSession) {
    this.state.user = serverUser;
    this.state.session = serverSession;
    this.state.isLoading = false;
  }
  // Auth actions that update the store
  async signIn(email, password) {
    this.state.isLoading = true;
    try {
      const result = await signIn.email({ email, password });
      if (result.error) {
        return alert(result.error.message);
      }
      this.state.user = result.data.user;
      this.state.isLoading = false;
      return result;
    } catch (error) {
      throw error;
    } finally {
      this.state.isLoading = false;
    }
  }
  async signUp(email, password, name) {
    this.state.isLoading = true;
    try {
      const result = await signUp.email({ email, password, name: name || email.split("@")[0] });
      if (result.error) {
        return alert(result.error.message);
      }
      return result;
    } catch (error) {
      throw error;
    } finally {
      this.state.isLoading = false;
    }
  }
  async signOut() {
    this.state.isLoading = true;
    try {
      await signOut();
      this.state.user = null;
      this.state.session = null;
      this.state.isLoading = false;
    } catch (error) {
      throw error;
    } finally {
      this.state.isLoading = false;
    }
  }
  // Update session data (for when auth state changes)
  updateSession(user, session) {
    this.state.user = user;
    this.state.session = session;
    this.state.isLoading = false;
  }
}
const authStore = new AuthStore();
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, children } = $$props;
    authStore.initialize(data.user, data.session);
    children($$renderer2);
    $$renderer2.push(`<!---->`);
  });
}
export {
  _layout as default
};
