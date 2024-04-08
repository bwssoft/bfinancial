import { Collection } from "mongodb";
import clientPromise from "../config";
import { Note } from "../../definitions/Note";

async function connect() {
  const client = await clientPromise;
  const db = client.db("bws-financial");
  return db;
}

async function list(paymentId: string): Promise<Note[]> {
    const db = await connect();

    const notes: Collection<Note> = db.collection("note");
    const data = await notes.find().toArray();

    return data.filter(({ payment }) => paymentId === payment)
}

export type CreateNote = Partial<Note>;

async function create(data: CreateNote) {
    const db = await connect();
    return await db.collection('note').insertOne(data);
}

export const noteRepo = {
  list,
  create,
}