import "@/styles/globals.css";
import { CartProvider } from "@/core/contexts/CartContext";
import { AuthProvider } from "@/core/contexts/AuthContext";

export default function App({ Component, pageProps }) {
  return <AuthProvider>
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>;
  </AuthProvider>
}
