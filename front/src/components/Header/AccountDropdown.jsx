import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./Header.module.css";
import { useAuth } from "@/core/contexts/AuthContext";

export default function AccountDropdown({
  accountDropDownRef,
  isOpen,
  dropdownPosition,
}) {
  // uso de user context
  const { user, handleLogout } = useAuth();

  return (
    <div
      className={`${styles.overlayMenuAccount} ${isOpen ? styles.open : ""}`}
      ref={accountDropDownRef}
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
      }}
    >
      <ul>
        <li>
          <Link href="/myaccount/my-data/my-data">Mis datos</Link>
        </li>
        <li>
          <Link href="/myaccount/my-library/my-library">
            Mis lecturas terminadas
          </Link>
        </li>
        <li>
          <Link href="/myaccount/favorites/favorites">Mis favoritos</Link>
        </li>
        <li>
          <Link href="/myaccount/my-orders/orders">Mis pedidos</Link>
        </li>

        {user?.rol === "admin" ? (
          <>
            <li>
              <Link href="/admin/add-book/add-book">Añadir nuevo libro</Link>
            </li>
            <li>
              <Link href="/admin/edit-books/all-books-edits">
                Editar libros
              </Link>
            </li>
            <li>
              <Link href="/admin/users/users">Editar usuarios</Link>
            </li>
          </>
        ) : (
          ""
        )}

        <hr />
        <li>
          <a onClick={handleLogout}>Cerrar sesión</a>
        </li>
      </ul>
    </div>
  );
}
