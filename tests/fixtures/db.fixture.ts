import { getManager } from 'typeorm'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from 'config'

export async function seeDb() {
    const manager = getManager('q-wallet')

    const hashedPassword = await bcrypt.hash('samueluser.', 10)

    await manager.query(
        'INSERT INTO "user" ( "firstName", "lastName", "password", email, "phoneNumber" ) VALUES ( $1, $2, $3, $4, $5 )',
        ['Sample', 'User', hashedPassword, 'sampleuser@email.com', '081542791']
    )

    const result = await manager.query('SELECT *  FROM "user" LIMIT 1')
    const user = result[0]

    const account = await manager.query(
        'SELECT * FROM "account" WHERE "userId" = $1',
        [user.id]
    )

    await manager.query(
        'INSERT INTO "account" ( "balance", "userId" ) VALUES ($1, $2)',
        [500, user.id]
    )
}

export async function clearDb() {
    const manager = getManager('q-wallet')

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
    const result = await manager.query('SELECT *  FROM "user" LIMIT 1')
    const user = result[0]
    const { accessToken } = await generateToken(user)
    return accessToken
}
