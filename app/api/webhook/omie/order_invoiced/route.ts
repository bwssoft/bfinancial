export async function POST(request: Request) {
  const data = await request.json()
  console.log("|| ======== data from omie ======== ||")
  console.log(data)
  console.log("|| ======== data from omie ======== ||")
  return Response.json({ ok: true })
}