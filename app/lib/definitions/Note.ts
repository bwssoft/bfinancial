export interface Note {
  uuid: string
  author: { name: string, id: string }
  createdAt: Date,
  note: string
  payment: string
}