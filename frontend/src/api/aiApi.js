import client from './client';

export const aiApi = {
  generateResume: async (resumeId) => {
    const res = await client.post(`/resumes/${resumeId}/generate`);
    return res.data;
  },

  improveContent: async (resumeId, data) => {
    const res = await client.post(`/resumes/${resumeId}/improve`, data);
    return res.data;
  },
};
