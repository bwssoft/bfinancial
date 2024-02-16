"use server"

import { signIn } from "@/auth"
import { redirect } from "next/navigation"

export async function userAuthenticate(formData: FormData) {
  const { username, password } = Object.fromEntries(formData.entries())
  await signIn("credentials", {
    username,
    password,
  })
}