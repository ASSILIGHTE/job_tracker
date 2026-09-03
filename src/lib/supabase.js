import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://pxogemqbrrtowxrvewfj.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_1ArSa2dM6QJcPS7lpWkFVg_EXcgGgDf';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

const LOCAL_JOBS_KEY = 'job_tracker_local_jobs_v6';
const LOCAL_USER_KEY = 'job_tracker_local_user';

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-supabase-project-id') &&
    !supabaseAnonKey.includes('your-supabase-anon-key')
  );
};

export const supabase = createClient(
  isSupabaseConfigured() ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured() ? supabaseAnonKey : 'placeholder-key'
);

export const getLocalSessionUser = () => {
  try {
    const saved = localStorage.getItem(LOCAL_USER_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export const setLocalSessionUser = (userObj) => {
  if (userObj) {
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userObj));
  } else {
    localStorage.removeItem(LOCAL_USER_KEY);
  }
};

// Generate a valid random UUID v4
const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
};

const getLocalJobs = () => {
  try {
    const raw = localStorage.getItem(LOCAL_JOBS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveLocalJobs = (jobs) => {
  try {
    localStorage.setItem(LOCAL_JOBS_KEY, JSON.stringify(jobs));
  } catch (e) {
    console.error('Error saving local jobs:', e);
  }
};

const LOCAL_ACCOUNTS_KEY = 'job_tracker_local_accounts_v1';

export const PRESET_ACCOUNTS = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    email: 'aufariq123@gmail.com',
    password: 'aufariq123',
    fullName: 'Aufariq',
    role: 'Job Seeker',
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    email: 'amelia@gmail.com',
    password: 'amel123',
    fullName: 'Amelia',
    role: 'UI/UX Designer',
  },
];

export const getLocalAccounts = () => {
  try {
    const raw = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
    const customAccounts = raw ? JSON.parse(raw) : [];
    return [...PRESET_ACCOUNTS, ...customAccounts];
  } catch {
    return PRESET_ACCOUNTS;
  }
};

export const saveLocalAccount = (accountObj) => {
  try {
    const accounts = getLocalAccounts().filter(acc => acc.email !== accountObj.email);
    accounts.push(accountObj);
    localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts.filter(a => !PRESET_ACCOUNTS.some(p => p.email === a.email))));
  } catch (e) {
    console.error('Error saving local account:', e);
  }
};

// ------------------------------------------
// AUTH HELPER FUNCTIONS
// ------------------------------------------

export const signUpUser = async (email, password, fullName = '') => {
  const normEmail = email.trim().toLowerCase();

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: normEmail,
        password,
        options: { data: { full_name: fullName } }
      });

      if (!error && data?.user) {
        setLocalSessionUser(data.user);
        return { data, error: null };
      }
    } catch (err) {
      console.warn('Supabase signUp error, falling back to local:', err);
    }
  }

  // Local fallback registration
  const newUserId = generateUUID();
  const localUserObj = {
    id: newUserId,
    email: normEmail,
    password,
    fullName: fullName || normEmail.split('@')[0],
  };

  saveLocalAccount(localUserObj);

  const formattedUser = {
    id: newUserId,
    email: normEmail,
    user_metadata: { full_name: localUserObj.fullName },
    app_metadata: { provider: 'email' },
    created_at: new Date().toISOString()
  };

  setLocalSessionUser(formattedUser);
  return { data: { user: formattedUser }, error: null };
};

export const signInUser = async (email, password) => {
  const normEmail = email.trim().toLowerCase();

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normEmail,
        password,
      });

      if (!error && data?.user) {
        setLocalSessionUser(data.user);
        return { data, error: null };
      }
    } catch (err) {
      console.warn('Supabase signIn error, checking local preset accounts:', err);
    }
  }

  // Fallback check against preset and registered accounts
  const allAccounts = getLocalAccounts();
  const matched = allAccounts.find(
    (acc) => acc.email.toLowerCase() === normEmail && acc.password === password
  );

  if (matched) {
    const formattedUser = {
      id: matched.id || generateUUID(),
      email: matched.email,
      user_metadata: { full_name: matched.fullName },
      app_metadata: { provider: 'email' },
      created_at: new Date().toISOString()
    };

    setLocalSessionUser(formattedUser);
    return { data: { user: formattedUser }, error: null };
  }

  return { 
    data: null, 
    error: { message: 'Email atau kata sandi yang Anda masukkan salah.' } 
  };
};

export const signOutUser = async () => {
  setLocalSessionUser(null);
  if (isSupabaseConfigured()) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Signout error:', err);
    }
  }
  return { error: null };
};

