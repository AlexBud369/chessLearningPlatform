require('dotenv').config();
const bcrypt = require('bcrypt');
const {
  sequelize,
  User,
  RefreshToken,
  Theme,
  Course,
  Lesson,
  Task,
  CourseTask,
  TrainerStudent,
  UserProgress,
  UserTaskResult,
  Favorite,
  AssignedCourse,
  Game,
  AnalysisNode,
} = require('../src/models');
const { runSchemaMigrations } = require('../src/db/runSchemaMigrations');
const { seedDefaultThemes } = require('../src/db/seedDefaultThemes');

const PASSWORD = 'password123';

const clearDatabase = async () => {
  await sequelize.query(`
    TRUNCATE TABLE
      analysis_nodes,
      games,
      favorites,
      user_task_results,
      user_progress,
      assigned_courses,
      course_tasks,
      trainer_students,
      refresh_tokens,
      tasks,
      lessons,
      courses,
      themes,
      users
    RESTART IDENTITY CASCADE;
  `);
  console.log('База данных очищена');
};

const createUsers = async (hashedPassword) => {
  const usersData = [
    { first_name: 'Админ', last_name: 'Системный', email: 'admin@test.com', role: 'admin' },
    { first_name: 'Тренер', last_name: 'Иванов', email: 'trainer@test.com', role: 'trainer' },
    { first_name: 'Игрок', last_name: 'Петров', email: 'player@test.com', role: 'player' },
    { first_name: 'Анна', last_name: 'Смирнова', email: 'anna@test.com', role: 'player' },
    { first_name: 'Борис', last_name: 'Козлов', email: 'boris@test.com', role: 'player' },
    { first_name: 'Виктор', last_name: 'Новиков', email: 'viktor@test.com', role: 'player' },
    { first_name: 'Галина', last_name: 'Морозова', email: 'galina@test.com', role: 'player' },
    { first_name: 'Дмитрий', last_name: 'Волков', email: 'dmitry@test.com', role: 'player' },
  ];

  const users = await User.bulkCreate(
    usersData.map((u) => ({ ...u, password_hash: hashedPassword, is_blocked: false }))
  );
  console.log(`Пользователи: ${users.length}`);
  return users;
};

const createCourses = async (themes, trainer) => {
  const titles = [
    'Испанская партия для начинающих',
    'Сицилианская защита: база',
    'Тактика двойного удара',
    'Матовая атака на короля',
    'Эндшпиль ладья против пешки',
    'Позиционное понимание миттельшпиля',
    'Дебютные ловушки',
    'Защита Каро-Канн',
    'Комбинации с жертвой качества',
    'Пешечные структуры',
    'Атака на рокировку',
    'Техника расчёта вариантов',
  ];

  const defaultCover = '/images/background/channels4_profile.jpg';

  const courses = await Course.bulkCreate(
    titles.map((title, index) => ({
      title,
      description: `Демо-курс «${title}». Практические материалы и уроки для учеников.`,
      difficulty: (index % 5) + 1,
      theme_id: themes[index % themes.length].id,
      author_id: trainer.id,
      cover_image: defaultCover,
    }))
  );
  console.log(`Курсы: ${courses.length}`);
  return courses;
};

const createLessons = async (courses) => {
  const lessons = [];
  for (const course of courses) {
    for (let i = 1; i <= 3; i += 1) {
      lessons.push({
        course_id: course.id,
        title: `Урок ${i}: ${course.title.split(':')[0]}`,
        content_type: i % 2 === 0 ? 'video' : 'text',
        content:
          i % 2 === 0
            ? 'https://example.com/video/demo.mp4'
            : `<p>Текстовый материал урока ${i} курса «${course.title}».</p>`,
        order_index: i,
      });
    }
  }
  const created = await Lesson.bulkCreate(lessons);
  console.log(`Уроки: ${created.length}`);
  return created;
};

