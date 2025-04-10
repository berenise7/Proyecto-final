import React, { useState } from "react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import styles from "./ForgotPasswordFormik.module.css";
import { forgotPassword } from "@/api/usersFetch";

export default function ForgotPasswordFormik() {
  const [message, setMessage] = useState("");

  const validationSchema = Yup.object({
    email: Yup.string().email("Correo inválido").required("Correo requerido"),
  });

  const handleForgotPassword = async (
    email,
    setMessage,
    resetForm,
    setSubmitting
  ) => {
    try {
      const response = await forgotPassword(email);

      if (response?.message) {
        setMessage(response.message);
        resetForm();
      } else {
        setMessage(response?.error || "Error al enviar el correo");
      }
    } catch (error) {
      setMessage("Error inesperado al enviar el correo");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Restaurar contraseña</h2>
        <Formik
          initialValues={{
            email: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) =>
            handleForgotPassword(
              values.email,
              setMessage,
              resetForm,
              setSubmitting
            )
          }
        >
          {({ isSubmitting }) => (
            <Form>
              <div>
                <label htmlFor="email">Correo electrónico</label>
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
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar enlace"}
              </button>
            </Form>
          )}
        </Formik>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
