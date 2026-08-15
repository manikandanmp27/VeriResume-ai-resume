import client from './client';

export const profileApi = {
  getProfile: async () => {
    const res = await client.get('/profile');
    return res.data;
  },

  updateProfile: async (profileData) => {
    const res = await client.put('/profile', profileData);
    return res.data;
  },
};
