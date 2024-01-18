import { OmieDefaultParams } from "@/app/@shared/interfaces/services/@shared";
import { OmieService } from "@/app/@shared/services";
import { NextResponse } from "next/server";

export async function POST(data: Omit<OmieDefaultParams, "apenas_importado_api">) {
  const _service = new OmieService();

  const response = await _service.findAllClients(data);
  return NextResponse.json(response);
}