import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;
const CLASSIFICATION_SERVICE_URL = process.env.CLASSIFICATION_SERVICE_URL;
const LAUDO_SERVICE_URL = process.env.LAUDO_SERVICE_URL;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const COOKIE_SECURE_BRUTO = process.env.COOKIE_SECURE ?? 'false';
const COOKIE_SECURE = ['1', 'true', 'TRUE', 'yes', 'sim'].includes(COOKIE_SECURE_BRUTO);

const COOKIE_SAME_SITE_BRUTO = (process.env.COOKIE_SAME_SITE ?? 'lax').toLowerCase();
const COOKIE_SAME_SITE = (['lax', 'none', 'strict'].includes(COOKIE_SAME_SITE_BRUTO)
  ? COOKIE_SAME_SITE_BRUTO
  : 'lax') as 'lax' | 'none' | 'strict';

if (!RAG_SERVICE_URL) {
  throw new Error('RAG_SERVICE_URL não definida no .env');
}

if (!CLASSIFICATION_SERVICE_URL) {
  throw new Error('CLASSIFICATION_SERVICE_URL não definida no .env');
}

if (!LAUDO_SERVICE_URL) {
  throw new Error('LAUDO_SERVICE_URL não definida no .env');
}

if (!SUPABASE_URL) {
  throw new Error('SUPABASE_URL não definida no .env');
}

if (!SUPABASE_ANON_KEY) {
  throw new Error('SUPABASE_ANON_KEY não definida no .env');
}

export {
  PORT,
  RAG_SERVICE_URL,
  FRONTEND_URL,
  CLASSIFICATION_SERVICE_URL,
  LAUDO_SERVICE_URL,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  COOKIE_SECURE,
  COOKIE_SAME_SITE,
};
