import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import { Heading } from "./components/heading";

interface QRCodeEmailProps {
  metadata: {
    clientName: string;
    total: number;
    createdAt: string;
  };
  installments: {
    code: string;
    url: string;
    data_vencimento: string;
    valor: number;
    numero_parcela: number;
  }[];
}

export default function QRCodeEmail(props: QRCodeEmailProps) {
  const { metadata, installments } = props;

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-white text-sm my-auto mx-auto font-sans py-10">
          <Container>
            <Heading>Nova cobrança BWS</Heading>
            <Text className="text-lg text-gray-500 leading-7 [&:not(:first-child)]:mt-6">
              Olá, {metadata.clientName}!
            </Text>

            <Section>
              <Heading as="h2">Detalhes da transação</Heading>

              <Section>
                <Row>
                  <Column>
                    <p className="m-0 text-gray-400">Data</p>
                    <span>{metadata.createdAt}</span>
                  </Column>
                  <Column>
                    <p className="m-0 text-gray-400">Valor</p>
                    <span>R${metadata.total}</span>
                  </Column>
                </Row>
              </Section>
            </Section>

            <Section>
              <Heading as="h2">Pix</Heading>

              {installments.map((installment, index) => (
                <Section key={index}>
                  <Heading as="h3">
                    Parcela {installment.numero_parcela} de {installments.length}
                  </Heading>

                  <Section
                    align="center"
                    className="border border-solid border-gray-200 bg-gray-100 rounded-md mt-2 p-4"
                  >
                    <table className="w-full table-fixed">
                      <tbody>
                        <tr>
                          <td>
                            <Column className="w-full border bg-white mr-1 justify-center border-solid rounded-md h-24 border-gray-300">
                              <Text className="font-semibold text-center m-0">
                                Data de vencimento
                              </Text>
                              <Text className="text-center m-0">{installment.data_vencimento}</Text>
                            </Column>
                          </td>
                          <td>
                            <Column className="w-full border bg-white ml-1 justify-center border-solid rounded-md h-24 border-gray-300">
                              <Text className="font-semibold text-center m-0">Valor</Text>
                              <Text className="text-center m-0">R${installment.valor}</Text>
                            </Column>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <Text className="text-center">
                      Você pode utilizar a câmera do seu celular para ler o QR Code pix
                    </Text>

                    <Section className="h-64 w-64 rounded-md border border-solid border-gray-200 bg-gray-50">
                      <Img src={installment.url} />
                    </Section>

                    <Text className="text-center">
                      Ou copiar o código e pagar no aplicativo do seu banco
                    </Text>

                    <Section className="bg-white w-full rounded-lg p-4 border border-solid border-gray-200">
                      <Text className="m-0 text-xs">{installment.code}</Text>
                    </Section>
                  </Section>
                </Section>
              ))}
            </Section>

            <Section className="border border-solid mt-10 text-center border-transparent border-t-gray-300">
              <Text className="text-gray-500">
                Este e-mail não responde mensagens. E-mail enviado de forma automática.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
