import { zValidator } from '@hono/zod-validator';
import type { ZodError, ZodSchema } from 'zod';

import { errorResponse } from './response';

const createValidationErrorResponse = (
  defaultMessage: string,
  fieldErrors?: Record<string, string[]>,
) =>
  errorResponse(
    defaultMessage,
    'BAD_REQUEST',
    fieldErrors ? { fieldErrors } : undefined,
  );

const normalizeFieldErrors = (
  fieldErrors: Record<string, string[] | undefined>,
): Record<string, string[]> | undefined => {
  const normalizedEntries = Object.entries(fieldErrors).filter(
    (entry): entry is [string, string[]] => Array.isArray(entry[1]) && entry[1].length > 0,
  );

  if (normalizedEntries.length === 0) {
    return undefined;
  }

  return Object.fromEntries(normalizedEntries);
};

const flattenFieldErrors = (schemaError: ZodError<unknown>) => {
  const flattened = schemaError.flatten();

  return {
    fieldErrors: normalizeFieldErrors(flattened.fieldErrors),
    formErrors: flattened.formErrors,
  };
};

export const validateJson = <TSchema extends ZodSchema>(schema: TSchema) =>
  zValidator('json', schema, (result, c) => {
    if (!result.success) {
      const { fieldErrors } = flattenFieldErrors(result.error);
      return c.json(
        createValidationErrorResponse('Invalid JSON body', fieldErrors),
        400,
      );
    }
  });

export const validateParams = <TSchema extends ZodSchema>(schema: TSchema) =>
  zValidator('param', schema, (result, c) => {
    if (!result.success) {
      const { fieldErrors } = flattenFieldErrors(result.error);
      return c.json(
        createValidationErrorResponse('Invalid route parameters', fieldErrors),
        400,
      );
    }
  });

export const validateQuery = <TSchema extends ZodSchema>(schema: TSchema) =>
  zValidator('query', schema, (result, c) => {
    if (!result.success) {
      const { fieldErrors } = flattenFieldErrors(result.error);
      return c.json(
        createValidationErrorResponse('Invalid query parameters', fieldErrors),
        400,
      );
    }
  });
