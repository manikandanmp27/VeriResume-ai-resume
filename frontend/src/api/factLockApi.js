import client from './client';

export const factLockApi = {
  // Fact Lock Claims
  getClaims: async (resumeId) => {
    const res = await client.get(`/resumes/${resumeId}/claims`);
    return res.data;
  },

  getClaim: async (resumeId, claimId) => {
    const res = await client.get(`/resumes/${resumeId}/claims/${claimId}`);
    return res.data;
  },

  verifyClaim: async (resumeId, claimId) => {
    const res = await client.post(`/resumes/${resumeId}/claims/${claimId}/verify`);
    return res.data;
  },

  rejectClaim: async (resumeId, claimId) => {
    const res = await client.post(`/resumes/${resumeId}/claims/${claimId}/reject`);
    return res.data;
  },

  updateClaim: async (resumeId, claimId, data) => {
    const res = await client.put(`/resumes/${resumeId}/claims/${claimId}`, data);
    return res.data;
  },

  // Source Facts
  listFacts: async (resumeId) => {
    const res = await client.get(`/resumes/${resumeId}/facts`);
    return res.data;
  },

  createFact: async (resumeId, data) => {
    const res = await client.post(`/resumes/${resumeId}/facts`, data);
    return res.data;
  },

  updateFact: async (resumeId, factId, data) => {
    const res = await client.put(`/resumes/${resumeId}/facts/${factId}`, data);
    return res.data;
  },

  deleteFact: async (resumeId, factId) => {
    const res = await client.delete(`/resumes/${resumeId}/facts/${factId}`);
    return res.data;
  },
};
