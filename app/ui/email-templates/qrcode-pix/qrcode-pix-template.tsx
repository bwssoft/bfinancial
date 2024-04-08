import { Body, Column, Container, Head, Html, Row, Section, Text } from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import { Heading } from "./components/heading";

export default function QRCodeEmail() {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-white text-sm my-auto mx-auto font-sans py-10">
          <Container>
            <Heading>Nova cobrança BWS</Heading>
            <Text className="text-lg text-gray-500 leading-7 [&:not(:first-child)]:mt-6">
              Olá, meu clientezinho!
            </Text>

            <Section>
              <Heading as="h2">Detalhes da transação</Heading>

              <Section>
                <Row>
                  <Column>
                    <p className="m-0 text-gray-400">Data</p>
                    <span>21/02/2024</span>
                  </Column>
                  <Column>
                    <p className="m-0 text-gray-400">Valor</p>
                    <span>R$19.00</span>
                  </Column>
                </Row>
              </Section>
            </Section>

            <Section>
              <Heading as="h2">Pix</Heading>
              <Section
                align="center"
                className="border border-solid border-gray-300 bg-gray-100 rounded-md p-4"
              >
                <Text className="text-center">
                  Você pode utilizar a câmera do seu celular para ler o QR Code pix
                </Text>

                <Section className="h-64 w-64 rounded-md border border-solid border-gray-300 bg-gray-50" />

                <Text className="text-center">
                  Ou copiar o código e pagar no aplicativo do seu banco
                </Text>

                <Section className="bg-white w-full rounded-lg p-4 border border-solid border-gray-200">
                  <Text className="m-0 text-xs">
                    00020101021226830014br.gov.bcb.pix2561api.pagseguro.com/pix/v2/8ABED4B4-5090-41D6-B86D-CB87FA9824A727600016BR.COM.PAGSEGURO01368ABED4B4-5090-41D6-B86D-CB87FA9824A7520489995303986540512.305802BR5922PAGSEGURO
                    TECNOLOGIA L6009Sao Paulo62070503***630446AE
                  </Text>
                </Section>
              </Section>
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
