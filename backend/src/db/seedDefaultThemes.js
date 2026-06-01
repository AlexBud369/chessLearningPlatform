const { Theme } = require('../models');

const DEFAULT_THEMES = [
  { name: 'Дебюты', description: 'Открытия, дебютные системы и типовые планы' },
  { name: 'Миттельшпиль', description: 'Позиционная игра, тактика и стратегия в середине партии' },
  { name: 'Эндшпиль', description: 'Техника реализации преимущества в эндшпиле' },
  { name: 'Тактика', description: 'Комбинации, связки, двойные удары' },
  { name: 'Стратегия', description: 'Планирование, слабости, структура пешек' },
  { name: 'Матовые атаки', description: 'Типовые матовые схемы и атаки на короля' },
];

const seedDefaultThemes = async () => {
  for (const theme of DEFAULT_THEMES) {
    await Theme.findOrCreate({
      where: { name: theme.name },
      defaults: theme,
    });
  }
};

module.exports = { seedDefaultThemes, DEFAULT_THEMES };
