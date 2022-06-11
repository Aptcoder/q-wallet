import { getManager } from 'typeorm'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from 'config'
import { randomUUID } from 'crypto'

export async function seeDb() {
    const manager = getManager('q-wallet')

    const hashedPassword = await bcrypt.hash('samueluser.', 10)

    await manager.query(
        'INSERT INTO "user" ( "firstName", "lastName", "password", email, "phoneNumber" ) VALUES ( $1, $2, $3, $4, $5 ), ($6, $7, $8, $9, $10)',
        [
            'Sample',
            'User',
            hashedPassword,
            'sampleuser@email.com',
            '081542791',
            'Sample',
            'User',
            hashedPassword,
            'sampleuser2@email.com',
            '081542791',
        ]
    )

    const result = await manager.query(
        'SELECT *  FROM "user" WHERE "email" = $1 LIMIT 1',
        ['sampleuser@email.com']
    )
    const user = result[0]

    const result2 = await manager.query(
        'SELECT *  FROM "user" WHERE "email" = $1 LIMIT 1',
        ['sampleuser2@email.com']
    )
    const user2 = result2[0]

    await manager.query(
        'INSERT INTO "account" ( "balance", "userId" ) VALUES ($1, $2)',
        [500, user.id]
    )

    await manager.query(
        'INSERT INTO "account" ( "balance", "userId" ) VALUES ($1, $2)',
        [500, user2.id]
    )

    await manager.query(
        'INSERT INTO "beneficiary" ("userId", "bank_account", "account_name", "bank_code", "id" ) VALUES ( $1, $2, $3, $4, $5)',
        [user.id, '0893456719', 'Sample account', '004', randomUUID()]
    )
}

export async function clearDb() {
    const manager = getManager('q-wallet')
    await manager.query('DELETE FROM "beneficiary"')
    await manager.query('DELETE FROM "transaction"')
    await manager.query('DELETE FROM "account"')
    await manager.query('DELETE FROM "user"')
}

function generateToken(user: {
    email: string
    id: number
    firstName: string
    lastName: string
}): Promise<{ accessToken: string }> {
    const payload = {
        email: user.email,
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
    }
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            config.get<string>('jwtSecret'),
            {
                // expiresIn: '600000'
                expiresIn: '18000000',
            },
            (err: any, token) => {
                if (err) {
                    return reject(err)
                }
                return resolve({ accessToken: token as string })
            }
        )
    })
}

export async function getAccessToken() {
    const manager = getManager('q-wallet')
    const result = await manager.query(
        'SELECT *  FROM "user" WHERE "email" = $1 LIMIT 1',
        ['sampleuser@email.com']
    )
    const user = result[0]
    const { accessToken } = await generateToken(user)
    return accessToken
}

export async function getExtraUser() {
    const manager = getManager('q-wallet')
    const result = await manager.query(
        'SELECT *  FROM "user" WHERE "email" = $1 LIMIT 1',
        ['sampleuser2@email.com']
    )
    return result[0]
}
