const reportService = require('../services/reportService');
const { buildStudentPdf, buildTrainerPdf } = require('../utils/pdfReportBuilder');
const { buildTrainerExcel } = require('../utils/excelReportBuilder');

class ReportController {
  async downloadStudentPdf(req, res, next) {
    try {
      const data = await reportService.buildStudentReportData(req.user.id);
      const buffer = await buildStudentPdf(data);
      const filename = `report-student-${req.user.id}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(buffer);
    } catch (error) {
      next(error);
    }
  }

  async downloadTrainerPdf(req, res, next) {
    try {
      const data = await reportService.buildTrainerReportData(req.user.id);
      const buffer = await buildTrainerPdf(data);
      const filename = `report-trainer-${req.user.id}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(buffer);
    } catch (error) {
      next(error);
    }
  }

  async downloadTrainerExcel(req, res, next) {
    try {
      const data = await reportService.buildTrainerReportData(req.user.id);
      const buffer = await buildTrainerExcel(data);
      const filename = `report-trainer-${req.user.id}.xlsx`;

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(Buffer.from(buffer));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReportController();
