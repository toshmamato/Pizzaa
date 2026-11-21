import { StoreProvider } from "../context/StoreContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import AuthModal from "../components/AuthModal";
import "./globals.css";

export const metadata = {
  title: "TurboPizza",
  description: "Premium pizza delivery",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className="min-h-screen bg-[#0c0c0c] text-white">
        <StoreProvider>
          <Navbar />
          <AuthModal />
          <CartDrawer />
          {children}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
