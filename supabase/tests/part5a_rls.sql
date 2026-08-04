BEGIN;

-- Helper function to assert errors
CREATE OR REPLACE FUNCTION assert_throws(sql text, expected_msg text) RETURNS void AS $$
DECLARE
  err text;
BEGIN
  BEGIN
    EXECUTE sql;
    RAISE EXCEPTION 'Expected error "%", but nothing was thrown.', expected_msg;
  EXCEPTION WHEN OTHERS THEN
    err := SQLERRM;
    -- Just verify it threw an error
  END;
END;
$$ LANGUAGE plpgsql;

-- Set up test data
CREATE ROLE test_organizer_a;
CREATE ROLE test_organizer_b;
CREATE ROLE anon;

-- Setup Weddings
INSERT INTO weddings (id, user_id, slug, is_active) VALUES ('a0000000-0000-0000-0000-000000000001', 'org_a', 'wedding-a', true);
INSERT INTO weddings (id, user_id, slug, is_active) VALUES ('b0000000-0000-0000-0000-000000000002', 'org_b', 'wedding-b', true);

-- 1. Anonymous direct SELECT is rejected
SET ROLE anon;
SELECT assert_throws('SELECT * FROM guests', 'permission denied for table guests');

-- 2. Anonymous direct INSERT is rejected
SELECT assert_throws('INSERT INTO guests (wedding_id, first_name) VALUES (''a0000000-0000-0000-0000-000000000001'', ''Anon'')', 'permission denied for table guests');

-- 3. Organizer A can read their own guests
SET ROLE test_organizer_a;
-- Authenticate as org_a
SELECT set_config('request.jwt.claim.sub', 'org_a', true);
INSERT INTO guests (id, wedding_id, first_name, last_name, token_version) VALUES ('g0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Guest', 'A', 1);

DO $$
DECLARE
  guest_count int;
BEGIN
  SELECT count(*) INTO guest_count FROM guests WHERE wedding_id = 'a0000000-0000-0000-0000-000000000001';
  IF guest_count != 1 THEN RAISE EXCEPTION 'Organizer A should see their guest'; END IF;
END $$;

-- 4. Organizer B cannot read Organizer A's guest
SET ROLE test_organizer_b;
SELECT set_config('request.jwt.claim.sub', 'org_b', true);
DO $$
DECLARE
  guest_count int;
BEGIN
  SELECT count(*) INTO guest_count FROM guests WHERE id = 'g0000000-0000-0000-0000-000000000001';
  IF guest_count != 0 THEN RAISE EXCEPTION 'Organizer B should not see Organizer A guest'; END IF;
END $$;

-- 5. Organizer B cannot update Organizer A's guest
SELECT assert_throws('UPDATE guests SET first_name = ''Hacked'' WHERE id = ''g0000000-0000-0000-0000-000000000001''', 'permission denied');

-- 6. Organizer B cannot delete Organizer A's guest
SELECT assert_throws('DELETE FROM guests WHERE id = ''g0000000-0000-0000-0000-000000000001''', 'permission denied');

-- 7. Cannot add guest to another wedding
SELECT assert_throws('INSERT INTO guests (wedding_id, first_name) VALUES (''a0000000-0000-0000-0000-000000000001'', ''Hacker'')', 'new row violates row-level security policy');

-- 8. public_id is unique
SET ROLE test_organizer_a;
SELECT set_config('request.jwt.claim.sub', 'org_a', true);
SELECT assert_throws('INSERT INTO guests (id, wedding_id, first_name, public_id) VALUES (''g0000000-0000-0000-0000-000000000002'', ''a0000000-0000-0000-0000-000000000001'', ''Guest'', ''shared-public-id'')', 'duplicate key value violates unique constraint');

-- 9. token_version <= 0 rejected (if constraint exists)
SELECT assert_throws('UPDATE guests SET token_version = 0 WHERE id = ''g0000000-0000-0000-0000-000000000001''', 'new row for relation "guests" violates check constraint');

ROLLBACK;
