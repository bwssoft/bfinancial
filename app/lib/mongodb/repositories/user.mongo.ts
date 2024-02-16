import clientPromise from "../config";
import { IUser } from '../../definitions/User';
import { WithId } from "mongodb";

async function connect() {
  const client = await clientPromise;
  const db = client.db("bws-financial");
  return db;
}

export type CreateUser = Partial<IUser>;

export async function create(data: CreateUser) {
  try {
    const db = await connect();
    return await db.collection('user').insertOne(data);
  } catch (error: any) {
    console.log('[error/user-repo] (create)', error.toString())
    throw new Error();
  }
}

export async function findOne(params: Partial<WithId<IUser>>) {
  try {
    const db = await connect();
    return await db.collection<IUser>('user').findOne(params);
  } catch (error: any) {
    console.log('[error/user-repo] (create)', error.toString())
    throw new Error();
  }
}