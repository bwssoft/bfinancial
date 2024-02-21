import { Collection, Filter, FindCursor, WithId } from "mongodb";
import { Payment } from "../../definitions";
import clientPromise from "../config";

async function connect() {
  const client = await clientPromise;
  const db = client.db("bws-financial");
  return db;
}

async function list(params: Filter<Payment> = {}) {
  try {
    const db = await connect();

    const payments: Collection<Payment> = db.collection("payment");
    const data = await payments.find(params).toArray();
    return data as Payment[]
  } catch (error: any) {
    console.log('[error/payment-repo] (list)', error.toString())
    throw new Error();
  }
}

export async function findOne(params: Partial<WithId<Payment>>) {
  try {
    const db = await connect();
    return await db.collection<Payment>('payment').findOne(params);
  } catch (error: any) {
    console.log('[error/payment-repo] (findOne)', error.toString())
    throw new Error();
  }
}

export type CreatePayment = Partial<Payment>;

export async function create(data: CreatePayment) {
  try {
    const db = await connect();
    return await db.collection('payment').insertOne(data);
  } catch (error: any) {
    console.log('[error/payment-repo] (create)', error.toString())
    throw new Error();
  }
}

export const paymentRepo = {
  list,
  create,
  findOne,
}