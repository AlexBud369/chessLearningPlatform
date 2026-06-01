import { axiosInstance } from './axiosInstance';

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const reportsApi = {
  downloadStudentPdf: async () => {
    const response = await axiosInstance.get('/reports/student/pdf', {
      responseType: 'blob',
    });
    downloadBlob(response.data, 'student-report.pdf');
  },

  downloadTrainerPdf: async () => {
    const response = await axiosInstance.get('/reports/trainer/students/pdf', {
      responseType: 'blob',
    });
    downloadBlob(response.data, 'trainer-students-report.pdf');
  },

  downloadTrainerExcel: async () => {
    const response = await axiosInstance.get('/reports/trainer/students/excel', {
      responseType: 'blob',
    });
    downloadBlob(response.data, 'trainer-students-report.xlsx');
  },
};
