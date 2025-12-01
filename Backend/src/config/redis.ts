import { createClient } from 'redis';
import {config} from './config'
const client = createClient({
     url: config.REDIS_URL
});

client.on('error', err => console.log('Redis Client Error', err));

async function connectRedis() {
   await client.connect();
}

export default { client, connectRedis };