const TASK_TEMPLATES = [
  {
    title: 'Мат в 1',
    fen: '6k1/5ppp/8/8/8/8/5PPP/6K1 w - - 0 1',
    solution: '@player:white@ 1. gxf7#',
    difficulty: 1,
  },
  {
    title: 'Вилка конём',
    fen: '8/8/8/8/4n3/8/5PPP/4R1K1 w - - 0 1',
    solution: '@player:white@ 1. Re8+',
    difficulty: 2,
  },
  {
    title: 'Слабый король',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 0 4',
    solution: '@player:white@ 1. Qxf7#',
    difficulty: 1,
  },
  {
    title: 'Выигрыш качества',
    fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
    solution: '@player:white@ 1. Bxf7+',
    difficulty: 3,
  },
  {
    title: 'Пешечный прорыв',
    fen: '8/4k3/4P3/8/8/8/8/4K3 w - - 0 1',
    solution: '@player:white@ 1. e7',
    difficulty: 2,
  },
];

const createTasks = async (themes, trainer) => {
  const tasks = [];
  for (let i = 0; i < 40; i += 1) {
    const tpl = TASK_TEMPLATES[i % TASK_TEMPLATES.length];
    tasks.push({
      title: `${tpl.title} #${i + 1}`,
      fen: tpl.fen,
      solution: tpl.solution,
      difficulty: ((i % 5) + 1),
      theme_id: themes[i % themes.length].id,
      author_id: trainer.id,
    });
  }
  const created = await Task.bulkCreate(tasks);
  console.log(`Задачи: ${created.length}`);
  return created;
};

const linkCourseTasks = async (courses, tasks) => {
  const links = [];
  for (let i = 0; i < 24; i += 1) {
    links.push({
      course_id: courses[i % courses.length].id,
      task_id: tasks[i].id,
    });
  }
  const created = await CourseTask.bulkCreate(links, { ignoreDuplicates: true });
  console.log(`Связи курс-задача: ${created.length}`);
  return created;
};

const createTrainerRelations = async (trainer, players) => {
  const relations = players.slice(0, 5).map((student) => ({
    trainer_id: trainer.id,
    student_id: student.id,
  }));
  const created = await TrainerStudent.bulkCreate(relations, { ignoreDuplicates: true });
  console.log(`Связи тренер-ученик: ${created.length}`);
  return created;
};

const createAssignedCourses = async (trainer, players, courses) => {
  const rows = [];
  players.slice(0, 5).forEach((student, idx) => {
    for (let c = 0; c < 2; c += 1) {
      rows.push({
        student_id: student.id,
        course_id: courses[(idx * 2 + c) % courses.length].id,
        assigned_by: trainer.id,
      });
    }
  });
  const created = await AssignedCourse.bulkCreate(rows, { ignoreDuplicates: true });
  console.log(`Назначения курсов: ${created.length}`);
  return created;
};

const createProgress = async (players, courses, lessons) => {
  const rows = [];
  const lessonsByCourse = {};
  for (const lesson of lessons) {
    if (!lessonsByCourse[lesson.course_id]) lessonsByCourse[lesson.course_id] = [];
    lessonsByCourse[lesson.course_id].push(lesson);
  }

  players.forEach((player, pIdx) => {
    const course = courses[pIdx % courses.length];
    const courseLessons = lessonsByCourse[course.id] || [];
    courseLessons.forEach((lesson, lIdx) => {
      if (lIdx <= pIdx % 3) {
        rows.push({
          user_id: player.id,
          course_id: course.id,
          lesson_id: lesson.id,
          completed: true,
          score: 80 + (lIdx * 5),
          completed_at: new Date(Date.now() - (pIdx + lIdx) * 86400000),
        });
      }
    });
  });

  const created = await UserProgress.bulkCreate(rows);
  console.log(`Прогресс уроков: ${created.length}`);
  return created;
};

const createTaskResults = async (players, tasks) => {
  const rows = [];
  players.forEach((player, pIdx) => {
    for (let t = 0; t < 6; t += 1) {
      const task = tasks[(pIdx * 6 + t) % tasks.length];
      const solved = t % 3 !== 2;
      rows.push({
        user_id: player.id,
        task_id: task.id,
        solved,
        attempts: solved ? 1 + (t % 3) : 2 + (t % 2),
        solved_at: solved ? new Date(Date.now() - t * 43200000) : null,
      });
    }
  });
  const created = await UserTaskResult.bulkCreate(rows);
  console.log(`Результаты задач: ${created.length}`);
  return created;
};

