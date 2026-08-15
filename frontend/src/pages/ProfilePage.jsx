import React, { useState, useEffect } from 'react';
import { profileApi } from '../api/profileApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github, 
  Globe, 
  Save, 
  ShieldCheck, 
  Loader2 
} from 'lucide-react';

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    professionalSummary: '',
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await profileApi.getProfile();
      setFormData({
        fullName: data.fullName || user?.fullName || '',
        email: data.email || user?.email || '',
        phone: data.phone || '',
        location: data.location || '',
        linkedin: data.linkedin || '',
        github: data.github || '',
        portfolio: data.portfolio || '',
        professionalSummary: data.professionalSummary || '',
      });
    } catch (err) {
      console.error('Failed to load profile:', err);
      error('Could not load profile details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await profileApi.updateProfile(formData);
      await refreshUser();
      success('Career profile updated successfully!');
    } catch (err) {
      console.error('Profile update failed:', err);
      error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner text="Loading career profile..." size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Career Profile & Base Grounding
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Your master contact information and base summary used to pre-populate new resumes.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="btn-primary self-start sm:self-auto shadow-glow-primary"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
              Saving Profile...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-1.5" />
              Save Profile Changes
            </>
          )}
        </button>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border-slate-800">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-brand-950/20 border border-brand-500/20 text-slate-300 text-xs">
          <ShieldCheck className="w-5 h-5 text-brand-400 flex-shrink-0" />
          <span>
            This information serves as your baseline source of truth across all resumes created in Verita.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="Alex Turner"
                  required
                  className="input-field !pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="alex.turner@example.com"
                  required
                  className="input-field !pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+1 (555) 234-5678"
                  className="input-field !pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Location (City, State / Country)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="San Francisco, CA"
                  className="input-field !pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                LinkedIn Profile URL
              </label>
              <div className="relative">
                <Linkedin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => handleChange('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/alexturner"
                  className="input-field !pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                GitHub Profile URL
              </label>
              <div className="relative">
                <Github className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="url"
                  value={formData.github}
                  onChange={(e) => handleChange('github', e.target.value)}
                  placeholder="https://github.com/alexturner"
                  className="input-field !pl-10"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Portfolio / Website
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="url"
                  value={formData.portfolio}
                  onChange={(e) => handleChange('portfolio', e.target.value)}
                  placeholder="https://alexturner.dev"
                  className="input-field !pl-10"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Master Professional Summary
            </label>
            <textarea
              rows={4}
              value={formData.professionalSummary}
              onChange={(e) => handleChange('professionalSummary', e.target.value)}
              placeholder="High-level overview of your background, experience, key technical competencies, and career objectives..."
              className="input-field resize-y"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
