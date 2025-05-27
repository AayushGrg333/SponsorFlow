import { createClient } from 'redis';
import { config } from './config';

const redisclient = createClient({
    url : config.REDIS_CLIENT
});

redisclient.on("error", (err) => console.log("redis client error", err));

(async () => {
    await redisclient.connect();
})();

export default redisclient;