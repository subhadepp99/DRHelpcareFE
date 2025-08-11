/**
 * Helper utilities around JWT – no 3rd-party decode lib needed.
 */
export function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (_) {
    return null;
  }
}
export function isTokenExpired(token) {
  const payload = parseJwt(token);
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000;
}
export function minutesLeft(token) {
  const payload = parseJwt(token);
  return payload?.exp
    ? Math.floor((payload.exp * 1000 - Date.now()) / 60000)
    : 0;
}
