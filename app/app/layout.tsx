export const metadata = {
  title: "Demande Pharmacie Beauregard",
  description: "Interface de demande structurée pour infirmiers"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
