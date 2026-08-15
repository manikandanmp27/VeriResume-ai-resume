import client from './client';

export const templateApi = {
  listTemplates: async () => {
    const res = await client.get('/templates');
    return res.data;
  },

  getTemplate: async (templateId) => {
    const res = await client.get(`/templates/${templateId}`);
    return res.data;
  },
};
