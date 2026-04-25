import type { PersonalProfile, PersonalProject } from './schema';

export const getPersonalProfile = async (): Promise<PersonalProfile> => {
  // TODO: Replace with Supabase query in production.
  return {
    name: 'Huasheng Tan',
    headline: 'Builder of practical products',
    location: 'Kuala Lumpur, Malaysia',
  };
};

export const getPersonalProjects = async (): Promise<PersonalProject[]> => {
  // TODO: Replace with Supabase query in production.
  return [
    {
      id: 'personal-api-hub',
      name: 'Personal API Hub',
      status: 'active',
    },
    {
      id: 'invoice-generator',
      name: 'Invoice Generator',
      status: 'active',
    },
  ];
};
