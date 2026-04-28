const API_BASE = '/api';

/**
 * Generic fetch wrapper with error handling.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Attach auth token if available
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

// ─── Public API ───
export const api = {
  // Projects
  getProjects: () => request('/projects'),

  // Certificates
  getCertificates: () => request('/certificates'),

  // Skills
  getSkills: () => request('/skills'),

  // Resume
  getExperience: () => request('/resume/experience'),
  getEducation: () => request('/resume/education'),

  // Contact
  sendMessage: (data) =>
    request('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ─── Admin API ───
export const adminApi = {
  // Auth
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  verifyToken: () => request('/auth/me'),
  changePassword: (data) =>
    request('/auth/password', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Contacts
  getMessages: () => request('/contact'),
  markRead: (id) => request(`/contact/${id}/read`, { method: 'PUT' }),
  deleteMessage: (id) => request(`/contact/${id}`, { method: 'DELETE' }),

  // Projects
  createProject: (data) =>
    request('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id, data) =>
    request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id) =>
    request(`/projects/${id}`, { method: 'DELETE' }),

  // Certificates
  createCertificate: (data) =>
    request('/certificates', { method: 'POST', body: JSON.stringify(data) }),
  updateCertificate: (id, data) =>
    request(`/certificates/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCertificate: (id) =>
    request(`/certificates/${id}`, { method: 'DELETE' }),

  // Experience
  createExperience: (data) =>
    request('/resume/experience', { method: 'POST', body: JSON.stringify(data) }),
  updateExperience: (id, data) =>
    request(`/resume/experience/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteExperience: (id) =>
    request(`/resume/experience/${id}`, { method: 'DELETE' }),

  // Education
  createEducation: (data) =>
    request('/resume/education', { method: 'POST', body: JSON.stringify(data) }),
  updateEducation: (id, data) =>
    request(`/resume/education/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEducation: (id) =>
    request(`/resume/education/${id}`, { method: 'DELETE' }),

  // Skills
  createSkill: (data) =>
    request('/skills', { method: 'POST', body: JSON.stringify(data) }),
  updateSkill: (id, data) =>
    request(`/skills/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSkill: (id) =>
    request(`/skills/${id}`, { method: 'DELETE' }),
};
