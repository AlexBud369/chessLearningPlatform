const { TASK, COURSE } = require('../constants');

const getColumnInfo = async (sequelize, tableName, columnName) => {
  const [rows] = await sequelize.query(
    `
    SELECT data_type, udt_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = :tableName
      AND column_name = :columnName
    LIMIT 1
    `,
    { replacements: { tableName, columnName } }
  );

  return rows[0] || null;
};

const migrateTaskDifficultyFromEnum = async (sequelize, transaction) => {
  const column = await getColumnInfo(sequelize, 'tasks', 'difficulty');
  if (!column) return;

  const isEnum =
    column.data_type === 'USER-DEFINED' &&
    (column.udt_name === 'enum_tasks_difficulty' || column.udt_name.startsWith('enum'));

  if (!isEnum) return;

  await sequelize.query(
    `
    ALTER TABLE tasks ADD COLUMN IF NOT EXISTS difficulty_int INTEGER;

    UPDATE tasks
    SET difficulty_int = CASE difficulty::text
      WHEN 'beginner' THEN 1
      WHEN 'intermediate' THEN 3
      WHEN 'advanced' THEN 5
      ELSE 1
    END
    WHERE difficulty_int IS NULL;

    ALTER TABLE tasks DROP COLUMN difficulty;
    ALTER TABLE tasks RENAME COLUMN difficulty_int TO difficulty;
    ALTER TABLE tasks ALTER COLUMN difficulty SET NOT NULL;
    ALTER TABLE tasks ALTER COLUMN difficulty SET DEFAULT 1;

    DROP TYPE IF EXISTS enum_tasks_difficulty;
    `,
    { transaction }
  );
};

const ensureTaskTitleColumn = async (sequelize, transaction) => {
  const column = await getColumnInfo(sequelize, 'tasks', 'title');
  if (column) return;

  await sequelize.query(
    `ALTER TABLE tasks ADD COLUMN title VARCHAR(${TASK.TITLE_MAX_LENGTH});`,
    { transaction }
  );
};

const ensureCourseDifficultyColumn = async (sequelize, transaction) => {
  const column = await getColumnInfo(sequelize, 'courses', 'difficulty');
  if (column) return;

  await sequelize.query(
    `
    ALTER TABLE courses
    ADD COLUMN difficulty INTEGER NOT NULL DEFAULT ${COURSE.DIFFICULTY_MIN}
    CHECK (difficulty >= ${COURSE.DIFFICULTY_MIN} AND difficulty <= ${COURSE.DIFFICULTY_MAX});
    `,
    { transaction }
  );
};

const fixAssignedCoursesUniqueConstraint = async (sequelize, transaction) => {
  const [tableExists] = await sequelize.query(
    `
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'assigned_courses'
    LIMIT 1
    `,
    { transaction }
  );

  if (!tableExists.length) return;

  const [constraints] = await sequelize.query(
    `
    SELECT c.conname AS name,
           array_agg(a.attname ORDER BY u.ordinality) AS columns
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN unnest(c.conkey) WITH ORDINALITY AS u(attnum, ordinality) ON true
    JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = u.attnum
    WHERE t.relname = 'assigned_courses'
      AND c.contype = 'u'
    GROUP BY c.conname
    `,
    { transaction }
  );

  for (const row of constraints) {
    const columns = row.columns || [];
    if (columns.length === 1 && columns[0] === 'course_id') {
      await sequelize.query(`ALTER TABLE assigned_courses DROP CONSTRAINT "${row.name}"`, {
        transaction,
      });
    }
  }

  await sequelize.query(
    `
    CREATE UNIQUE INDEX IF NOT EXISTS assigned_courses_student_course_unique
    ON assigned_courses (student_id, course_id);
    `,
    { transaction }
  );
};

const ensureGameSharingColumns = async (sequelize, transaction) => {
  const columns = [
    { name: 'title', sql: 'title VARCHAR(255)' },
    { name: 'student_note', sql: 'student_note TEXT' },
    { name: 'shared_with_trainer', sql: 'shared_with_trainer BOOLEAN NOT NULL DEFAULT false' },
    { name: 'last_edited_by', sql: 'last_edited_by INTEGER REFERENCES users(id)' },
  ];

  for (const col of columns) {
    const info = await getColumnInfo(sequelize, 'games', col.name);
    if (!info) {
      await sequelize.query(`ALTER TABLE games ADD COLUMN ${col.sql};`, { transaction });
    }
  }
};

const runSchemaMigrations = async (sequelize) => {
  const transaction = await sequelize.transaction();

  try {
    await migrateTaskDifficultyFromEnum(sequelize, transaction);
    await ensureTaskTitleColumn(sequelize, transaction);
    await ensureCourseDifficultyColumn(sequelize, transaction);
    await ensureGameSharingColumns(sequelize, transaction);
    await fixAssignedCoursesUniqueConstraint(sequelize, transaction);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = { runSchemaMigrations };
