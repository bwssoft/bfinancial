import clientPromise from "../config";
import { IUser } from '../../definitions/User';
import { WithId } from "mongodb";

async function connect() {
  const client = await clientPromise;
  const db = client.db("bws-financial");
  return db;
}

export type CreateUser = Partial<IUser>;

async function create(data: CreateUser) {
    const db = await connect();
    return await db.collection('user').insertOne(data);
}

async function findOne(params: Partial<WithId<IUser>>) {
    const db = await connect();
    return await db.collection<IUser>('user').findOne(params);
}

export const userRepo = {
  create,
  findOne,
}