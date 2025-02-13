import React, { useState } from "react";
import Link from "next/link";
import styles from "./checkout.module.css";
import { useCart } from "@/core/contexts/CartContext";
import Header from "@/components/Header/Header";


export default function checkout() {
  const { cart, calculateTotal, formatPrice } = useCart();
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

  return (
    <div>
      <Header />
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
            <ul>
              {cart.map((product) => (
                <li key={product.id} className={styles.orderItem}>
                  {product.title} x{product.quantity} -{" "}
                  {formatPrice(product.price * product.quantity)}€
                </li>
              ))}
            </ul>
            <h4>Total: {formatPrice(calculateTotal())}€</h4>
            <Link href="/cart/cart">
              <button className={styles.backToCartBtn}>
                Volver al carrito
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
