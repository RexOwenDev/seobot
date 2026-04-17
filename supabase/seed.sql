-- Seed data: one fictional agency workspace with three fictional brand campaigns.
-- Brand names are deliberately invented (ForgeTorque, LuxDermis, VeloCargo) —
-- no real client data ever lives in this repo.
--
-- Requires: an auth.users row exists. In local dev, create via Supabase CLI
-- `supabase gen types` flow or the studio. Replace :demo_user with that UUID.

-- :demo_user = '00000000-0000-0000-0000-000000000001'  -- replace on run

insert into public.workspaces (id, name, slug, owner_id, plan_tier) values
  ('10000000-0000-0000-0000-000000000001', 'Demo Agency', 'demo-agency',
   '00000000-0000-0000-0000-000000000001', 'agency')
on conflict (id) do nothing;

insert into public.workspace_members (workspace_id, user_id, role) values
  ('10000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000001', 'owner')
on conflict do nothing;

-- Keywords across three fictional brand campaigns
insert into public.keywords (id, workspace_id, phrase, locale, search_volume, difficulty, intent, cluster) values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
   'best torque wrench for aerospace assembly', 'en-US', 1300, 42, 'commercial', 'forgetorque'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001',
   'how to calibrate a torque wrench', 'en-US', 4400, 28, 'informational', 'forgetorque'),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001',
   'retinol serum for sensitive skin', 'en-US', 9100, 55, 'commercial', 'luxdermis'),
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001',
   'cargo bike for urban delivery', 'en-US', 2400, 38, 'commercial', 'velocargo'),
  ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001',
   'electric cargo bike review 2026', 'en-US', 3300, 45, 'commercial', 'velocargo')
on conflict do nothing;

-- Example brief + article (ForgeTorque calibration guide)
insert into public.briefs (id, workspace_id, keyword_id, title_hint, target_length, tone, audience, status, created_by) values
  ('30000000-0000-0000-0000-000000000001',
   '10000000-0000-0000-0000-000000000001',
   '20000000-0000-0000-0000-000000000002',
   'Step-by-step torque wrench calibration guide',
   1800, 'technical', 'aerospace maintenance technicians', 'drafted',
   '00000000-0000-0000-0000-000000000001')
on conflict do nothing;

insert into public.articles (
  id, workspace_id, brief_id,
  h1, slug, meta_description, canonical_url, schema_type,
  body_markdown, excerpt, reading_time_mins, word_count,
  categories, tags, status, created_by
) values (
  '40000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000001',
  'How to Calibrate a Torque Wrench: A Technician''s Field Guide',
  'how-to-calibrate-a-torque-wrench',
  'Step-by-step torque wrench calibration for aerospace and manufacturing technicians — tools, tolerances, and the mistakes that cost engine rebuilds.',
  'https://forgetorque.example.com/blog/how-to-calibrate-a-torque-wrench',
  'HowTo',
  E'## Why calibration matters\n\nA drifted torque wrench is worse than no wrench at all...\n\n## Required tools\n\n- Calibrated torque tester\n- Certified reference weights\n\n## Procedure\n\n1. Secure the wrench ...',
  'Field-ready calibration workflow for torque wrenches used in aerospace assembly.',
  7, 1780,
  ARRAY['Maintenance','Quality'], ARRAY['calibration','torque-wrench','aerospace'],
  'reviewing',
  '00000000-0000-0000-0000-000000000001'
) on conflict do nothing;

insert into public.article_sections (article_id, workspace_id, position, heading_level, heading_text) values
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 0, 2, 'Why calibration matters'),
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 1, 2, 'Required tools'),
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 2, 2, 'Procedure'),
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 3, 3, 'Clicker-type wrenches'),
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 4, 3, 'Beam-type wrenches'),
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 5, 2, 'When to recalibrate')
on conflict do nothing;
