import { RateLimiterMemory, RateLimiterRedis } from 'rate-limiter-flexible';
import { REDIS_URL } from '../env';

let redisClient: any | null = null;

async function getRedisClient() {
  if (!REDIS_URL) return null;
  if (redisClient) return redisClient;

  try {
    const { Redis } = await import('ioredis');
    redisClient = new Redis(REDIS_URL, {
      enableOfflineQueue: false,
      connectTimeout: 2000,
      maxRetriesPerRequest: 1,
    });
    redisClient.on('error', () => {
      redisClient = null;
    });
    return redisClient;
  } catch {
    redisClient = null;
    return null;
  }
}

async function criarLimiter(opcoes: { points: number; duration: number; keyPrefix: string }) {
  const clienteRedis = await getRedisClient();
  if (clienteRedis) {
    return new RateLimiterRedis({
      storeClient: clienteRedis,
      points: opcoes.points,
      duration: opcoes.duration,
      keyPrefix: `mielina:${opcoes.keyPrefix}`,
      insuranceLimiter: new RateLimiterMemory(opcoes),
    });
  }
  return new RateLimiterMemory(opcoes);
}

export const rateLimiterGlobal = criarLimiter({
  points: 300,
  duration: 60,
  keyPrefix: 'global',
});

export const rateLimiterAuth = criarLimiter({
  points: 15,
  duration: 60,
  keyPrefix: 'auth',
});

export const rateLimiterChat = criarLimiter({
  points: 50,
  duration: 3600,
  keyPrefix: 'chat',
});

export const rateLimiterTriagem = criarLimiter({
  points: 20,
  duration: 86400,
  keyPrefix: 'triagem',
});

export const rateLimiterLaudosCriar = criarLimiter({
  points: 30,
  duration: 86400,
  keyPrefix: 'laudos:criar',
});
