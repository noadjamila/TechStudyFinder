DO $do$
DECLARE
  r RECORD;
  null_count INT;
BEGIN
  FOR r IN
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'studiengebiete'
  LOOP
    EXECUTE format(
      'SELECT COUNT(*) FROM studiengebiete WHERE %I IS NULL',
      r.column_name
    )
    INTO null_count;

    IF null_count > 0 THEN
      RAISE NOTICE '⚠️ Table "%": % NULL values in column "%"',
        'studiengebiete', null_count, r.column_name;
    END IF;
  END LOOP;
END
$do$;
