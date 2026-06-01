const ExcelJS = require('exceljs');
const { formatDate } = require('../services/reportService');

const styleHeaderRow = (row) => {
  row.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE3F2FD' },
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });
};

const buildTrainerExcel = async (data) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Chess Learning Platform';
  workbook.created = data.generatedAt;

  const sheet = workbook.addWorksheet('Ученики');

  sheet.mergeCells('A1:H1');
  sheet.getCell('A1').value = 'Отчёт по активности учеников';
  sheet.getCell('A1').font = { bold: true, size: 14 };
  sheet.mergeCells('A2:H2');
  sheet.getCell('A2').value = `Тренер: ${data.trainer.firstName} ${data.trainer.lastName} · ${formatDate(data.generatedAt)}`;

  sheet.addRow([]);
  const header = sheet.addRow([
    'Ученик',
    'Email',
    'Прогресс курсов %',
    'Курсов пройдено',
    'Курсов назначено',
    'Решено задач',
    'Последняя активность',
    'Последний вход',
  ]);
  styleHeaderRow(header);

  for (const row of data.students) {
    sheet.addRow([
      `${row.firstName} ${row.lastName}`,
      row.email,
      row.coursesProgressPercent,
      row.completedCoursesCount,
      row.assignedCoursesCount,
      row.solvedTasksCount,
      formatDate(row.lastActivityAt),
      formatDate(row.lastLoginAt),
    ]);
  }

  sheet.columns = [
    { width: 24 },
    { width: 28 },
    { width: 16 },
    { width: 16 },
    { width: 16 },
    { width: 14 },
    { width: 22 },
    { width: 22 },
  ];

  return workbook.xlsx.writeBuffer();
};

module.exports = { buildTrainerExcel };
