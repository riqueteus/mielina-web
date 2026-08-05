import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;
const CLASSIFICATION_SERVICE_URL = process.env.CLASSIFICATION_SERVICE_URL;

if (!RAG_SERVICE_URL) {
  throw new Error('RAG_SERVICE_URL não definida no .env');
}

if (!CLASSIFICATION_SERVICE_URL) {
  throw new Error('CLASSIFICATION_SERVICE_URL não definida no .env');
}

export { PORT, RAG_SERVICE_URL, FRONTEND_URL, CLASSIFICATION_SERVICE_URL };
