import dotenv from 'dotenv'

dotenv.config()

export default {
    port: process.env.PORT,
    dbUri: process.env.DATABASE_URL,
    dbName: 'q-wallet',
    jwtSecret: process.env.JWT_SECRET,
    flw_secret: process.env.FLW_SECRET,
    pstk_secret: process.env.PAYSTACK_SECRET,
    flw_encryption_key: process.env.FLW_ENCRYPTION_KEY,
    dbSync: false,
}
