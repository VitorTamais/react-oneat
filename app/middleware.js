import { NextResponse } from "next/server";

export function middleware(req) {
  // Obtém o cookie 'id_restaurante' diretamente do objeto `cookies` da solicitação
  const idRestaurante = req.cookies.get('id_restaurante');

  // Verifica se o cookie não existe e redireciona para a página de login
  if (!idRestaurante) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Se o cookie existir, permite o acesso
  return NextResponse.next();
}

// Configura o middleware para ser aplicado apenas na rota do dashboard
export const config = {
  matcher: '/dashboard/:path*', // Aplica o middleware em `/dashboard` e suas sub-rotas
};
