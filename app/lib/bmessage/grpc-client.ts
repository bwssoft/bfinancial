import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { promisify } from 'util';
import * as fs from 'fs'
//Falta tipar
//import { ProtoGrpcType } from './types/bmessage';

const PROTO_PATH = path.join(process.cwd(), './app/lib/bmessage/bmessage.proto');
const CRT_PATH = path.join(process.cwd(), './app/lib/bmessage/ca.crt')

// suggested options for similarity to loading grpc.load behavior
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
});

const mailServer = (
  grpc.loadPackageDefinition(packageDefinition) as unknown as any
).mail;

const { MailService } = mailServer;



const target = 'bmessage-grpc-api.bwsoft.app';
// const target = 'localhost:5000';

export class BMessage extends MailService {
  constructor() {
    super(target, grpc.credentials.createSsl(fs.readFileSync(CRT_PATH)));
    // super(target, grpc.credentials.createInsecure());
  }

  public async createTextMessage(params: any) {
    const textMessage = promisify(this.textMessage).bind(this);
    return await textMessage(params)
      .then((res: any) => res)
      .catch((error: any) => error);
  }

  public async createTemplateMessage(params: any) {
    const templateMessage = promisify(this.templateMessage).bind(this);
    return await templateMessage(params)
      .then((res: any) => res)
      .catch((error: any) => error);
  }

  public async uploadBuffer(params: any) {
    const uploadMediaWtp = promisify(this.uploadMediaWtp).bind(this);
    return await uploadMediaWtp(params)
      .then((res: any) => res)
      .catch((error: any) => error);
  }
}