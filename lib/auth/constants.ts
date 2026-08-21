// Split out from password.ts so it can be imported by lib/validation/schemas.ts
// (which client form components also import, for shared types/constants)
// without pulling node:crypto — and password.ts's eager DUMMY_PASSWORD_HASH
// computation — into the browser bundle.
export const MIN_PASSWORD_LENGTH = 8;
