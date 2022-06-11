require('ts-node').register({ transpileOnly: true })

import { getConnection } from 'typeorm'
import initDb from '../src/loaders/db'
import { clearDb, seeDb } from './fixtures/db.fixture'

const setup = async () => {
    await initDb()

    await clearDb()

    await seeDb()

    getConnection('q-wallet').close()
}

export default setup
