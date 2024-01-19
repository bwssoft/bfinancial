import { OmieDefaultParams } from "@/app/@shared/interfaces/services/@shared";
import { OmieService } from "@/app/@shared/services";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function POST(req: NextApiRequest) {
  const _service = new OmieService();

  const response = await _service.findAllClients(req.body);
  return NextResponse.json(response);
}