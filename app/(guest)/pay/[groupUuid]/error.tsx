"use client";

interface Props {
  error: {
    message: string;
  };
}

export default function PayErrorPage({ error }: Props) {
  function getTitle() {
    if (error.message === "pay-200") {
      return "Link de compartilhamento expirado";
    }

    return "Não foi possível encontrar essa cobrança";
  }

  function getDescription() {
    if (error.message === "pay-200") {
      return "Esse pagamento já foi efetuado e concluído!";
    }

    return "Tente novamente mais tarde ou consulte o responsável";
  }

  return (
    <main className="w-screen h-screen flex flex-col items-center justify-center">
      <h1 className="font-bold text-lg">{getTitle()}</h1>
      <p>{getDescription()}</p>
    </main>
  );
}
