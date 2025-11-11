import ReactQueryProvider from '@/components/providers/ReactQueryProvider';
import './globals.css';

export const metadata = {
  title: 'Networking Manager',
  description: 'Gerenciamento de conexões e transferências de rede',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
