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

    const payments = await db.collection("payment").find();
    return payments;
  } catch (error: any) {
    console.log('[error/payment-repo] (list)', error.toString())
    throw new Error();
  }
}

export type CreatePayment = Partial<Payment>; 

async function create(data: CreatePayment) {
  try {
    const db = await connect();
    return await db.collection('payment').insertOne(data);
  } catch (error: any)  {
    console.log('[error/payment-repo] (create)', error.toString())
    throw new Error();
  }
}

export const paymentRepo = {
  list,
  create,
}