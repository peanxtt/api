import { zValidator } from '@hono/zod-validator';
import type { ZodSchema } from 'zod';

import { errorResponse } from './response';

const createValidationErrorResponse = (message: string) =>
  errorResponse('VALIDATION_ERROR', message);

export const validateJson = <TSchema extends ZodSchema>(schema: TSchema) =>
  zValidator('json', schema, (result, c) => {
    if (!result.success) {
      return c.json(
        createValidationErrorResponse(result.error.flatten().formErrors.join(', ') || 'Invalid JSON body'),
        400,
      );
    }
  });

export const validateParams = <TSchema extends ZodSchema>(schema: TSchema) =>
  zValidator('param', schema, (result, c) => {
    if (!result.success) {
      return c.json(
        createValidationErrorResponse(result.error.flatten().formErrors.join(', ') || 'Invalid route parameters'),
        400,
      );
    }
  });

export const validateQuery = <TSchema extends ZodSchema>(schema: TSchema) =>
  zValidator('query', schema, (result, c) => {
    if (!result.success) {
      return c.json(
        createValidationErrorResponse(result.error.flatten().formErrors.join(', ') || 'Invalid query parameters'),
        400,
      );
    }
  });
