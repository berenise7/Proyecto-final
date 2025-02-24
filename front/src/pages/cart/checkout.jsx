import React, { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as faHeartSolid,
  faTrashCan,
  faChevronLeft,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import styles from "./checkout.module.css";
import { useCart } from "@/core/contexts/CartContext";
import { useFavorites } from "@/core/contexts/FavoritesContext";
import HeaderAndSearch from "@/components/Header/HeaderAndSearch";

export default function checkout() {
  const {
    cart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    calculateTotal,
    formatPrice,
  } = useCart();
  const { favorites, setFavorites } = useFavorites();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    zip: "",
    country: "",
    paymentMethod: "credit_card",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado", formData);
    alert("Compra realizada con éxito!");
  };

  const toggleFavorite = (product) => {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.some((fav) => fav.id === product.id);
      if (isFavorite) {
        return prevFavorites.filter((fav) => fav.id !== product.id); // Quitar de favoritos
      } else {
        return [...prevFavorites, product]; // Agregar a favoritos
      }
    });
  };

  return (
    <div>
      <HeaderAndSearch />
      <div className={styles.checkoutContainer}>
        <h2>Checkout</h2>
        <div className={styles.checkoutContent}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <h3>Información de envío</h3>
            <input
              type="text"
              name="name"
              placeholder="Nombre completo"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Dirección"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="city"
              placeholder="Ciudad"
              value={formData.city}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="zip"
              placeholder="Código postal"
              value={formData.zip}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="country"
              placeholder="País"
              value={formData.country}
              onChange={handleChange}
              required
            />

            <h3>Método de pago</h3>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="credit_card">Tarjeta de crédito</option>
              <option value="paypal">PayPal</option>
              <option value="bank_transfer">Transferencia bancaria</option>
            </select>

            <button type="submit" className={styles.submitBtn}>
              Finalizar compra
            </button>
          </form>
          <hr />
          <div className={styles.orderSummary}>
            <h3>Resumen del pedido</h3>
            <ul className={styles.cartList}>
              {cart.map((product) => (
                <li key={product.id} className={styles.orderItem}>
                  <img
                    src={product.image}
                    alt={product.title}
                    className={styles.cartImage}
                  />
                  <div>
                    <div className={styles.cartInfo}>
                      <h4>{product.title}</h4>
                      <p>{product.author}</p>
                      <p className={styles.price}>
                        {formatPrice(product.price * product.quantity)}€
                      </p>
                      <div className={styles.quantityControls}>
                        <button
                          className={styles.quantityBtn}
                          onClick={() => decrementQuantity(product.id)}
                        >
                          <FontAwesomeIcon icon={faMinus} size="lg" />
                        </button>
                        <span className={styles.quantity}>
                          {product.quantity}
                        </span>
                        <button
                          className={styles.quantityBtn}
                          onClick={() => incrementQuantity(product.id)}
                        >
                          <FontAwesomeIcon icon={faPlus} size="lg" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className={styles.cartActions}>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeFromCart(product.id)}
                    >
                      <FontAwesomeIcon icon={faTrashCan} size="lg" />
                    </button>
                    <button
                      onClick={() => toggleFavorite(product)}
                      className={styles.favButton}
                    >
                      <FontAwesomeIcon
                        icon={
                          favorites.some((fav) => fav.id === product.id)
                            ? faHeartSolid
                            : faHeart
                        }
                      />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <h4>Total: {formatPrice(calculateTotal())}€</h4>
            <Link href="/">
              <button className={styles.backToCartBtn}>
                Seguir comprando
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
