// GET /api/bootstrap -> the whole content set { entries, singletons } for the admin to load once.
import { json, readAll } from './_shared.js';

export async function onRequestGet({ env }) {
  return json(await readAll(env));
}
