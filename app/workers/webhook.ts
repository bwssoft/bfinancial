import { Worker, Queue } from 'bullmq';
import Redis from 'ioredis';
import { afterInvoice } from '../lib/actions';


const connection = new Redis(
  "rediss://default:a77446cdf13d44b1b70bbfa242f7847b@us1-legal-ringtail-41715.upstash.io:41715",
  { maxRetriesPerRequest: null }
);

export const sampleQueue = new Queue('sampleQueue', {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  },
});

const worker = new Worker(
  'sampleQueue', // this is the queue name, the first string parameter we provided for Queue()
  async (job) => {
    const data = job?.data;
    await afterInvoice(data)
    console.log('Task executed successfully');
  },
  {
    connection,
    concurrency: 5,
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 5000 },
  }
);

export default worker;