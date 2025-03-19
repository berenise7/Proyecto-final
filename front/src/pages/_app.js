import "@/styles/globals.css";
import { CartProvider } from "@/core/contexts/CartContext";
import { AuthProvider } from "@/core/contexts/AuthContext";
import { FavoritesProvider } from "@/core/contexts/FavoritesContext";
import { SearchProvider } from "@/core/contexts/SearchContext";

export default function App({ Component, pageProps }) {
  return <FavoritesProvider>
    <CartProvider>
      <AuthProvider>
        <SearchProvider>
          <Component {...pageProps} />
        </SearchProvider>
      </AuthProvider>
    </CartProvider>
  </FavoritesProvider>
}
