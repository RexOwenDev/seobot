import 'server-only'; // prevents serverEnv (which holds credentials) from being imported by client components

import { z } from 'zod';

const ServerEnvSchema = z.object({
  AI_GATEWAY_API_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  WORDPRESS_SITE_URL: z.string().url().optional(),
  WORDPRESS_USERNAME: z.string().optional(),
  WORDPRESS_APP_PASSWORD: z.string().optional(),
  // Full Shopify domain: "{store}.myshopify.com"
  // Handle rules: starts and ends with alphanumeric; hyphens allowed only in the middle.
  // Trailing-hyphen form ("shop-.myshopify.com") is rejected — Shopify prohibits it.
  SHOPIFY_SHOP: z.string().regex(/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.myshopify\.com$/).optional(),
  SHOPIFY_ADMIN_ACCESS_TOKEN: z.string().optional(),
  GSC_SERVICE_ACCOUNT_EMAIL: z.string().email().optional(),
  GSC_PRIVATE_KEY: z.string().optional(),
});

const ClientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

/**
 * Parsed server-side env. Skeleton build: every value is optional so the repo
 * compiles with no credentials. Phase 4+ will tighten required fields for
 * features that depend on them.
 */
export const serverEnv = ServerEnvSchema.parse({
  AI_GATEWAY_API_KEY: process.env.AI_GATEWAY_API_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  WORDPRESS_SITE_URL: process.env.WORDPRESS_SITE_URL,
  WORDPRESS_USERNAME: process.env.WORDPRESS_USERNAME,
  WORDPRESS_APP_PASSWORD: process.env.WORDPRESS_APP_PASSWORD,
  SHOPIFY_SHOP: process.env.SHOPIFY_SHOP,
  SHOPIFY_ADMIN_ACCESS_TOKEN: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
  GSC_SERVICE_ACCOUNT_EMAIL: process.env.GSC_SERVICE_ACCOUNT_EMAIL,
  GSC_PRIVATE_KEY: process.env.GSC_PRIVATE_KEY,
});

export const clientEnv = ClientEnvSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});
