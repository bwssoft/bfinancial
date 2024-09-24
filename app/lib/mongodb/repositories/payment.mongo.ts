import { Collection, Filter, WithId } from "mongodb";
import { Payment } from "../../definitions/Payment";
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
    const data = await payments.find(params).sort({
      "created_at": -1,
    }).toArray();
    return data as Payment[]
  } catch (error: any) {
    console.log('[error/payment-repo] (list)', error.toString())
    throw new Error();
  }
}

export async function findOne(params: Partial<WithId<Payment>> | any) {
  const db = await connect();
  return await db.collection<Payment>('payment').findOne(params);
}

export type CreatePayment = Partial<Payment>;

export async function create(data: CreatePayment) {
  const db = await connect();
  return await db.collection('payment').insertOne(data);
}

export async function createMany(data: CreatePayment[]) {
  const db = await connect();
  return await db.collection('payment').insertMany(data);
}

export const paymentRepo = {
  list,
  create,
  findOne,
  createMany
}