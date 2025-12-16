// src/middleware.ts
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // 1. Atualiza a sessão do Supabase (Auth)
  return await updateSession(request);

  // NOTA: Se você tiver lógica de i18n, ela deve ser combinada aqui.
  // O retorno do updateSession já é um NextResponse que o i18n poderia usar.
}

export const config = {
  matcher: [
    // Exclui arquivos estáticos e de sistema do next
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};