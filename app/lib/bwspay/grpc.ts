import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { promisify } from 'util';

const PROTO_PATH = path.join(process.cwd(), './app/lib/bwspay/payment.proto');

// suggested options for similarity to loading grpc.load behavior
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  defaults: true,
  oneofs: true,
});

const payServer = (
  grpc.loadPackageDefinition(packageDefinition) as unknown as any
).payment;

const { TransactionService } = payServer;



const target = 'payment.bwsoft.app:3000';
// const target = 'localhost:3333';

export class BwPay extends TransactionService {
  constructor() {
    super(target, grpc.credentials.createInsecure());
  }

  public async creactePixDetached(params: any) {
    const pixDetached = promisify(this.pixDetached).bind(this);
    return await pixDetached(params)
      .then((res: any) => ({ res, error: null }))
      .catch((error: any) => ({ error, res: null }));
  }
}