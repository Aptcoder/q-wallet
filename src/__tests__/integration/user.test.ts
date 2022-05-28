import express from 'express'
import request from 'supertest'
import { getConnection, getManager, QueryRunner } from 'typeorm'
import { init } from '../../src/loaders'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'

describe('User tests', () => {
    const app = express()
    let testUser
    beforeAll(async () => {
        await init({ expressApp: app })

        const manager = getManager('q-wallet')

        const hashedPassword = await bcrypt.hash('samueluser.', 10)

        await manager.query('DELETE FROM "account"')
        await manager.query('DELETE FROM "user"')
        await manager.query(
            'INSERT INTO "user" ( "firstName", "lastName", "password", email, "phoneNumber" ) VALUES ( $1, $2, $3, $4, $5 )',
            [
                'Sample',
                'User',
                hashedPassword,
                'sampleuser@email.com',
                '081542791',
            ]
        )
    })
    describe('POST /users test', () => {
        it('Should return 404', async () => {
            const res = await request(app).get('/api/hello').expect(404)
        })

        it('should create a user', async () => {
            const randomFirstName = faker.name.firstName()
            const randomLastName = faker.name.lastName()
            const randomEmail = faker.internet.email(
                randomFirstName,
                randomLastName
            )
            const res = await request(app).post('/api/users').send({
                firstName: randomFirstName,
                lastName: randomLastName,
                email: randomEmail,
                password: 'sampleuser.',
                phoneNumber: '0815342729',
            })

            expect(res.status).toBe(201)
            expect(res.body).toMatchObject({
                message: 'User created',
                status: 'success',
                data: expect.objectContaining({
                    user: expect.objectContaining({
                        firstName: randomFirstName,
                    }),
                }),
            })
        })

        it('should not create a user if email exists', async () => {
            const res = await request(app).post('/api/users').send({
                firstName: 'sample',
                lastName: 'user',
                email: 'sampleuser@email.com',
                password: 'sampleuser.',
                phoneNumber: '0815342729',
            })

            expect(res.status).toBe(409)
            expect(res.body).toMatchObject({
                status: 'failed',
            })
        })

        it('Should auth user', async () => {
            const res = await request(app).post('/api/users/auth').send({
                email: 'sampleuser@email.com',
                password: 'samueluser.',
            })

            expect(res.status).toBe(200)
            expect(res.body).toMatchObject({
                status: 'success',
                data: expect.objectContaining({
                    token: expect.any(String),
                }),
            })
        })

        it('Should not auth user if password is wrong', async () => {
            const res = await request(app).post('/api/users/auth').send({
                email: 'sampleuser@email.com',
                password: 'samueluse',
            })

            expect(res.status).toBe(401)
            expect(res.body).toMatchObject({
                status: 'failed',
            })
        })

        it('Should not auth user if email is wrong', async () => {
            const res = await request(app).post('/api/users/auth').send({
                email: 'samplewrongr@email.com',
                password: 'samueluse',
            })

            expect(res.status).toBe(404)
            expect(res.body).toMatchObject({
                status: 'failed',
            })
        })
    })

    afterAll(async () => {
        await getConnection('q-wallet').close()
    })
})
