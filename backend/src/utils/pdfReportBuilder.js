const PDFDocument = require('pdfkit');
const path = require('path');

const FONT_PATH = path.join(
  __dirname,
  '../../node_modules/dejavu-fonts-ttf/ttf/DejaVuSans.ttf'
);
const FONT_BOLD_PATH = path.join(
  __dirname,
  '../../node_modules/dejavu-fonts-ttf/ttf/DejaVuSans-Bold.ttf'
);

const { formatDate } = require('../services/reportService');

const writeSectionTitle = (doc, title) => {
  doc.moveDown(0.5);
  doc.font('DejaVu-Bold').fontSize(13).text(title);
  doc.moveDown(0.3);
  doc.font('DejaVu').fontSize(10);
};

const writeLine = (doc, text) => {
  doc.text(text, { lineGap: 2 });
};

const buildStudentPdf = (data) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.registerFont('DejaVu', FONT_PATH);
    doc.registerFont('DejaVu-Bold', FONT_BOLD_PATH);

    doc.font('DejaVu-Bold').fontSize(18).text('Отчёт об успеваемости', { align: 'center' });
    doc.moveDown(0.5);
    doc.font('DejaVu').fontSize(11);
    writeLine(
      doc,
      `${data.user.firstName} ${data.user.lastName} · ${data.user.email}`
    );
    writeLine(doc, `Дата формирования: ${formatDate(data.generatedAt)}`);
    writeLine(doc, `Решено задач за 30 дней: ${data.solvedLast30Days}`);

    writeSectionTitle(doc, 'Курсы');
    if (data.coursesSummary.length === 0) {
      writeLine(doc, 'Нет данных о прохождении курсов.');
    } else {
      for (const course of data.coursesSummary) {
        writeLine(
          doc,
          `• ${course.courseTitle}: ${course.completedLessons}/${course.totalLessons} уроков (${course.percent}%)`
        );
      }
    }

    writeSectionTitle(doc, 'Пройденные уроки');
    if (data.completedLessons.length === 0) {
      writeLine(doc, 'Пройденных уроков пока нет.');
    } else {
      for (const lesson of data.completedLessons.slice(0, 40)) {
        writeLine(
          doc,
          `• ${lesson.courseTitle} — ${lesson.lessonTitle} (${formatDate(lesson.completedAt)})`
        );
      }
      if (data.completedLessons.length > 40) {
        writeLine(doc, `… и ещё ${data.completedLessons.length - 40} урок(ов).`);
      }
    }

    writeSectionTitle(doc, 'Решённые задачи');
    if (data.solvedTasks.length === 0) {
      writeLine(doc, 'Решённых задач пока нет.');
    } else {
      for (const task of data.solvedTasks.slice(0, 40)) {
        writeLine(
          doc,
          `• ${task.title} [${task.themeName}, сложность ${task.difficulty}] — ${formatDate(task.solvedAt)}, попыток: ${task.attempts}`
        );
      }
      if (data.solvedTasks.length > 40) {
        writeLine(doc, `… и ещё ${data.solvedTasks.length - 40} задач(и).`);
      }
    }

    writeSectionTitle(doc, 'Статистика по темам');
    if (data.themeStats.length === 0) {
      writeLine(doc, 'Нет попыток решения задач.');
    } else {
      for (const theme of data.themeStats) {
        writeLine(
          doc,
          `• ${theme.themeName}: ${theme.solved}/${theme.attempted} (${theme.percent}%)`
        );
      }
    }

    writeSectionTitle(doc, 'Рекомендации');
    for (const rec of data.recommendations) {
      writeLine(doc, `• ${rec}`);
    }

    doc.end();
  });

const buildTrainerPdf = (data) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4', layout: 'landscape' });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.registerFont('DejaVu', FONT_PATH);
    doc.registerFont('DejaVu-Bold', FONT_BOLD_PATH);

    doc.font('DejaVu-Bold').fontSize(18).text('Отчёт по активности учеников', { align: 'center' });
    doc.moveDown(0.5);
    doc.font('DejaVu').fontSize(11);
    writeLine(
      doc,
      `Тренер: ${data.trainer.firstName} ${data.trainer.lastName} · ${formatDate(data.generatedAt)}`
    );
    doc.moveDown(0.5);

    if (data.students.length === 0) {
      writeLine(doc, 'У тренера пока нет учеников.');
      doc.end();
      return;
    }

    const colX = [50, 200, 320, 400, 480, 560, 680];
    const headers = [
      'Ученик',
      'Email',
      'Курсы %',
      'Пройдено',
      'Задач',
      'Активность',
      'Последний вход',
    ];

    doc.font('DejaVu-Bold').fontSize(9);
    headers.forEach((h, i) => doc.text(h, colX[i], doc.y, { width: 110, continued: false }));
    doc.moveDown(0.8);
    doc.font('DejaVu').fontSize(9);

    for (const row of data.students) {
      if (doc.y > 520) {
        doc.addPage();
        doc.font('DejaVu-Bold').fontSize(9);
        headers.forEach((h, i) => doc.text(h, colX[i], doc.y, { width: 110, continued: false }));
        doc.moveDown(0.8);
        doc.font('DejaVu').fontSize(9);
      }

      const y = doc.y;
      doc.text(`${row.firstName} ${row.lastName}`, colX[0], y, { width: 140 });
      doc.text(row.email, colX[1], y, { width: 110 });
      doc.text(String(row.coursesProgressPercent), colX[2], y, { width: 70 });
      doc.text(`${row.completedCoursesCount}/${row.assignedCoursesCount}`, colX[3], y, { width: 70 });
      doc.text(String(row.solvedTasksCount), colX[4], y, { width: 70 });
      doc.text(formatDate(row.lastActivityAt), colX[5], y, { width: 110 });
      doc.text(formatDate(row.lastLoginAt), colX[6], y, { width: 110 });
      doc.moveDown(1.2);
    }

    doc.end();
  });

module.exports = { buildStudentPdf, buildTrainerPdf };