// ------------------------------------------
// JOBS CRUD HELPER FUNCTIONS (STRICT SUPABASE DIRECT WRITE)
// ------------------------------------------

const VALID_CLOUD_STATUSES = ['Wishlist', 'Dilamar', 'Screening', 'Sedang Tes', 'Interview', 'Offering', 'Diterima', 'Ditolak'];

export const syncLocalJobsToCloud = async () => {
  if (!isSupabaseConfigured()) return { count: 0 };
  const localJobs = getLocalJobs();
  if (localJobs.length === 0) return { count: 0 };

  try {
    const { data: cloudData, error: fetchErr } = await supabase.from('jobs').select('id');
    if (fetchErr) return { count: 0 };

    const cloudIds = new Set((cloudData || []).map((j) => j.id));
    const unsyncedJobs = localJobs.filter((j) => !cloudIds.has(j.id));

    let syncedCount = 0;
    for (const job of unsyncedJobs) {
      const safeStatus = VALID_CLOUD_STATUSES.includes(job.status) ? job.status : 'Wishlist';
      const payload = {
        company_name: job.company_name,
        position: job.position,
        location: job.location || '',
        job_url: job.job_url || '',
        applied_date: job.applied_date || new Date().toISOString().split('T')[0],
        status: safeStatus,
        salary: job.salary || '',
        notes: job.notes || '',
      };
      if (job.user_id) payload.user_id = job.user_id;

      const { error } = await supabase.from('jobs').insert([payload]);
      if (!error) syncedCount++;
    }

    return { count: syncedCount };
  } catch (err) {
    console.error('Error syncing local jobs to cloud:', err);
    return { count: 0 };
  }
};

export const getJobs = async () => {
  if (isSupabaseConfigured()) {
    try {
      // Auto background sync for local-only jobs
      syncLocalJobsToCloud().catch(() => {});

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && Array.isArray(data)) {
        const localJobs = getLocalJobs();
        const cloudIds = new Set(data.map((j) => j.id));
        const localOnlyJobs = localJobs.filter((j) => !cloudIds.has(j.id));
        const localMap = new Map(localJobs.map((j) => [j.id, j]));

        const formattedCloudData = data.map((j) => {
          const loc = localMap.get(j.id);
          return {
            ...j,
            status: j.status || loc?.status || 'Wishlist',
            platform: j.platform || loc?.platform || 'MagangHub'
          };
        });

        const mergedData = [...formattedCloudData, ...localOnlyJobs];
        saveLocalJobs(mergedData);
        return { data: mergedData, isCloud: true, error: null };
      } else if (error) {
        console.warn('Supabase getJobs warning:', error.message);
      }
    } catch (err) {
      console.warn('Supabase getJobs catch:', err);
    }
  }

  return { data: getLocalJobs(), isCloud: false, error: null };
};

export const addJob = async (jobData) => {
  let remoteJob = null;
  let supabaseErrorMsg = null;

  if (isSupabaseConfigured()) {
    try {
      const authUser = await getLocalSessionUser();
      const isValidUUID = (id) => typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      const validUserId = authUser?.id && isValidUUID(authUser.id) ? authUser.id : (isValidUUID(generateUUID()) ? generateUUID() : null);

      const safeStatus = VALID_CLOUD_STATUSES.includes(jobData.status) ? jobData.status : 'Screening';

      // 1. Try full payload with all fields
      const fullPayload = {
        company_name: jobData.company_name,
        position: jobData.position,
        platform: jobData.platform || 'MagangHub',
        location: jobData.location || '',
        job_url: jobData.job_url || '',
        applied_date: jobData.applied_date || new Date().toISOString().split('T')[0],
        status: safeStatus,
        salary: jobData.salary || '',
        notes: jobData.notes || '',
      };
      if (validUserId) fullPayload.user_id = validUserId;

      let { data, error } = await supabase
        .from('jobs')
        .insert([fullPayload])
        .select()
        .single();

      // 2. If full payload fails due to legacy schema (e.g. missing platform column), try sanitized payload
      if (error) {
        const safePayload = {
          company_name: jobData.company_name,
          position: jobData.position,
          location: jobData.location || '',
          job_url: jobData.job_url || '',
          applied_date: jobData.applied_date || new Date().toISOString().split('T')[0],
          status: safeStatus,
          salary: jobData.salary || '',
          notes: jobData.notes || '',
        };
        if (validUserId) safePayload.user_id = validUserId;

        const retry = await supabase
          .from('jobs')
          .insert([safePayload])
          .select()
          .single();

        if (!retry.error && retry.data) {
          data = retry.data;
          error = null;
        }
      }

      if (!error && data) {
        remoteJob = {
          ...data,
          status: jobData.status || data.status,
          platform: jobData.platform || data.platform || 'MagangHub'
        };
      } else if (error) {
        supabaseErrorMsg = error.message;
        console.error('Supabase direct insert error:', error);
      }
    } catch (err) {
      supabaseErrorMsg = err.message;
      console.error('Supabase direct insert catch:', err);
    }
  }

  if (remoteJob) {
    const currentJobs = getLocalJobs();
    saveLocalJobs([remoteJob, ...currentJobs.filter(j => j.id !== remoteJob.id)]);
    return { data: remoteJob, isCloud: true, error: null };
  }

  // Fallback local job if Supabase is offline
  const newJob = {
    id: generateUUID(),
    company_name: jobData.company_name,
    position: jobData.position,
    platform: jobData.platform || 'MagangHub',
    location: jobData.location || '',
    job_url: jobData.job_url || '',
    applied_date: jobData.applied_date || new Date().toISOString().split('T')[0],
    status: jobData.status || 'Wishlist',
    salary: jobData.salary || '',
    notes: jobData.notes || '',
    created_at: new Date().toISOString()
  };

  const currentJobs = getLocalJobs();
  const updatedJobs = [newJob, ...currentJobs.filter(j => j.id !== newJob.id)];
  saveLocalJobs(updatedJobs);

  return { data: newJob, isCloud: false, supabaseErrorMsg, error: null };
};

