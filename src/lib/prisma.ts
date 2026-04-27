import { parseEnv, requireEnvValue } from '../config/env';
import type { Bindings } from '../types/bindings';

type Domain = 'personal' | 'coffee';

export type DomainDatabaseConfig = {
  databaseUrl: string;
  directUrl: string;
};

const clientCache = new Map<Domain, unknown>();

const resolveDomainConfig = (bindings: Bindings, domain: Domain): DomainDatabaseConfig => {
  const env = parseEnv(bindings);

  if (domain === 'personal') {
    return {
      databaseUrl: requireEnvValue(env.PERSONAL_DATABASE_URL, 'PERSONAL_DATABASE_URL'),
      directUrl: requireEnvValue(env.PERSONAL_DIRECT_URL, 'PERSONAL_DIRECT_URL'),
    };
  }

  return {
    databaseUrl: requireEnvValue(env.COFFEE_DATABASE_URL, 'COFFEE_DATABASE_URL'),
    directUrl: requireEnvValue(env.COFFEE_DIRECT_URL, 'COFFEE_DIRECT_URL'),
  };
};

const createDomainPrismaClient = (domain: Domain, bindings: Bindings) => {
  // Validate required env upfront, but never expose URL values on returned objects.
  resolveDomainConfig(bindings, domain);

  // Runtime wiring lives in one gateway. Downstream phases replace this stub
  // with generated Prisma clients from each domain schema.
  return {
    domain,
    engine: 'accelerate-data-proxy',
  };
};

const getDomainPrismaClient = (domain: Domain, bindings: Bindings) => {
  const existing = clientCache.get(domain);
  if (existing) {
    return existing;
  }

  const client = createDomainPrismaClient(domain, bindings);
  clientCache.set(domain, client);
  return client;
};

export const getPersonalPrismaClient = (bindings: Bindings) =>
  getDomainPrismaClient('personal', bindings);

export const getCoffeePrismaClient = (bindings: Bindings) =>
  getDomainPrismaClient('coffee', bindings);

export const getDomainDatabaseConfig = (bindings: Bindings, domain: Domain) =>
  resolveDomainConfig(bindings, domain);
