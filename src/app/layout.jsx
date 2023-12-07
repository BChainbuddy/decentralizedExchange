import { Inter } from "next/font/google";
import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });
// ${inter.className}

export const metadata = {
  title: "SEA SWAP",
  description: "Decentralized exchange",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`bg-slate-900 p-16`}>{children}</body>
    </html>
  );
}
