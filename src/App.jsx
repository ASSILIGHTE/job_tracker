import React, { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured, getJobs, addJob, updateJob, deleteJob, signOutUser, getLocalSessionUser } from './lib/supabase';
import { ToastProvider, useToast } from './components/Toast';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import JobModal from './components/JobModal';
import ConfirmDialog from './components/ConfirmDialog';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';

function AppContent() {
  // Auth state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Navigation state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Jobs data state
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewingJob, setViewingJob] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingJob, setDeletingJob] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);

  const { addToast } = useToast();

  // ------------------------------------------
  // 1. AUTH & INITIAL SESSION SETUP
  // ------------------------------------------
  useEffect(() => {
    let subscription = null;

    const checkSession = async () => {
      if (!isSupabaseConfigured()) {
        setAuthLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(getLocalSessionUser());
        }
      } catch (err) {
        setUser(getLocalSessionUser());
      } finally {
        setAuthLoading(false);
      }

      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session?.user) {
            setUser(session.user);
          } else {
            setUser(getLocalSessionUser());
          }
          setAuthLoading(false);
        }
      );
      subscription = authListener?.subscription;
    };

    checkSession();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  // ------------------------------------------
  // 2. FETCH USER JOBS FROM SUPABASE
  // ------------------------------------------
  const fetchUserJobs = useCallback(async () => {
    if (!user || !isSupabaseConfigured()) {
      setJobs([]);
      return;
    }

    setJobsLoading(true);
    try {
      const { data, error } = await getJobs();
      if (error) {
        console.error('Fetch jobs error:', error);
        addToast('Gagal memuat data lamaran dari Supabase.', 'error');
      } else {
        setJobs(data || []);
      }
    } catch (err) {
      console.error('Fetch jobs error:', err);
    } finally {
      setJobsLoading(false);
    }
  }, [user, addToast]);

  useEffect(() => {
    if (user) {
      fetchUserJobs();
    }
  }, [user, fetchUserJobs]);

  // ------------------------------------------
  // 3. LOGOUT HANDLER
  // ------------------------------------------
  const handleLogout = async () => {
    await signOutUser();
    setUser(null);
    setJobs([]);
    addToast('Berhasil keluar dari akun.', 'info');
  };

  // ------------------------------------------
  // 4. CRUD HANDLERS
  // ------------------------------------------

  // CREATE / UPDATE
  const handleFormSubmit = async (formData) => {
    setActionLoading(true);
    try {
      if (editingJob) {
        // UPDATE
        const res = await updateJob(editingJob.id, formData);
        if (res?.error) {
          addToast('Gagal memperbarui di Supabase: ' + res.error.message, 'error');
        } else {
          const msg = res?.isCloud 
            ? 'Lamaran berhasil diperbarui di Supabase Cloud! ☁️' 
            : 'Lamaran berhasil diperbarui secara lokal! 📱';
          addToast(msg, 'success');
          setIsFormModalOpen(false);
          setEditingJob(null);
          await fetchUserJobs();
        }
      } else {
        // CREATE
        const res = await addJob(formData);
        if (res?.isCloud) {
          addToast('Lamaran berhasil tersimpan di Supabase Cloud! ☁️', 'success');
        } else {
          const reason = res?.supabaseErrorMsg ? ` (${res.supabaseErrorMsg})` : '';
          addToast('Tersimpan di Penyimpanan Lokal. ' + reason, 'info');
        }
        setIsFormModalOpen(false);
        await fetchUserJobs();
      }
    } catch (err) {
      addToast('Terjadi kesalahan: ' + err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // DELETE CONFIRMATION
  const handleConfirmDelete = async () => {
    if (!deletingJob) return;

    setActionLoading(true);
    try {
      await deleteJob(deletingJob.id);
      addToast('Lamaran berhasil dihapus', 'success');
      setIsDeleteModalOpen(false);
      setDeletingJob(null);
      await fetchUserJobs();
    } catch (err) {
      addToast('Terjadi kesalahan saat menghapus: ' + err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // DIRECT STATUS UPDATE
  const handleUpdateStatus = async (job, newStatus) => {
    if (!job || job.status === newStatus) return;

    // Optimistic UI update for 100% instant reactivity
    setJobs((prevJobs) =>
      prevJobs.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j))
    );
    addToast(`Status ${job.company_name} diubah menjadi "${newStatus}"!`, 'success');

    setActionLoading(true);
    try {
      const updatedData = { ...job, status: newStatus };
      await updateJob(job.id, updatedData);
    } catch (err) {
      addToast('Terjadi kesalahan saat menyimpan status: ' + err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // MODAL OPEN HELPERS
  const openAddModal = () => {
    setEditingJob(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setIsFormModalOpen(true);
  };

  const openDetailModal = (job) => {
    setViewingJob(job);
    setIsDetailModalOpen(true);
  };

  const openDeleteModal = (job) => {
    setDeletingJob(job);
    setIsDeleteModalOpen(true);
  };

  // ------------------------------------------
  // RENDER LOADING INITIAL SCREEN
  // ------------------------------------------
  if (authLoading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-pink-600 text-white flex items-center justify-center mx-auto shadow-md shadow-pink-200 animate-pulse">
            <span className="font-bold text-lg">JT</span>
          </div>
          <p className="text-xs font-semibold text-pink-600">Memuat Famel Job Tracker...</p>
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // RENDER AUTHENTICATION (LOGIN ONLY)
  // ------------------------------------------
  if (!user) {
    return (
      <Login
        onLoginSuccess={(loggedUser) => setUser(loggedUser)}
      />
    );
  }

  // ------------------------------------------
  // RENDER MAIN APPLICATION LAYOUT
  // ------------------------------------------
  return (
    <div className="min-h-screen bg-[#fff9fb] flex">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenAddModal={openAddModal}
          searchQuery={searchQuery}
          setSearchQuery={(q) => {
            setSearchQuery(q);
            if (activeTab !== 'jobs') setActiveTab('jobs');
          }}
          pageTitle={
            activeTab === 'dashboard' ? 'Dashboard' :
            activeTab === 'jobs' ? 'Lamaran Saya' :
            activeTab === 'statistics' ? 'Statistik' : 'Pengaturan'
          }
        />

        {/* Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              jobs={jobs}
              loading={jobsLoading}
              user={user}
              onOpenAddModal={openAddModal}
              onViewJob={openDetailModal}
              onEditJob={openEditModal}
              onDeleteJob={openDeleteModal}
              onUpdateStatus={handleUpdateStatus}
              onNavigateToJobs={() => setActiveTab('jobs')}
            />
          )}

          {activeTab === 'jobs' && (
            <Jobs
              jobs={jobs}
              loading={jobsLoading}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onOpenAddModal={openAddModal}
              onViewJob={openDetailModal}
              onEditJob={openEditModal}
              onDeleteJob={openDeleteModal}
              onUpdateStatus={handleUpdateStatus}
            />
          )}

          {activeTab === 'statistics' && (
            <Statistics jobs={jobs} />
          )}

          {activeTab === 'settings' && (
            <Settings user={user} onLogout={handleLogout} />
          )}
        </main>
      </div>

      {/* Modals & Dialogs */}
      <JobModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingJob(null);
        }}
        initialData={editingJob}
        onSubmit={handleFormSubmit}
        isLoading={actionLoading}
      />

      <JobDetail
        job={viewingJob}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setViewingJob(null);
        }}
        onEdit={(j) => openEditModal(j)}
        onDelete={(j) => openDeleteModal(j)}
      />

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingJob(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Hapus Data Lamaran"
        message={
          deletingJob
            ? `Apakah Anda yakin ingin menghapus lamaran di ${deletingJob.company_name} - ${deletingJob.position}?`
            : 'Apakah Anda yakin ingin menghapus lamaran ini?'
        }
        isLoading={actionLoading}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
