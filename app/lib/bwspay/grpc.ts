import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { promisify } from 'util';
import fs from 'fs'
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



const target = 'bpay-grpc-api.bwsoft.app';
// const target = 'localhost:3333';

export class BwPay extends TransactionService {
  constructor() {
    super(target, grpc.credentials.createSsl(fs.readFileSync("C:\\Users\\Natha\\OneDrive\\Documentos\\Development\\bws-financial\\app\\lib\\bwspay\\ca.crt")));
  }

  public async creactePixDetached(params: any) {
    const pixDetached = promisify(this.pixDetached).bind(this);
    return await pixDetached(params)
      .then((res: any) => ({ res, error: null }))
      .catch((error: any) => ({ error, res: null }));
  }
}