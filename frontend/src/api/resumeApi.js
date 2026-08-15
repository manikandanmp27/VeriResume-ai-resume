import client from './client';

export const resumeApi = {
  listResumes: async () => {
    const res = await client.get('/resumes');
    return res.data;
  },

  createResume: async (data) => {
    const res = await client.post('/resumes', data);
    return res.data;
  },

  getResume: async (id) => {
    const res = await client.get(`/resumes/${id}`);
    return res.data;
  },

  updateResume: async (id, data) => {
    const res = await client.put(`/resumes/${id}`, data);
    return res.data;
  },

  deleteResume: async (id) => {
    const res = await client.delete(`/resumes/${id}`);
    return res.data;
  },

  // Section Content APIs
  getContent: async (id) => {
    const res = await client.get(`/resumes/${id}/content`);
    return res.data;
  },

  updateFullContent: async (id, content) => {
    const res = await client.put(`/resumes/${id}/content`, content);
    return res.data;
  },

  updatePersonalInfo: async (id, personalInfo) => {
    const res = await client.put(`/resumes/${id}/personal-info`, personalInfo);
    return res.data;
  },

  updateEducation: async (id, education) => {
    const res = await client.put(`/resumes/${id}/education`, education);
    return res.data;
  },

  updateSkills: async (id, skills) => {
    const res = await client.put(`/resumes/${id}/skills`, skills);
    return res.data;
  },

  updateProjects: async (id, projects) => {
    const res = await client.put(`/resumes/${id}/projects`, projects);
    return res.data;
  },

  updateExperience: async (id, experience) => {
    const res = await client.put(`/resumes/${id}/experience`, experience);
    return res.data;
  },

  updateAchievements: async (id, achievements) => {
    const res = await client.put(`/resumes/${id}/achievements`, achievements);
    return res.data;
  },

  updateCertifications: async (id, certifications) => {
    const res = await client.put(`/resumes/${id}/certifications`, certifications);
    return res.data;
  },

  // Dashboard Aggregated Data
  getDashboard: async () => {
    const res = await client.get('/dashboard');
    return res.data;
  },
};
