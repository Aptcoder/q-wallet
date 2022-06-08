import express from 'express'
import request from 'supertest'
import { getConnection, getManager, QueryRunner } from 'typeorm'
import { init } from '../../src/loaders'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'
import {
    clearDb,
    getAccessToken,
    getExtraUser,
    seeDb,
} from '../fixtures/db.fixture'

describe('Account tests', () => {
    const app = express()
    let extraUser: {
        id: string
    }
    let accessToken: string
    beforeAll(async () => {
        await init({ expressApp: app })

        const manager = getManager('q-wallet')
        await seeDb()

        accessToken = await getAccessToken()
        extraUser = await getExtraUser()
    })

    describe('GET /account/balance test', () => {
        it('Should return balance of an account', async () => {
            const res = await request(app)
                .get('/api/account/balance')
                .set('x-auth', accessToken)

            expect(res.status).toBe(200)
            expect(res.body).toMatchObject({
                message: 'Balance',
                status: 'success',
                data: {
                    balance: expect.any(Number),
                },
            })
        })

        it('Should return error 403 if token invalid', async () => {
            const res = await request(app)
                .get('/api/account/balance')
                .set('x-auth', 'Invalid token')

            expect(res.status).toBe(403)
        })

        it('Should tranfer from account to another', async () => {
            const res = await request(app)
                .post('/api/account/transfer')
                .set('x-auth', accessToken)
                .send({
                    userId: String(extraUser.id),
                    amount: 50,
                })
            expect(res.status).toBe(200)
            expect(res.body).toMatchObject({
                message: 'Transfer successful',
                data: {
                    balance: expect.any(Number),
                },
            })
        })

        it('Should return 409 if user has insufficient balance', async () => {
            const res = await request(app)
                .post('/api/account/transfer')
                .set('x-auth', accessToken)
                .send({
                    userId: String(extraUser.id),
                    amount: 5000,
                })

            expect(res.status).toBe(409)
            expect(res.body).toMatchObject({
                message: 'Insufficient balance',
            })
        })

        it('Should return 404 if account to be credited does not exist', async () => {
            const res = await request(app)
                .post('/api/account/transfer')
                .set('x-auth', accessToken)
                .send({
                    userId: '201',
                    amount: 5000,
                })
            expect(res.status).toBe(404)
        })

        it('Should return 403 if transfer if not auth ', async () => {
            const res = await request(app).post('/api/account/transfer').send({
                userId: extraUser.id,
                amount: 5000,
            })

            expect(res.status).toBe(403)
        })
    })

    afterAll(async () => {
        await clearDb()
        await getConnection('q-wallet').close()
    })
})
