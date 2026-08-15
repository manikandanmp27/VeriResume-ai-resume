import client from './client';

export const atsApi = {
  runAtsCheck: async (resumeId, data = {}) => {
    const res = await client.post(`/resumes/${resumeId}/ats-check`, data);
    return res.data;
  },
};
