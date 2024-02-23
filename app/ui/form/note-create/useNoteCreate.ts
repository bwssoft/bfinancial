import { createNote } from "@/app/lib/actions";
export function useNoteCreate(
  uuid: string,
  user: { id: string; name: string; }
) {
  async function handleAction(formData: FormData) {
    if (uuid) {
      formData.append("payment", uuid);
    }

    const binded = createNote.bind(null, {
      id: user.name,
      name: user.name,
    });
    await binded(formData);
  }

  return { handleAction };
}
