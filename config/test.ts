import dotenv from 'dotenv'

dotenv.config()

export default {
    port: 3000,
    dbUri: 'postgresql://postgres:wonderful.@localhost:5432/q-wallet-test',
    dbHost: 'localhost',
    dbName: 'q-wallet-test',
    dbPort: 5342,
    dbPassword: 'wonderful.',
    dbUsername: 'postgres',
    dbSync: true,
    jwtSecret: 'eyvryreyiveyvewiwyeyvwwyve',
    flw_secret: process.env.FLW_SECRET,
    flw_encryption_key: process.env.FLW_ENCRYPTION_KEY,
}
