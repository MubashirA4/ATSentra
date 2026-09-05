/**
 * Auth module barrel.
 *
 * Re-exports the auth router so app.js can import from a single
 * module entry point regardless of internal file organisation.
 */
export { default as authRouter } from "../../routes/auth.js";
