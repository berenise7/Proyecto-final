import React, { useRef, useState } from "react";
import Link from "next/link";
import styles from "./Header.module.css";
import { useAuth } from "@/core/contexts/AuthContext";

export default function AccountDropdown({ accountDropDownRef }) {
  const { user, handleLogout } = useAuth();

  const toggleAdmin = () => {
    setIsAdminOpen((prevState) => !prevState);
  };
  return (
    <div className={styles.overlayMenuAccount} ref={accountDropDownRef}>
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

        {user?.rol === "admin" ? (
          <li>
            <Link href="/admin/add-book/add-book">Añadir nuevo libro</Link>
          </li>
        ) : (
          ""
        )}
        {user?.rol === "admin" ? (
          <li>
            <Link href="/admin/edit-books/all-books-edits">Editar libros</Link>
          </li>
        ) : (
          ""
        )}
        <li>
          <a onClick={handleLogout}>Cerrar sesión</a>
        </li>
      </ul>
    </div>
  );
}
