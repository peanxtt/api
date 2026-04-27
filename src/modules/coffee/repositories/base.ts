import type {
  AdminSystemOperations,
  UserScopedRepository,
} from '../../../lib/db/repository-contracts';

export type CoffeeBaseRecord = {
  id: string;
};

export type CoffeeRepository<TRecord extends CoffeeBaseRecord, TFilter = unknown> =
  UserScopedRepository<TRecord, TFilter> &
  AdminSystemOperations<TRecord>;
