/* eslint-disable import/prefer-default-export */
import config from 'config'
import { Response } from 'express'
import FlutterwaveStrategy from '../services/payment_strategies/flutterwave.strategy'
import PaystackStrategy from '../services/payment_strategies/paystack.strategy'
import TestStrategy from '../services/payment_strategies/test.strategy'
import { IPaymentStrategy } from './interfaces/services.interfaces'

// type errorType = ServiceError | Error

export const processError = (res: Response, error: any) => {
    // console.log('err', error)
    if (error.status) {
        return res.status(error.status).send({
            status: 'failed',
            message: error.message,
            data: {},
        })
    }
    return res.status(500).send({
        status: 'failed',
        message: error.message,
        data: {},
    })
}

export const getPaymentStrategy = (strategytype: string): IPaymentStrategy => {
    if (process.env.NODE_ENV == 'test') {
        const test_strat = new TestStrategy()
        return test_strat
    }

    if (strategytype === 'FLUTTERWAVE') {
        const flw_strat = new FlutterwaveStrategy(config.get('flw_secret'))
        return flw_strat
    }
    if (strategytype === 'PAYSTACK') {
        const pstk_strat = new PaystackStrategy(config.get('pstk_secret'))
        return pstk_strat
    }

    const pstk_strat = new PaystackStrategy(config.get('pstk_secret'))
    return pstk_strat
}
