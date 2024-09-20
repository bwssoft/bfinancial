"use client";
import { OmieClientModel } from "@/app/lib/definitions/OmieClient";
import { Alert } from "@/app/ui/alert";
import { Button } from "@/app/ui/button";
import { FormGroup } from "@/app/ui/form-group";
import { Input } from "@/app/ui/input";
import { Label } from "@/app/ui/label";
import { PhoneInput } from "../../phone-input";

export interface DueCreateFormProps {
  client: OmieClientModel;
  action: (formData: FormData) => void;
}

export function DueCreateForm({ client, action }: DueCreateFormProps) {
  return (
    <form action={action} className="flex flex-col gap-4">
      <Alert
        title="Dados de contato OMIE"
        subtitle="Enviaremos o QR code do pix para os contatos abaixo. Caso estejam desatualizados, edite-os antes de enviar."
      />

      <FormGroup>
        <Label>Email</Label>
        <Input name="contact_email" defaultValue={client?.email} />
      </FormGroup>
      <FormGroup>
        <Label>Telefone</Label>

        <PhoneInput
          name="contact_phone"
          value={
            client?.telefone1_ddd
              ? `${client?.telefone1_ddd}${client?.telefone1_numero}`
              : undefined
          }
        />
      </FormGroup>

      <Button type="submit" size="lg" className="w-full">
        Efetuar cobrança
      </Button>
    </form>
  );
}
