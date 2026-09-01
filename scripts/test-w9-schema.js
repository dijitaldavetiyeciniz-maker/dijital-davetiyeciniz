/**
 * W9 Database Schema & Migration Verification Test
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('--- W9 Database Schema & Migration Test ---');

const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '019_c13_w9_super_admin_operations.sql');
const rollbackPath = path.join(process.cwd(), 'supabase', 'rollback', '019_c13_w9_super_admin_operations_rollback.sql');

assert.ok(fs.existsSync(migrationPath), 'Forward migration file 019 must exist');
assert.ok(fs.existsSync(rollbackPath), 'Rollback migration file 019 must exist');

const migrationSql = fs.readFileSync(migrationPath, 'utf8');
const rollbackSql = fs.readFileSync(rollbackPath, 'utf8');

// Assertions on required tables
assert.ok(migrationSql.includes('CREATE TABLE IF NOT EXISTS public.site_settings'), 'site_settings table definition required');
assert.ok(migrationSql.includes('CREATE TABLE IF NOT EXISTS public.support_conversations'), 'support_conversations table definition required');
assert.ok(migrationSql.includes('CREATE TABLE IF NOT EXISTS public.support_messages'), 'support_messages table definition required');
assert.ok(migrationSql.includes('CREATE TABLE IF NOT EXISTS public.support_impersonation_sessions'), 'support_impersonation_sessions table definition required');
assert.ok(migrationSql.includes('CREATE TABLE IF NOT EXISTS public.audit_logs'), 'audit_logs table definition required');
assert.ok(migrationSql.includes('ADD COLUMN IF NOT EXISTS is_quarantined'), 'is_quarantined column on weddings required');

// Assertions on rollback
assert.ok(rollbackSql.includes('DROP TABLE IF EXISTS public.site_settings'), 'rollback must drop site_settings');
assert.ok(rollbackSql.includes('DROP TABLE IF EXISTS public.support_conversations'), 'rollback must drop support_conversations');
assert.ok(rollbackSql.includes('DROP TABLE IF EXISTS public.support_messages'), 'rollback must drop support_messages');
assert.ok(rollbackSql.includes('DROP TABLE IF EXISTS public.support_impersonation_sessions'), 'rollback must drop support_impersonation_sessions');
assert.ok(rollbackSql.includes('DROP TABLE IF EXISTS public.audit_logs'), 'rollback must drop audit_logs');

console.log('✓ W9 Schema & Migration verification PASS (Forward + Rollback verified)');
