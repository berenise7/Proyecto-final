import React, { useState } from "react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import styles from "./UserLogin.module.css";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRouter } from "next/router";

export default function UserLoginFormik() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const testUser = {
    email: "test@correo.com",
    password: "Prueba123!",
  };

  const handleLogin = (values) => {
    console.log("Valores ingresados:", values); 
    if (
      values.email === testUser.email &&
      values.password === testUser.password
    ) {
      const fakeToken = "1234567890abcdef"; //  Token simulado
      if (values.rememberMe) {
        console.log("✅ Guardando token en localStorage");
        localStorage.setItem("token", fakeToken); // Guardar en localStorage (sesión persistente)
      } else {
        console.log("✅ Guardando token en sessionStorage");
        sessionStorage.setItem("token", fakeToken); // Guardar en sessionStorage (se borra al cerrar navegador)
      }
      console.log("🔄 Redirigiendo a /home...");
      router.push("/");
    } else {
      console.log("❌ Error: Credenciales incorrectas");
      setLoginError("Correo o contraseña incorrectos");
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Correo inválido").required("Correo requerido"),
    password: Yup.string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .matches(/[A-Z]/, "Debe incluir al menos una Mayúscula")
      .matches(/[a-z]/, "Debe incluir al menos una Minúscula")
      .matches(/[0-9]/, "Debe incluir al menos un numero")
      .matches(
        /[@$!%*?&]/,
        "Debe incluir un carácter especial @, $, !, %, *, ? o &"
      )
      .required("Contraseña requerida"),
  });
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Login</h2>
        <Formik
          initialValues={{
            email: "",
            password: "",
            rememberMe: false,
          }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          <Form>
            <div>
              <label htmlFor="email">Correo electrónico:</label>
              <Field
                type="text"
                name="email"
                className={styles.input}
                placeholder="Introduce tu email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className={styles.error}
              />
            </div>
            <div>
              <label htmlFor="password">Contraseña:</label>
              <div className={styles.passwordContainer}>
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={styles.input}
                  placeholder="Introduce tu contraseña"
                />
                <div
                  className={styles.eyeIcon}
                  onClick={() => setShowPassword(!showPassword)} // Alterna la visibilidad
                >
                  {showPassword ? (
                    <FontAwesomeIcon icon={faEyeSlash} size={20} /> // Ojo cerrado
                  ) : (
                    <FontAwesomeIcon icon={faEye} size={20} /> // Ojo abierto
                  )}
                </div>
              </div>
              <ErrorMessage
                name="password"
                component="div"
                className={styles.error}
              />
            </div>
            {loginError && <p className={styles.error}>{loginError}</p>}
            <div className={styles.checkboxGroup}>
              <Field type="checkbox" id="rememberMe" name="rememberMe" />
              <label htmlFor="rememberMe">Recuérdame</label>
            </div>
            <button type="submit" className={styles.submitButton}>
              Iniciar Sesión
            </button>
            <div className={styles.link}>
              <p>
                ¿Olvidaste tu contraseña?{" "}
                <Link href="/user/register">Recordar contraseña</Link>
              </p>
              <p>
                ¿No tienes una cuenta?{" "}
                <Link href="/user/register">Registrarse</Link>
              </p>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
