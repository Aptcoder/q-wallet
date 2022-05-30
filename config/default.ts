import dotenv from 'dotenv'

dotenv.config()

export default {
    port: 3000,
    dbUri: 'postgresql://postgres:wonderful.@localhost:5432/q-wallet',
    dbHost: 'localhost',
    dbName: 'q-wallet',
    dbPort: 5342,
    dbPassword: process.env.DB_PASSWORD,
    dbUsername: 'postgres',
    jwtSecret: process.env.JWT_SECRET,
    flw_secret: process.env.FLW_SECRET,
    pstk_secret: process.env.PAYSTACK_SECRET,
    flw_encryption_key: process.env.FLW_ENCRYPTION_KEY,
    dbSync: false,
}
