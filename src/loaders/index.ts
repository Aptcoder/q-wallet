import initDb from './db'
import { Application } from 'express'

async function init({ expressApp } : { expressApp: Application}) {
    await initDb()
    const { loadApp } = await import('./app')
    await loadApp({ app: expressApp })
}

export { init }