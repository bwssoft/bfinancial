import { Collection } from "mongodb";
import { Payment } from "../../definitions";
import clientPromise from "../config";

async function connect() {
  const client = await clientPromise;
  const db = client.db("bws-financial");
  return db;
}

async function list() {
  try {
    const db = await connect();

    const payments: Collection<Payment> = db.collection("payment");
    const data = await payments.find().toArray();

    return data
  } catch (error: any) {
    console.log('[error/payment-repo] (list)', error.toString())
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
}