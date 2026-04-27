import type { PersonalRepositoryContract } from '../../../lib/db/repository-contracts';

export type PersonalBaseRecord = {
  id: string;
  userId: string;
};

export type PersonalRepository<TRecord extends PersonalBaseRecord, TFilter = unknown> =
  PersonalRepositoryContract<TRecord, TFilter>;
