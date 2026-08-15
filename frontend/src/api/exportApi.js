import client from './client';

export const exportApi = {
  exportPdf: async (resumeId, data = {}) => {
    const res = await client.post(`/resumes/${resumeId}/export`, data, {
      responseType: 'blob',
    });
    return res.data;
  },

  downloadPdfBlob: (blob, filename = 'verita_resume.pdf') => {
    const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
