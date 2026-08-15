import client from './client';

export const versionApi = {
  listVersions: async (resumeId) => {
    const res = await client.get(`/resumes/${resumeId}/versions`);
    return res.data;
  },

  getVersion: async (resumeId, versionId) => {
    const res = await client.get(`/resumes/${resumeId}/versions/${versionId}`);
    return res.data;
  },

  createVersion: async (resumeId, data) => {
    const res = await client.post(`/resumes/${resumeId}/versions`, data);
    return res.data;
  },

  deleteVersion: async (resumeId, versionId) => {
    const res = await client.delete(`/resumes/${resumeId}/versions/${versionId}`);
    return res.data;
  },

  compareDiff: async (resumeId, versionId) => {
    const res = await client.get(`/resumes/${resumeId}/versions/${versionId}/diff`);
    return res.data;
  },
};
