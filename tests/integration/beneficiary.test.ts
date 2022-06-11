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

describe('Beneficiary tests', () => {
    const app = express()
    let extraUser: {
        id: string
    }
    let accessToken: string
    beforeAll(async () => {
        await init({ expressApp: app })

        accessToken = await getAccessToken()
        extraUser = await getExtraUser()
    })

    describe('POST /beneficiaries', () => {
        it('Should create a beneficiary', async () => {
            const res = await request(app)
                .post('/api/beneficiaries')
                .send({
                    bank_account: '0826826910',
                    bank_code: '044',
                })
                .set('x-auth', accessToken)

            expect(res.status).toBe(201)
            expect(res.body).toMatchObject({
                message: 'Beneficiary created',
                status: 'success',
                data: {
                    beneficiary: expect.objectContaining({
                        bank_account: '0826826910',
                    }),
                },
            })
        })

        it('Should not create beneficiary if already exists', async () => {
            const res = await request(app)
                .post('/api/beneficiaries')
                .send({
                    bank_account: '0893456719',
                    bank_code: '044',
                })
                .set('x-auth', accessToken)

            expect(res.status).toBe(409)
        })
    })

    describe('GET /beneficiaries', () => {
        it('Should fetch all of a users beneficiaries', async () => {
            const res = await request(app)
                .get('/api/beneficiaries')
                .set('x-auth', accessToken)

            expect(res.status).toBe(200)
            expect(res.body).toMatchObject({
                data: {
                    beneficiaries: expect.any(Array),
                },
            })
        })
    })
    afterAll(async () => {
        await getConnection('q-wallet').close()
    })
})
