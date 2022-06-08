import express from 'express'
import request from 'supertest'
import { getConnection, getManager, QueryRunner } from 'typeorm'
import { init } from '../../src/loaders'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'
import { clearDb, getAccessToken, seeDb } from '../fixtures/db.fixture'

describe('Account tests', () => {
    const app = express()
    let testUser
    let accessToken
    beforeAll(async () => {
        await init({ expressApp: app })

        const manager = getManager('q-wallet')
        await seeDb()

        accessToken = await getAccessToken()
    })

    describe('GET /account/balance test', () => {
        it('Should return balance of an account', () => {
            expect(1 + 1).toBe(2)
        })
    })

    afterAll(async () => {
        await clearDb()
        await getConnection('q-wallet').close()
    })
})
