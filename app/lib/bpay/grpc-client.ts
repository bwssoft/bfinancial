import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { promisify } from 'util';
import fs from 'fs'
import { ProtoGrpcType } from './types/payment';
import { BPayTransaction } from '../definitions/BPayTransaction';

const PROTO_PATH = path.join(process.cwd(), './app/lib/bpay/payment.proto');
const CRT_PATH = path.join(process.cwd(), './app/lib/bpay/ca.crt')

// suggested options for similarity to loading grpc.load behavior
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  defaults: true,
  oneofs: true,
});

const payServer = (
  grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType
).payment;

const { TransactionService } = payServer;



const target = 'bpay-grpc-api.bwsoft.app';
// const target = 'localhost:3333';

export class BwPay extends TransactionService {
  constructor() {
    super(target, grpc.credentials.createSsl(fs.readFileSync(CRT_PATH)));
    // super(target, grpc.credentials.createInsecure());
  }

  public async createPixWithoutRecipient(params: any) {
    const pixWithoutRecipient = promisify(this.pixWithoutRecipient).bind(this);
    return await pixWithoutRecipient(params)
      .then((res) => res)
      .catch((error) => error);
  }

  public async getManyTransactionById(params: { id: string[] }): Promise<{
    status: boolean,
    transactions?: BPayTransaction[],
    error?: any
  }> {
    const getManyById = promisify(this.getManyById).bind(this);
    return await getManyById(params)
      .then((res) => res)
      .catch((error) => error);
  }
}