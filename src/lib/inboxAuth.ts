/**
 * Sign-in for the private inbox, using Cognito's hosted login page and the
 * OAuth 2.0 authorization-code flow with PKCE (the recommended flow for apps
 * that run in a browser and so can't keep a client secret).
 *
 *   1. signIn(): make a random "verifier", send its SHA-256 hash to Cognito,
 *      and go to Cognito's login page (password + authenticator code).
 *   2. Cognito sends the browser back to /inbox?code=…&state=….
 *   3. finishSignIn(): trade the code + the original verifier for tokens.
 *      Someone who intercepts the code can't use it without the verifier.
 *
 * The access token lives in sessionStorage only: it's gone when the tab
 * closes, and it expires after an hour anyway.
 */
import { INBOX_AUTH } from "@/data/site";

const TOKEN_KEY = "juasoh:inbox:token";
const PENDING_KEY = "juasoh:inbox:pkce";

type StoredToken = { accessToken: string; expiresAt: number };

const redirectUri = () => `${window.location.origin}/inbox`;

function base64Url(bytes: ArrayBuffer | Uint8Array) {
  const array = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let text = "";
  array.forEach((b) => (text += String.fromCharCode(b)));
  return btoa(text).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

const randomString = (bytes = 32) => base64Url(crypto.getRandomValues(new Uint8Array(bytes)));

function safeStorage() {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export const inboxConfigured = () => Boolean(INBOX_AUTH.clientId);

export function getToken(): string | null {
  try {
    const raw = safeStorage()?.getItem(TOKEN_KEY);
    if (!raw) return null;
    const token = JSON.parse(raw) as StoredToken;
    // Treat it as expired a minute early so a request doesn't fail mid-flight.
    if (Date.now() > token.expiresAt - 60_000) {
      safeStorage()?.removeItem(TOKEN_KEY);
      return null;
    }
    return token.accessToken;
  } catch {
    return null;
  }
}

export async function signIn() {
  const verifier = randomString(48);
  const state = randomString(16);
  const challenge = base64Url(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier)));
  safeStorage()?.setItem(PENDING_KEY, JSON.stringify({ verifier, state }));

  const params = new URLSearchParams({
    response_type: "code",
    client_id: INBOX_AUTH.clientId,
    redirect_uri: redirectUri(),
    scope: "openid email",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });
  window.location.assign(`https://${INBOX_AUTH.domain}/oauth2/authorize?${params}`);
}

/** If the URL holds a code from Cognito, exchange it for a token. */
export async function finishSignIn(): Promise<"signed-in" | "nothing-to-do"> {
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  if (!code && !error) return "nothing-to-do";

  // Clean the address bar either way, so a refresh doesn't replay the code.
  window.history.replaceState(null, "", url.pathname);
  if (error) throw new Error(url.searchParams.get("error_description") || error);

  const pending = JSON.parse(safeStorage()?.getItem(PENDING_KEY) || "null") as {
    verifier: string;
    state: string;
  } | null;
  safeStorage()?.removeItem(PENDING_KEY);
  // The state must match what this tab sent, or the response isn't ours.
  if (!pending || pending.state !== state) throw new Error("Sign-in didn't match this tab. Please try again.");

  const response = await fetch(`https://${INBOX_AUTH.domain}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: INBOX_AUTH.clientId,
      code: code!,
      redirect_uri: redirectUri(),
      code_verifier: pending.verifier,
    }),
  });
  if (!response.ok) throw new Error("Couldn't finish signing in. Please try again.");
  const tokens = (await response.json()) as { access_token: string; expires_in: number };
  const stored: StoredToken = {
    accessToken: tokens.access_token,
    expiresAt: Date.now() + tokens.expires_in * 1000,
  };
  safeStorage()?.setItem(TOKEN_KEY, JSON.stringify(stored));
  return "signed-in";
}

export function signOut() {
  safeStorage()?.removeItem(TOKEN_KEY);
  const params = new URLSearchParams({ client_id: INBOX_AUTH.clientId, logout_uri: redirectUri() });
  window.location.assign(`https://${INBOX_AUTH.domain}/logout?${params}`);
}

/** Drop the token locally (e.g. after a 401) without leaving the page. */
export const forgetToken = () => safeStorage()?.removeItem(TOKEN_KEY);
