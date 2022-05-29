import { Response } from 'express'

export const mockReq = {
    user: {
        email: 'sample@gmail.com',
        id: '3',
    },
} as unknown

export const mockRes = {
    status: jest.fn(() => {
        return mockRes
    }),
    send: jest.fn(),
} as unknown as Response
