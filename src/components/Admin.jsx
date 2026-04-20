import React, { useState, useEffect } from 'react';
import { adminApi } from '../utils/api';
import './Admin.css';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState('messages');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Data states
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);

  // Edit/Create modal state
  const [modal, setModal] = useState({ open: false, type: '', data: null, isEdit: false });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      adminApi.verifyToken()
        .then(() => {
          setIsLoggedIn(true);
          loadAllData();
        })
        .catch(() => localStorage.removeItem('admin_token'));
    }
  }, []);

  const loadAllData = async () => {
    try {
      const [msgs, projs, certs, exps, edus] = await Promise.all([
        adminApi.getMessages(),
        adminApi.createProject ? fetch('/api/projects').then(r => r.json()) : [],
        fetch('/api/certificates').then(r => r.json()),
        fetch('/api/resume/experience').then(r => r.json()),
        fetch('/api/resume/education').then(r => r.json()),
      ]);
      setMessages(msgs);
      setProjects(projs);
      setCertificates(certs);
      setExperience(exps);
      setEducation(edus);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const result = await adminApi.login(loginForm);
      localStorage.setItem('admin_token', result.token);
      setIsLoggedIn(true);
      loadAllData();
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsLoggedIn(false);
  };

  const handleDelete = async (type, id) => {
    if (!confirm('Are you sure you want to delete this?')) return;
    try {
      if (type === 'message') await adminApi.deleteMessage(id);
      else if (type === 'project') await adminApi.deleteProject(id);
      else if (type === 'certificate') await adminApi.deleteCertificate(id);
      else if (type === 'experience') await adminApi.deleteExperience(id);
      else if (type === 'education') await adminApi.deleteEducation(id);
      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await adminApi.markRead(id);
      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const openModal = (type, data = null) => {
    setModal({ open: true, type, data: data || getDefaultData(type), isEdit: !!data });
  };

  const getDefaultData = (type) => {
    switch (type) {
      case 'project': return { title: '', description: '', tags: [], color: '#1a2a3a', github_url: '', live_url: '', display_order: 0 };
      case 'certificate': return { title: '', issuer: '', date: '', icon: '📜', color: '#1a2a3a', display_order: 0 };
      case 'experience': return { role: '', company: '', period: '', description: '', tags: [], display_order: 0 };
      case 'education': return { degree: '', institution: '', period: '', description: '', display_order: 0 };
      default: return {};
    }
  };

  const handleSave = async () => {
    const { type, data, isEdit } = modal;
    try {
      if (type === 'project') {
        const payload = { ...data, tags: typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim()) : data.tags };
        isEdit ? await adminApi.updateProject(data.id, payload) : await adminApi.createProject(payload);
      } else if (type === 'certificate') {
        isEdit ? await adminApi.updateCertificate(data.id, data) : await adminApi.createCertificate(data);
      } else if (type === 'experience') {
        const payload = { ...data, tags: typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim()) : data.tags };
        isEdit ? await adminApi.updateExperience(data.id, payload) : await adminApi.createExperience(payload);
      } else if (type === 'education') {
        isEdit ? await adminApi.updateEducation(data.id, data) : await adminApi.createEducation(data);
      }
      setModal({ open: false, type: '', data: null, isEdit: false });
      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const updateModalField = (field, value) => {
    setModal((prev) => ({ ...prev, data: { ...prev.data, [field]: value } }));
  };

  // ─── Login Screen ───
  if (!isLoggedIn) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <h1>Abel<span className="accent">.</span></h1>
            <p>Admin Dashboard</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="admin-field">
              <label>Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                placeholder="Enter username"
                required
              />
            </div>
            <div className="admin-field">
              <label>Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="Enter password"
                required
              />
            </div>
            {loginError && <p className="admin-error">{loginError}</p>}
            <button type="submit" className="btn-primary admin-login-btn">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  // ─── Dashboard ───
  const unreadCount = messages.filter((m) => !m.read).length;

  const navItems = [
    { key: 'messages', label: 'Messages', icon: '📩', badge: unreadCount },
    { key: 'projects', label: 'Projects', icon: '🚀' },
    { key: 'certificates', label: 'Certificates', icon: '📜' },
    { key: 'experience', label: 'Experience', icon: '💼' },
    { key: 'education', label: 'Education', icon: '🎓' },
  ];

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Abel<span className="accent">.</span></h2>
          <span className="admin-badge">Admin</span>
        </div>
        <nav className="admin-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`admin-nav-item ${activeSection === item.key ? 'active' : ''}`}
              onClick={() => setActiveSection(item.key)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {item.label}
              {item.badge > 0 && <span className="admin-nav-badge">{item.badge}</span>}
            </button>
          ))}
        </nav>
        <button className="admin-logout" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-topbar">
          <h1 className="admin-page-title">
            {navItems.find((n) => n.key === activeSection)?.icon}{' '}
            {navItems.find((n) => n.key === activeSection)?.label}
          </h1>
          {activeSection !== 'messages' && (
            <button className="btn-primary admin-add-btn" onClick={() => openModal(activeSection === 'experience' ? 'experience' : activeSection === 'education' ? 'education' : activeSection === 'projects' ? 'project' : 'certificate')}>
              + Add New
            </button>
          )}
        </div>

        <div className="admin-content">
          {/* Messages */}
          {activeSection === 'messages' && (
            <div className="admin-list">
              {messages.length === 0 ? (
                <div className="admin-empty">No messages yet.</div>
              ) : (
                messages.map((msg) => (
                  <div className={`admin-card ${!msg.read ? 'unread' : ''}`} key={msg.id}>
                    <div className="admin-card-header">
                      <div>
                        <strong>{msg.name}</strong>
                        <span className="admin-card-meta">{msg.email}</span>
                      </div>
                      <span className="admin-card-date">{new Date(msg.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="admin-card-body">{msg.message}</p>
                    <div className="admin-card-actions">
                      {!msg.read && (
                        <button className="admin-action-btn" onClick={() => handleMarkRead(msg.id)}>
                          ✓ Mark Read
                        </button>
                      )}
                      <button className="admin-action-btn danger" onClick={() => handleDelete('message', msg.id)}>
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Projects */}
          {activeSection === 'projects' && (
            <div className="admin-list">
              {projects.map((p) => (
                <div className="admin-card" key={p.id}>
                  <div className="admin-card-header">
                    <strong>{p.title}</strong>
                    <div className="admin-card-actions">
                      <button className="admin-action-btn" onClick={() => openModal('project', { ...p, tags: (p.tags || []).join(', ') })}>✏️ Edit</button>
                      <button className="admin-action-btn danger" onClick={() => handleDelete('project', p.id)}>🗑</button>
                    </div>
                  </div>
                  <p className="admin-card-body">{p.description}</p>
                  {p.github_url && <p className="admin-card-meta">GitHub: {p.github_url}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Certificates */}
          {activeSection === 'certificates' && (
            <div className="admin-list">
              {certificates.map((c) => (
                <div className="admin-card" key={c.id}>
                  <div className="admin-card-header">
                    <strong>{c.icon} {c.title}</strong>
                    <div className="admin-card-actions">
                      <button className="admin-action-btn" onClick={() => openModal('certificate', c)}>✏️ Edit</button>
                      <button className="admin-action-btn danger" onClick={() => handleDelete('certificate', c.id)}>🗑</button>
                    </div>
                  </div>
                  <p className="admin-card-meta">{c.issuer} · {c.date}</p>
                </div>
              ))}
            </div>
          )}

          {/* Experience */}
          {activeSection === 'experience' && (
            <div className="admin-list">
              {experience.map((e) => (
                <div className="admin-card" key={e.id}>
                  <div className="admin-card-header">
                    <div>
                      <strong>{e.role}</strong>
                      <span className="admin-card-meta">{e.company}</span>
                    </div>
                    <div className="admin-card-actions">
                      <button className="admin-action-btn" onClick={() => openModal('experience', { ...e, tags: (e.tags || []).join(', ') })}>✏️ Edit</button>
                      <button className="admin-action-btn danger" onClick={() => handleDelete('experience', e.id)}>🗑</button>
                    </div>
                  </div>
                  <p className="admin-card-body">{e.description}</p>
                  <p className="admin-card-meta">{e.period}</p>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {activeSection === 'education' && (
            <div className="admin-list">
              {education.map((e) => (
                <div className="admin-card" key={e.id}>
                  <div className="admin-card-header">
                    <div>
                      <strong>{e.degree}</strong>
                      <span className="admin-card-meta">{e.institution}</span>
                    </div>
                    <div className="admin-card-actions">
                      <button className="admin-action-btn" onClick={() => openModal('education', e)}>✏️ Edit</button>
                      <button className="admin-action-btn danger" onClick={() => handleDelete('education', e.id)}>🗑</button>
                    </div>
                  </div>
                  <p className="admin-card-body">{e.description}</p>
                  <p className="admin-card-meta">{e.period}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {modal.open && (
        <div className="admin-modal-overlay" onClick={() => setModal({ open: false, type: '', data: null, isEdit: false })}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{modal.isEdit ? 'Edit' : 'Create'} {modal.type}</h2>
            <div className="admin-modal-form">
              {/* Dynamic fields based on type */}
              {modal.type === 'project' && (
                <>
                  <div className="admin-field"><label>Title</label><input value={modal.data.title || ''} onChange={(e) => updateModalField('title', e.target.value)} /></div>
                  <div className="admin-field"><label>Description</label><textarea value={modal.data.description || ''} onChange={(e) => updateModalField('description', e.target.value)} /></div>
                  <div className="admin-field"><label>Tags (comma separated)</label><input value={modal.data.tags || ''} onChange={(e) => updateModalField('tags', e.target.value)} /></div>
                  <div className="admin-field"><label>GitHub URL</label><input value={modal.data.github_url || ''} onChange={(e) => updateModalField('github_url', e.target.value)} /></div>
                  <div className="admin-field"><label>Live URL</label><input value={modal.data.live_url || ''} onChange={(e) => updateModalField('live_url', e.target.value)} /></div>
                  <div className="admin-field"><label>Color</label><input type="color" value={modal.data.color || '#1a2a3a'} onChange={(e) => updateModalField('color', e.target.value)} /></div>
                  <div className="admin-field"><label>Order</label><input type="number" value={modal.data.display_order || 0} onChange={(e) => updateModalField('display_order', parseInt(e.target.value))} /></div>
                </>
              )}
              {modal.type === 'certificate' && (
                <>
                  <div className="admin-field"><label>Title</label><input value={modal.data.title || ''} onChange={(e) => updateModalField('title', e.target.value)} /></div>
                  <div className="admin-field"><label>Issuer</label><input value={modal.data.issuer || ''} onChange={(e) => updateModalField('issuer', e.target.value)} /></div>
                  <div className="admin-field"><label>Date</label><input value={modal.data.date || ''} onChange={(e) => updateModalField('date', e.target.value)} /></div>
                  <div className="admin-field"><label>Icon (emoji)</label><input value={modal.data.icon || ''} onChange={(e) => updateModalField('icon', e.target.value)} /></div>
                  <div className="admin-field"><label>Color</label><input type="color" value={modal.data.color || '#1a2a3a'} onChange={(e) => updateModalField('color', e.target.value)} /></div>
                  <div className="admin-field"><label>Order</label><input type="number" value={modal.data.display_order || 0} onChange={(e) => updateModalField('display_order', parseInt(e.target.value))} /></div>
                </>
              )}
              {modal.type === 'experience' && (
                <>
                  <div className="admin-field"><label>Role</label><input value={modal.data.role || ''} onChange={(e) => updateModalField('role', e.target.value)} /></div>
                  <div className="admin-field"><label>Company</label><input value={modal.data.company || ''} onChange={(e) => updateModalField('company', e.target.value)} /></div>
                  <div className="admin-field"><label>Period</label><input value={modal.data.period || ''} onChange={(e) => updateModalField('period', e.target.value)} placeholder="e.g. 2024 — Present" /></div>
                  <div className="admin-field"><label>Description</label><textarea value={modal.data.description || ''} onChange={(e) => updateModalField('description', e.target.value)} /></div>
                  <div className="admin-field"><label>Tags (comma separated)</label><input value={modal.data.tags || ''} onChange={(e) => updateModalField('tags', e.target.value)} /></div>
                  <div className="admin-field"><label>Order</label><input type="number" value={modal.data.display_order || 0} onChange={(e) => updateModalField('display_order', parseInt(e.target.value))} /></div>
                </>
              )}
              {modal.type === 'education' && (
                <>
                  <div className="admin-field"><label>Degree</label><input value={modal.data.degree || ''} onChange={(e) => updateModalField('degree', e.target.value)} /></div>
                  <div className="admin-field"><label>Institution</label><input value={modal.data.institution || ''} onChange={(e) => updateModalField('institution', e.target.value)} /></div>
                  <div className="admin-field"><label>Period</label><input value={modal.data.period || ''} onChange={(e) => updateModalField('period', e.target.value)} placeholder="e.g. 2023 — Present" /></div>
                  <div className="admin-field"><label>Description</label><textarea value={modal.data.description || ''} onChange={(e) => updateModalField('description', e.target.value)} /></div>
                  <div className="admin-field"><label>Order</label><input type="number" value={modal.data.display_order || 0} onChange={(e) => updateModalField('display_order', parseInt(e.target.value))} /></div>
                </>
              )}
            </div>
            <div className="admin-modal-actions">
              <button className="btn-secondary" onClick={() => setModal({ open: false, type: '', data: null, isEdit: false })}>Cancel</button>
              <button className="btn-primary" onClick={handleSave}>
                {modal.isEdit ? 'Save Changes' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
