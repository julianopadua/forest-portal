// src/app/join/page.tsx
import { redirect } from "next/navigation";

export default function Join() {
  redirect("/?auth=signup");
}
