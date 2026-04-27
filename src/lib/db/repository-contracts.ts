/* eslint-disable no-unused-vars */

export type UserScopedArgs = {
  userId: string;
};

export type AdminScopedArgs = {
  adminActorId: string;
};

export type SystemScopedArgs = {
  systemActor: 'migration' | 'job' | 'maintenance';
};

type ListForUserFn<TRecord, TFilter> = (
  _args: UserScopedArgs & { filter?: TFilter }
) => Promise<TRecord[]>;
type GetForUserFn<TRecord> = (
  _args: UserScopedArgs & { id: string }
) => Promise<TRecord | null>;
type CreateForUserFn<TRecord> = (
  _args: UserScopedArgs & { input: Partial<TRecord> }
) => Promise<TRecord>;
type UpdateForUserFn<TRecord> = (
  _args: UserScopedArgs & { id: string; input: Partial<TRecord> }
) => Promise<TRecord>;
type DeleteForUserFn = (_args: UserScopedArgs & { id: string }) => Promise<void>;
type ListAdminFn<TRecord> = (_args: AdminScopedArgs) => Promise<TRecord[]>;
type RebuildSystemFn = (_args: SystemScopedArgs) => Promise<void>;

export interface UserScopedRepository<TRecord, TFilter = unknown> {
  listForUser: ListForUserFn<TRecord, TFilter>;
  getForUser: GetForUserFn<TRecord>;
  createForUser: CreateForUserFn<TRecord>;
  updateForUser: UpdateForUserFn<TRecord>;
  deleteForUser: DeleteForUserFn;
}

export interface AdminSystemOperations<TRecord> {
  listAdmin: ListAdminFn<TRecord>;
  rebuildSystem: RebuildSystemFn;
}

export type PersonalRepositoryContract<TRecord, TFilter = unknown> =
  UserScopedRepository<TRecord, TFilter> &
  AdminSystemOperations<TRecord>;
