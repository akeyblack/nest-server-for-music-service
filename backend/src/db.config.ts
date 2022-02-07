const env = process.env;

export const config = {
  HOST: env.HOST ?? 'localhost',
  REDIS_PORT: Number(env.REDIS_PORT) ?? 6379,
  POSTGRES_PORT: Number(env.POSTGRES_PORT) ?? 5432,
  USERNAME: env.USERNAME ?? 'postgres',
  PASSWORD: env.PASSWORD ?? 'postgres',
  DATABASE: env.DATEBASE ?? 'course'
}