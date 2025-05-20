import { createClient } from 'redis';

const redisclient = createClient();

redisclient.on("error", (err) => console.log("redis client error", err));

(async () => {
    await redisclient.connect();
})();

export default redisclient;