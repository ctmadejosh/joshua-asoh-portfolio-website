import { ADMIN_API_URL } from "@/data/site";
import { forgetToken, getToken } from "@/lib/inboxAuth";

/** Thrown when there's no valid sign-in, so the page can show "Sign in". */
export class SignedOutError extends Error {
  constructor(message = "Your session ended. Sign in again.") {
    super(message);
  }
}

/** Calls the private admin API with the signed-in user's token. */
export async function adminFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = getToken();
  if (!token) throw new SignedOutError("");
  const response = await fetch(`${ADMIN_API_URL}${path}`, {
    ...init,
    headers: { ...(init.headers || {}), Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (response.status === 401 || response.status === 403) {
    forgetToken();
    throw new SignedOutError();
  }
  return response;
}
