"use client"
import { useNoteCreate } from "./useNoteCreate"
import {
  QuestionMarkCircleIcon,
} from "@heroicons/react/20/solid";

interface NoteParams {
  uuid:string, user:{id:string,name:string,imageUrl:string}
}

export function NoteCreateFrom(params: NoteParams){
  const {handleAction} = useNoteCreate(params.uuid, params.user)

  return (<form action={handleAction}>
    <div>
      <label htmlFor="comment" className="sr-only">
        About
      </label>
      <textarea
        id="comment"
        name="comment"
        rows={3}
        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
        placeholder="Add a note"
        defaultValue={""}
      />
    </div>
    <div className="mt-3 flex items-center justify-between">
      <a
        href="#"
        className="group inline-flex items-start space-x-2 text-sm text-gray-500 hover:text-gray-900"
      >
        <QuestionMarkCircleIcon
          className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
          aria-hidden="true"
        />
        <span>Some HTML is okay.</span>
      </a>
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        Comment
      </button>
    </div>
  </form>
)
}