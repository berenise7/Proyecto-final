import "@/styles/globals.css";
import { CartProvider } from "@/core/contexts/CartContext";
import { AuthProvider } from "@/core/contexts/AuthContext";
import { FavoritesProvider } from "@/core/contexts/FavoritesContext";
import { SearchProvider } from "@/core/contexts/SearchContext";

export default function App({ Component, pageProps }) {
  return <AuthProvider>
    <FavoritesProvider>
      <CartProvider>
        <SearchProvider>
          <Component {...pageProps} />
        </SearchProvider>
      </CartProvider>
    </FavoritesProvider>
  </AuthProvider>
}
