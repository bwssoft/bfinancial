import { Collection } from "mongodb";
import clientPromise from "../config";
import { Note } from "../../definitions/Note";

async function connect() {
  const client = await clientPromise;
  const db = client.db("bws-financial");
  return db;
}

async function list(paymentId: string): Promise<Note[]> {
  try {
    const db = await connect();

    const notes: Collection<Note> = db.collection("note");
    const data = await notes.find().toArray();

    return data.filter(({ payment }) => paymentId === payment)

  } catch (error: any) {
    console.log('[error/note-repo] (list)', error.toString())
    throw new Error();
  }
}

export type CreateNote = Partial<Note>;

async function create(data: CreateNote) {
  try {
    const db = await connect();
    return await db.collection('note').insertOne(data);
  } catch (error: any) {
    console.log('[error/note-repo] (create)', error.toString())
    throw new Error();
  }
}

export const noteRepo = {
  list,
  create,
}