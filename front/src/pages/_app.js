import "@/styles/globals.css";
import { CartProvider } from "@/core/contexts/CartContext";
import { AuthProvider } from "@/core/contexts/AuthContext";
import { FavoritesProvider } from "@/core/contexts/FavoritesContext";

export default function App({ Component, pageProps }) {
  return <FavoritesProvider>
    <AuthProvider>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </AuthProvider>
  </FavoritesProvider>
}