export const updateJob = async (id, jobData) => {
  let remoteSuccess = false;

  if (isSupabaseConfigured()) {
    try {
      const safeStatus = VALID_CLOUD_STATUSES.includes(jobData.status) ? jobData.status : 'Screening';

      // 1. Try full payload with all fields
      const fullPayload = {
        company_name: jobData.company_name,
        position: jobData.position,
        platform: jobData.platform || 'MagangHub',
        location: jobData.location || '',
        job_url: jobData.job_url || '',
        applied_date: jobData.applied_date,
        status: safeStatus,
        salary: jobData.salary || '',
        notes: jobData.notes || '',
        updated_at: new Date().toISOString()
      };

      let { data, error } = await supabase
        .from('jobs')
        .update(fullPayload)
        .eq('id', id)
        .select()
        .single();

      // 2. If full payload fails due to legacy schema (e.g. missing platform column or missing row), try safe sanitized payload
      if (error) {
        const safePayload = {
          company_name: jobData.company_name,
          position: jobData.position,
          location: jobData.location || '',
          job_url: jobData.job_url || '',
          applied_date: jobData.applied_date,
          status: safeStatus,
          salary: jobData.salary || '',
          notes: jobData.notes || '',
          updated_at: new Date().toISOString()
        };

        let retry = await supabase
          .from('jobs')
          .update(safePayload)
          .eq('id', id)
          .select()
          .single();

        if (retry.error && retry.error.code === 'PGRST116') {
          delete safePayload.updated_at;
          retry = await supabase
            .from('jobs')
            .insert([safePayload])
            .select()
            .single();
        }

        if (!retry.error && retry.data) {
          data = retry.data;
          error = null;
        }
      }

      if (!error && data) {
        remoteSuccess = true;
        const updatedData = {
          ...data,
          status: jobData.status || data.status,
          platform: jobData.platform || data.platform || 'MagangHub'
        };
        const currentJobs = getLocalJobs();
        saveLocalJobs(currentJobs.map((j) => (j.id === id ? updatedData : j)));
        return { data: updatedData, isCloud: true, error: null };
      }
    } catch (err) {
      console.warn('Supabase updateJob error:', err);
    }
  }

  const currentJobs = getLocalJobs();
  const updatedJobs = currentJobs.map((j) => (j.id === id ? { ...j, ...jobData } : j));
  saveLocalJobs(updatedJobs);

  return { data: { id, ...jobData }, isCloud: remoteSuccess, error: null };
};

export const deleteJob = async (id) => {
  let remoteSuccess = false;

  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);

      if (!error) {
        remoteSuccess = true;
        const currentJobs = getLocalJobs();
        saveLocalJobs(currentJobs.filter((j) => j.id !== id));
        return { isCloud: true, error: null };
      }
    } catch (err) {
      console.warn('Supabase deleteJob error:', err);
    }
  }

  const currentJobs = getLocalJobs();
  const updatedJobs = currentJobs.filter((j) => j.id !== id);
  saveLocalJobs(updatedJobs);

  return { isCloud: false, error: null };
};
