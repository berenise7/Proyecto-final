import React, { useState } from "react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import styles from "./ForgotPasswordFormik.module.css";
import { resetPassword } from "@/api/usersFetch";
import { useAuth } from "@/core/contexts/AuthContext";

export default function ResetPasswordFormik() {
  const { setUser } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token");
  console.log(resetToken);

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .matches(/[A-Z]/, "Debe incluir al menos una Mayúscula")
      .matches(/[a-z]/, "Debe incluir al menos una Minúscula")
      .matches(/[0-9]/, "Debe incluir al menos un numero")
      .matches(
        /[@$!%*?&]/,
        "Debe incluir un carácter especial @, $, !, %, *, ? o &"
      )
      .required("Contraseña requerida"),
    confirmPassword: Yup.string()
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

  const handleResetPassword = async (values, { setSubmitting }) => {
    if (!resetToken) {
      setMessage("Token no válido o expirado");
      setSubmitting(false);
      return;
    }

    const { newPassword, confirmPassword } = values;
    const response = await resetPassword(
      resetToken,
      newPassword,
      confirmPassword
    );
    console.log(response);

    if (response.error) {
      setMessage(response.error);
    } else {
      setUser(response.data);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.data));
      router.push("/");
    }
    setSubmitting(false);
  };
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Restaurar contraseña</h2>
        <Formik
          initialValues={{
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleResetPassword}
        >
          {({ isSubmitting }) => (
            <Form>
              <div>
                <label htmlFor="newPassword">Nueva contraseña</label>
                <Field
                  type="text"
                  name="newPassword"
                  className={styles.input}
                  placeholder="Introduce tu nueva contraseña"
                />
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className={styles.error}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword">
                  Confirmar nueva contraseña
                </label>
                <Field
                  type="text"
                  name="confirmPassword"
                  className={styles.input}
                  placeholder="Introduce tu nueva contraseña"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className={styles.error}
                />
              </div>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Restaurar contraseña"}
              </button>
            </Form>
          )}
        </Formik>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
