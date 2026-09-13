import React from 'react';

export const metadata = {
  title: 'Маркетинг • Сеть электроники',
  description: 'Приложение для команды маркетинга',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
