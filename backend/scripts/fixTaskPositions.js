/**
 * Updates demo task FEN/solution to valid positions (both kings, playable line).
 * Run: node scripts/fixTaskPositions.js
 */
require('dotenv').config();
const { sequelize, Task } = require('../src/models');
const { validateTaskSolution } = require('../src/utils/taskFenValidation');

const TASK_TEMPLATES = [
  {
    title: 'Мат в 1',
    fen: '6k1/6R1/8/8/8/8/8/6K1 w - - 0 1',
    solution: '@player:white@ 1. Rxg8#',
    difficulty: 1,
  },
  {
    title: 'Вилка конём',
    fen: '4k3/4q3/8/4N3/8/8/8/6K1 w - - 0 1',
    solution: '@player:white@ 1. Ng6',
    difficulty: 2,
  },
  {
    title: 'Слабый король',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K2R w KQkq - 4 4',
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
    fen: '8/4k3/8/3P4/8/8/8/4K3 w - - 0 1',
    solution: '@player:white@ 1. d6',
    difficulty: 2,
  },
];

const applyTemplates = async () => {
  const tasks = await Task.findAll({ order: [['id', 'ASC']] });
  let updated = 0;

  for (let i = 0; i < tasks.length; i += 1) {
    const tpl = TASK_TEMPLATES[i % TASK_TEMPLATES.length];
    const title = `${tpl.title} #${i + 1}`;
    const check = validateTaskSolution(tpl.fen, tpl.solution);
    if (!check.ok) {
      console.error(`Template "${tpl.title}" invalid:`, check.message);
      process.exitCode = 1;
      continue;
    }

    await tasks[i].update({
      title,
      fen: tpl.fen,
      solution: tpl.solution,
      difficulty: ((i % 5) + 1),
    });
    updated += 1;
  }

  console.log(`Updated ${updated} of ${tasks.length} tasks`);
};

applyTemplates()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());
