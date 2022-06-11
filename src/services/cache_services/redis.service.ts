import { ICacheService } from '../../utils/interfaces/services.interfaces'

export default class RedisService implements ICacheService {
    constructor(public redis_client: any) {
        this.redis_client = redis_client
    }

    public setEx(key: string, value: string, exp: string): string {
        return this.redis_client.setEx(key, value, exp)
    }

    public get(key: string): string {
        return this.redis_client.get(key)
    }
}
