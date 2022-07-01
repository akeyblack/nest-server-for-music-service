const env = process.env;

export const config = () => ({
  database: {
    type: 'postgres',
    host: env.HOST ?? 'localhost',
    port: Number(env.POSTGRES_PORT) ?? 5432,
    username: env.DB_USERNAME ?? 'postgres',
    password: env.DB_ASSWORD ?? 'postgres',
    database: env.DB_NAME ?? 'course',
    synchronize: true,
    logging: false,
    entities: ['dist/**/entities/*.entity.js'],
  },

  privateKey: env.PRIVATE_KEY ?? 'banana',
  salt: Number(env.SALT) ?? 5,

  accessTokenSalt:
   env.ACCESS_TOKEN_SALT ?? "SALT228",
  refreshTokenSalt: env.REFRESH_TOKEN_SALT ?? "SALT1337",

  aws: {
    region:  env.AWS_BUCKET_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY,
      secretAccessKey: env.AWS_SECRET_KEY
    }
  },
  awsBucketName: env.AWS_BUCKET_NAME,
  awsImagesBucketName: env.AWS_IMAGES_BUCKET_NAME
});
