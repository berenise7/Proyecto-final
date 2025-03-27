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
import { useAuth } from "@/core/contexts/AuthContext";
import HeaderAndSearch from "@/components/Header/HeaderAndSearch";
import { newOrderAndPayment } from "@/api/orderFetch";

export default function Checkout() {
  const {
    cart,
    setCart,
    subtotal,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    calculateTotal,
    formatPrice,
  } = useCart();
  const { favorites, toggleFavorite } = useFavorites();
  const { user } = useAuth();
  const [cartEmpty, setCartEmpty] = useState(false);
  const [purchaseMade, setPurchaseMade] = useState(false);
  const [problemPurchase, setProblemPurchase] = useState(false);
  const [formData, setFormData] = useState({
    name: user ? `${user.name} ${user.lastname}` : "",
    email: user ? user.email : "",
    phone: user ? user.phone : "",
    address: user ? user.address : "",
    city: "",
    zip: "",
    country: "",
  });

  const [paymentData, setPaymentData] = useState({
    paymentMethod: "credit_card",
  });

  const safeSubtotal = isNaN(subtotal) ? 0 : subtotal;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };
  const handleCheckout = async () => {
    if (cart?.length === 0 || !cart) {
      setCartEmpty(true);
    }

    const orderData = {
      full_name: formData.name,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      city: formData.city,
      address: formData.address,
      zip_code: formData.zip,
    };

    const paymentInfo = {
      method: paymentData.paymentMethod,
    };

    const result = await newOrderAndPayment(
      cart,
      orderData,
      paymentInfo,
      user?._id || null
    );
    if (result && result.status === "Succeeded") {
      setPurchaseMade(true);
      setCart([])
      localStorage.removeItem(`cart`);
      sessionStorage.removeItem(`cart`);
    } else {
      setProblemPurchase(true);
      console.error("Error al procesar el pago", result);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleCheckout();
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
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Número de teléfono"
              value={formData.phone}
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
              name="address"
              placeholder="Dirección"
              value={formData.address}
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

            <h3>Método de pago</h3>
            <select
              name="paymentMethod"
              value={paymentData.paymentMethod}
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
              {cart?.map((product) => (
                <li
                  key={!user ? product.id : product.book_id._id}
                  className={styles.orderItem}
                >
                  <img
                    src={product.image || product.book_id.image}
                    alt={product.title || product.book_id.title}
                    className={styles.cartImage}
                  />
                  <div>
                    <div className={styles.cartInfo}>
                      <h4>{product.title || product.book_id.title}</h4>
                      <p>{product.author || product.book_id.author}</p>
                      <p className={styles.price}>
                        {formatPrice(product.price * product.quantity)}€
                      </p>
                      <div className={styles.quantityControls}>
                        <button
                          className={styles.quantityBtn}
                          onClick={() =>
                            decrementQuantity(
                              user
                                ? {
                                    bookId: product.book_id,
                                    quantity: product.quantity,
                                  }
                                : product._id
                            )
                          }
                        >
                          <FontAwesomeIcon icon={faMinus} size="lg" />
                        </button>
                        <span className={styles.quantity}>
                          {product.quantity}
                        </span>
                        <button
                          className={styles.quantityBtn}
                          onClick={() =>
                            incrementQuantity(
                              user
                                ? {
                                    bookId: product.book_id,
                                    quantity: product.quantity,
                                  }
                                : product._id
                            )
                          }
                        >
                          <FontAwesomeIcon icon={faPlus} size="lg" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className={styles.cartActions}>
                    <button
                      className={styles.removeBtn}
                      onClick={() =>
                        removeFromCart(user ? product.book_id : product._id)
                      }
                    >
                      <FontAwesomeIcon icon={faTrashCan} size="lg" />
                    </button>
                    {user && (
                      <button
                        onClick={() => toggleFavorite(product.book_id)}
                        className={styles.favButton}
                      >
                        <FontAwesomeIcon
                          icon={
                            favorites.some(
                              (fav) => fav.book_id === product.book_id._id
                            )
                              ? faHeartSolid
                              : faHeart
                          }
                        />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <h4>
              Total:{" "}
              {user ? formatPrice(safeSubtotal) : formatPrice(calculateTotal())}
              €
            </h4>
            <Link href="/">
              <button className={styles.backToCartBtn}>Seguir comprando</button>
            </Link>
            {cartEmpty && <p>El carrito no debe estar vacío</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
