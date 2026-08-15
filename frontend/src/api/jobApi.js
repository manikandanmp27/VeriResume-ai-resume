import client from './client';

export const jobApi = {
  analyzeJob: async (data) => {
    const res = await client.post('/jobs/analyze', data);
    return res.data;
  },

  matchResume: async (resumeId, data) => {
    const res = await client.post(`/resumes/${resumeId}/match`, data);
    return res.data;
  },

  tailorResume: async (resumeId, data) => {
    const res = await client.post(`/resumes/${resumeId}/tailor`, data);
    return res.data;
  },
};
