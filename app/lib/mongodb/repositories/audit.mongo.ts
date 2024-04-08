import clientPromise from "../config";
import { IAudit } from '../../definitions/Audity';
import { Collection, WithId, Filter } from "mongodb";

async function connect() {
  const client = await clientPromise;
  const db = client.db("bws-financial");
  return db;
}

export type CreateAudit = Partial<IAudit>;

async function list(params: Filter<IAudit> = {}) {
  try {
    const db = await connect();

    const audit: Collection<IAudit> = db.collection("audit");
    const data = await audit.find(params).toArray();
    return data as IAudit[]
  } catch (error: any) {
    console.log('[error/payment-repo] (list)', error.toString())
    throw new Error();
  }
}

async function create(data: CreateAudit) {
  try {
    const db = await connect();
    return await db.collection('audit').insertOne(data);
  } catch (error: any) {
    console.log('[error/user-repo] (create)', error.toString())
    throw new Error();
  }
}

async function findOne(params: Partial<WithId<IAudit>>) {
  try {
    const db = await connect();
    return await db.collection<IAudit>('audit').findOne(params);
  } catch (error: any) {
    console.log('[error/user-repo] (create)', error.toString())
    throw new Error();
  }
}

export const auditRepo = {
  list,
  create,
  findOne,
}