import { z } from 'zod';
import { insertSettingsSchema, settings, calls } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  settings: {
    get: {
      method: 'GET' as const,
      path: '/api/settings' as const,
      responses: {
        200: z.custom<typeof settings.$inferSelect>(),
      }
    },
    update: {
      method: 'POST' as const,
      path: '/api/settings' as const,
      input: insertSettingsSchema,
      responses: {
        200: z.custom<typeof settings.$inferSelect>(),
        400: errorSchemas.validation,
      }
    }
  },
  calls: {
    list: {
      method: 'GET' as const,
      path: '/api/calls' as const,
      responses: {
        200: z.array(z.custom<typeof calls.$inferSelect>()),
      }
    },
    get: {
      method: 'GET' as const,
      path: '/api/calls/:id' as const,
      responses: {
        200: z.custom<typeof calls.$inferSelect>(),
        404: errorSchemas.notFound,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type Settings = z.infer<typeof api.settings.get.responses[200]>;
export type Call = z.infer<typeof api.calls.get.responses[200]>;
