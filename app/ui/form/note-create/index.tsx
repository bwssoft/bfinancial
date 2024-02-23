"use client";
import { Button } from "../../button";
import { useNoteCreate } from "./useNoteCreate";
import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";

interface NoteParams {
  uuid: string;
  user: { id: string; name: string };
}

export function NoteCreateFrom(params: NoteParams) {
  const { handleAction } = useNoteCreate(params.uuid, params.user);

  return (
    <form action={handleAction}>
      <div>
        <label htmlFor="comment" className="sr-only">
          About
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={3}
          className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          placeholder="Adicionar uma nova anotação"
        />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="group inline-flex items-start space-x-2 text-sm text-gray-500 ">
          <QuestionMarkCircleIcon
            className="h-5 w-5 flex-shrink-0 text-gray-400"
            aria-hidden="true"
          />
          <span>Adicione anotações pertinentes sobre esse pagamento.</span>
        </div>
        <Button type="submit">Enviar</Button>
      </div>
    </form>
  );
}
