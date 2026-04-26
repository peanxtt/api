import { Hono } from 'hono';

import { jsonSuccess } from '../../lib/response';
import type { AppEnv } from '../../types/bindings';
import { getPersonalProfile, getPersonalProjects } from './service';

const personalSiteRoutes = new Hono<AppEnv>();

personalSiteRoutes.get('/profile', async (c) => {
  const profile = await getPersonalProfile();
  return jsonSuccess(c, profile);
});

personalSiteRoutes.get('/projects', async (c) => {
  const projects = await getPersonalProjects();
  return jsonSuccess(c, projects);
});

export default personalSiteRoutes;
