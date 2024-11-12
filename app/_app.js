// pages/_app.js

import { AuthProvider } from '../context/authContext'; // Importe seu AuthProvider
import '../styles/globals.css'; // Importe seus estilos globais, se necessário

// Função que envolve o contexto de autenticação em toda a aplicação
function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider> {/* Envolvendo o contexto em torno de todos os componentes */}
      <Component {...pageProps} /> {/* Rendeiriza a página atual */}
    </AuthProvider>
  );
}

export default MyApp;
