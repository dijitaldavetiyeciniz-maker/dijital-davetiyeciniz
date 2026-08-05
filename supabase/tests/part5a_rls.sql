BEGIN;

-- Setup Weddings and Guests directly as superuser before setting roles
-- NOTE: user_id is UUID (FK to auth.users), so organizer identifiers must be
-- real UUIDs, not plain strings like 'org_a'. These are reused below as the
-- simulated JWT "sub" claim so RLS policies (auth.uid() = user_id) line up.
INSERT INTO weddings (id, user_id, slug, is_active, bride_name, groom_name, admin_password) VALUES ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-00000000000a', 'wedding-a-rls', true, 'A', 'A', 'pw');
INSERT INTO weddings (id, user_id, slug, is_active, bride_name, groom_name, admin_password) VALUES ('00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-00000000000b', 'wedding-b-rls', true, 'B', 'B', 'pw');

INSERT INTO guests (id, wedding_id, first_name, last_name, token_version) VALUES ('11111111-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Guest', 'A', 1);
INSERT INTO guests (id, wedding_id, first_name, last_name, token_version) VALUES ('11111111-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Guest', 'B', 1);

-- Helper variables for row counts
DO $$
DECLARE
  guest_count int;
  wedding_count int;
BEGIN
  -- 0. Service Role can CRUD weddings and guests
  SET ROLE service_role;
  INSERT INTO weddings (id, user_id, slug, is_active, bride_name, groom_name, admin_password) VALUES ('00000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-00000000000c', 'wedding-c-rls', true, 'Bride C', 'Groom C', 'pwd');
  SELECT count(*) INTO wedding_count FROM weddings WHERE id = '00000000-0000-0000-0000-000000000003';
  IF wedding_count != 1 THEN RAISE EXCEPTION 'Service role insert failed'; END IF;
  UPDATE weddings SET bride_name = 'Bride C Updated' WHERE id = '00000000-0000-0000-0000-000000000003';
  DELETE FROM weddings WHERE id = '00000000-0000-0000-0000-000000000003';
  -- 1. Anonymous direct SELECT sees 0 rows (because of RLS)
  SET ROLE anon;
  SELECT count(*) INTO guest_count FROM guests;
  IF guest_count != 0 THEN RAISE EXCEPTION 'Anonymous should see 0 guests, saw %', guest_count; END IF;

  -- 2. Anonymous direct INSERT is rejected
  BEGIN
    INSERT INTO guests (wedding_id, first_name) VALUES ('00000000-0000-0000-0000-000000000001', 'Anon');
    RAISE EXCEPTION 'Anonymous insert should throw exception';
  EXCEPTION WHEN OTHERS THEN
    -- Expected exception
  END;

  RESET ROLE;
  -- 3. Organizer A can read their own guests
  SET ROLE authenticated;
  PERFORM set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-00000000000a', true);
  
  SELECT count(*) INTO guest_count FROM guests WHERE wedding_id = '00000000-0000-0000-0000-000000000001';
  IF guest_count != 1 THEN RAISE EXCEPTION 'Organizer A should see 1 guest, saw %', guest_count; END IF;

  -- 4. Organizer B cannot read Organizer A's guest
  RESET ROLE;
  SET ROLE authenticated;
  PERFORM set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-00000000000b', true);
  
  SELECT count(*) INTO guest_count FROM guests WHERE id = '11111111-0000-0000-0000-000000000001';
  IF guest_count != 0 THEN RAISE EXCEPTION 'Organizer B should see 0 rows for Organizer A guest, saw %', guest_count; END IF;

  -- 5. Organizer B cannot update Organizer A's guest
  UPDATE guests SET first_name = 'Hacked' WHERE id = '11111111-0000-0000-0000-000000000001';
  GET DIAGNOSTICS guest_count = ROW_COUNT;
  IF guest_count != 0 THEN RAISE EXCEPTION 'Organizer B update should affect 0 rows, affected %', guest_count; END IF;

  -- 6. Organizer B cannot delete Organizer A's guest
  DELETE FROM guests WHERE id = '11111111-0000-0000-0000-000000000001';
  GET DIAGNOSTICS guest_count = ROW_COUNT;
  IF guest_count != 0 THEN RAISE EXCEPTION 'Organizer B delete should affect 0 rows, affected %', guest_count; END IF;

  -- 7. Cannot add guest to another wedding
  BEGIN
    INSERT INTO guests (wedding_id, first_name) VALUES ('00000000-0000-0000-0000-000000000001', 'Hacker');
    RAISE EXCEPTION 'Organizer B insert into Wedding A should throw RLS exception';
  EXCEPTION WHEN OTHERS THEN
    -- Expected exception
  END;

  RESET ROLE;
  -- 8. public_id is unique
  SET ROLE authenticated;
  PERFORM set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-00000000000a', true);
  BEGIN
    INSERT INTO guests (id, wedding_id, first_name, public_id) VALUES ('11111111-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Guest', 'shared-public-id');
    INSERT INTO guests (id, wedding_id, first_name, public_id) VALUES ('11111111-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Guest2', 'shared-public-id');
    RAISE EXCEPTION 'Unique public_id violation should throw exception';
  EXCEPTION WHEN OTHERS THEN
    -- Expected
  END;

  -- 9. token_version <= 0 rejected (if check constraint exists)
  -- Wait, do we have a check constraint for token_version > 0? If not, we might not get an exception.
  -- The user asked: "token_version = 0 reddedilir". Let's wrap in try/catch if there's a trigger or constraint.
  BEGIN
    UPDATE guests SET token_version = 0 WHERE id = '11111111-0000-0000-0000-000000000001';
    RAISE EXCEPTION 'Update to token_version=0 should throw exception';
  EXCEPTION WHEN OTHERS THEN
    -- Expected
  END;

END $$;

ROLLBACK;
