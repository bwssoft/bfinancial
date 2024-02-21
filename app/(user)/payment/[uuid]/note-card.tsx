import { Note } from "@/app/lib/definitions";

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <li className="border-b first:pt-0 last:border-0 last:pb-0 py-3">
      <div className="flex space-x-3 text-sm">
        <div>
          <div className="inline-flex items-center gap-2">
            {note.author.name} 
            <span className="font-medium text-gray-500">&middot;</span>
            <span className="font-medium text-gray-500">
              {note.createdAt.toLocaleDateString(`pt-BR`, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </span>
          </div>
          <div className="mt-1 text-gray-700">
            <p>{note.note}</p>
          </div>
        </div>
      </div>
    </li>
  );
}