const createFavorites = async (players, courses, tasks) => {
  const rows = [];
  players.forEach((player, idx) => {
    rows.push({ user_id: player.id, item_type: 'course', item_id: courses[idx % courses.length].id });
    rows.push({ user_id: player.id, item_type: 'task', item_id: tasks[idx * 2].id });
  });
  const created = await Favorite.bulkCreate(rows, { ignoreDuplicates: true });
  console.log(`Избранное: ${created.length}`);
  return created;
};

const SAMPLE_PGN = `[Event "Demo"]
[White "Player"]
[Black "Opponent"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7 1-0`;

const createGames = async (players) => {
  const games = await Game.bulkCreate([
    {
      user_id: players[0].id,
      pgn: SAMPLE_PGN,
      title: 'Испанская — демо',
      result: '1-0',
      shared_with_trainer: true,
      student_note: 'Разберите дебют, пожалуйста',
      last_edited_by: players[0].id,
    },
    {
      user_id: players[1].id,
      pgn: SAMPLE_PGN,
      title: 'Тренировочная партия',
      result: '1/2-1/2',
      shared_with_trainer: false,
      last_edited_by: players[1].id,
    },
    {
      user_id: players[2].id,
      pgn: SAMPLE_PGN,
      title: 'Партия с турнира',
      result: '0-1',
      shared_with_trainer: true,
      last_edited_by: players[2].id,
    },
    {
      user_id: players[0].id,
      pgn: '1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Be7 5. e3 O-O 6. Nf3 h6 7. Bh4 b6 1-0',
      title: 'Каталонское начало',
      result: '1-0',
      shared_with_trainer: false,
      last_edited_by: players[0].id,
    },
    {
      user_id: players[3].id,
      pgn: SAMPLE_PGN,
      title: 'Блиц партия',
      result: '*',
      shared_with_trainer: true,
      last_edited_by: players[3].id,
    },
  ]);
  console.log(`Партии: ${games.length}`);
  return games;
};

const createAnalysisNodes = async (games, trainer) => {
  const game = games[0];
  const root = await AnalysisNode.create({
    game_id: game.id,
    user_id: trainer.id,
    parent_id: null,
    comment: 'Хороший дебютный порядок. Обратите внимание на поле e5.',
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    is_main: true,
  });
  const child = await AnalysisNode.create({
    game_id: game.id,
    user_id: trainer.id,
    move_from: 'e2',
    move_to: 'e4',
    parent_id: root.id,
    comment: 'Классический ход — борьба за центр.',
    fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
    is_main: true,
  });
  await AnalysisNode.create({
    game_id: game.id,
    user_id: trainer.id,
    move_from: 'e7',
    move_to: 'e5',
    parent_id: child.id,
    comment: 'Симметричный ответ.',
    fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2',
    is_main: true,
  });
  console.log('Узлы анализа: 3');
  return 3;
};

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('Подключение к БД установлено');

    await runSchemaMigrations(sequelize);
    await sequelize.sync({ alter: true });

    await clearDatabase();
    await seedDefaultThemes();

    const hashedPassword = await bcrypt.hash(PASSWORD, 10);
    const users = await createUsers(hashedPassword);

    const trainer = users.find((u) => u.role === 'trainer');
    const players = users.filter((u) => u.role === 'player');
    const themes = await Theme.findAll({ order: [['id', 'ASC']] });

    const courses = await createCourses(themes, trainer);
    const lessons = await createLessons(courses);
    const tasks = await createTasks(themes, trainer);
    await linkCourseTasks(courses, tasks);
    await createTrainerRelations(trainer, players);
    await createAssignedCourses(trainer, players, courses);
    await createProgress(players, courses, lessons);
    await createTaskResults(players, tasks);
    await createFavorites(players, courses, tasks);
    const games = await createGames(players);
    await createAnalysisNodes(games, trainer);

    const total =
      users.length +
      themes.length +
      courses.length +
      lessons.length +
      tasks.length +
      24 +
      5 +
      10 +
      (await UserProgress.count()) +
      (await UserTaskResult.count()) +
      (await Favorite.count()) +
      games.length +
      3;

    console.log('\n---');
    console.log(`Всего записей (прибл.): ${total}`);
    console.log('Пароль всех пользователей:', PASSWORD);
    console.log('admin@test.com | trainer@test.com | player@test.com | …');
    console.log('Сидирование завершено успешно');
    process.exit(0);
  } catch (error) {
    console.error('Ошибка сидирования:', error);
    process.exit(1);
  }
};

seed();
