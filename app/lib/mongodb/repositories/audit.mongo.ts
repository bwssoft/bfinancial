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
    const db = await connect();

    const audit: Collection<IAudit> = db.collection("audit");
    const data = await audit.find(params).toArray();
    return data as IAudit[]
}

async function create(data: CreateAudit) {
    const db = await connect();
    return await db.collection('audit').insertOne(data);
}

async function findOne(params: Partial<WithId<IAudit>>) {
    const db = await connect();
    return await db.collection<IAudit>('audit').findOne(params);
}

export const auditRepo = {
  list,
  create,
  findOne,
}