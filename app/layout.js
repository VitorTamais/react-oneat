import Aside from "./components/Aside";
import RightPanel from "./components/RightPanel";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className="conteudo">
        <Aside />
        {children}
        <RightPanel />
      </body>
    </html>
  );
}
