import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata = {
  title: "WpDev | Keyboard Architecture",
  description:
    "A premium scrollytelling landing page for the fictional WpDev keyboard, rendered with a scroll-linked canvas image sequence."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
