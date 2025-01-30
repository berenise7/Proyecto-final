import { Formik, Form, ErrorMessage, Field } from "formik";
import styles from "./UserRegister.module.css";
import React, { useState } from "react";
import * as Yup from "yup";

export default function UserRegisterFormik() {
  const [showGenres, setShowGenres] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const toggleGenres = () => {
    setShowGenres((prev) => !prev);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const saveUser = (values) => {
    alert(JSON.stringify(values));
  };

  const validationSchema = Yup.object({
    photo: Yup.string().url("Debe ser una url válida").nullable(),
    name: Yup.string()
      .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/, "Solo letras permitidas")
      .min(2, "Debe tener al menos dos caracteres")
      .required("Nombre requerido"),
    lastname: Yup.string()
      .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/, "Solo letras permitidas")
      .min(2, "Debe tener al menos dos caracteres")
      .required("Apellido requerido"),
    phone: Yup.string()
      .matches(/^\d+$/, "Solo números permitidos")
      .length(9, "Debe tener exactamente 9 dígitos")
      .required("Teléfono requerido"),
    address: Yup.string()
      .min(5, "Debe tener al menos 5 caracteres")
      .required("Dirección requerida"),
    email: Yup.string().email("Correo inválido").required("Correo requerido"),
    confirmEmail: Yup.string()
      .oneOf([Yup.ref("email"), null], "Los correos no coinciden")
      .required("Confirmación de correo requerida"),
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
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden")
      .required("Confirmación de contraseña requerida"),
    birthday: Yup.date()
      .max(
        new Date(new Date().setFullYear(new Date().getFullYear() - 13)),
        "Debes tener al menos 13 años"
      )
      .required("Fecha de nacimiento requerida"),
    favoriteGenre: Yup.array()
      .min(1, "Debes seleccionar al menos un género")
      .required("Selecciona al menos un género"),
  });

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Registro</h2>
      <Formik
        initialValues={{
          photo: "",
          name: "",
          lastname: "",
          phone: "",
          address: "",
          email: "",
          confirmEmail: "",
          password: "",
          confirmPassword: "",
          birthday: "",
          favoriteGenre: [],
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => saveUser(values)}
      >
        <Form>
          <div className={styles.formGridContainer}>
            <div className={styles.formGrid2}>
              <div>
                <label htmlFor="name">Nombre:</label>
                <Field type="text" name="name" className={styles.input} />
                <ErrorMessage
                  name="name"
                  component="div"
                  className={styles.error}
                />
              </div>
              <div>
                <label htmlFor="lastname">Apellidos:</label>
                <Field type="text" name="lastname" className={styles.input} />
                <ErrorMessage
                  name="lastname"
                  component="div"
                  className={styles.error}
                />
              </div>
              <div>
                <label htmlFor="phone">Teléfono:</label>
                <Field type="text" name="phone" className={styles.input} />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className={styles.error}
                />
              </div>
              <div>
                <label htmlFor="address">Dirección:</label>
                <Field type="text" name="address" className={styles.input} />
                <ErrorMessage
                  name="address"
                  component="div"
                  className={styles.error}
                />
              </div>
              <div>
                <label htmlFor="email">Correo electrónico:</label>
                <Field type="text" name="email" className={styles.input} />
                <ErrorMessage
                  name="email"
                  component="div"
                  className={styles.error}
                />
              </div>
              <div>
                <label htmlFor="confirmEmail">
                  Confirmar correo electrónico:
                </label>
                <Field
                  type="text"
                  name="confirmEmail"
                  className={styles.input}
                />
                <ErrorMessage
                  name="confirmEmail"
                  component="div"
                  className={styles.error}
                />
              </div>
              <div>
                <label htmlFor="password">Contraseña:</label>
                <Field type="text" name="password" className={styles.input} />
                <ErrorMessage
                  name="password"
                  component="div"
                  className={styles.error}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword">Confirmar contraseña:</label>
                <Field
                  type="text"
                  name="confirmPassword"
                  className={styles.input}
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className={styles.error}
                />
              </div>
            </div>
            <div className={styles.formGrid3}>
              <div>
                <label htmlFor="birthday">Fecha de nacicimiento:</label>
                <Field type="date" name="birthday" className={styles.input} />
                <ErrorMessage
                  name="birthday"
                  component="div"
                  className={styles.error}
                />
              </div>
              <div className={styles.genresContainer }>
                <button
                  type="button"
                  className={styles.toggleButton}
                  onClick={toggleGenres}
                >
                  {showGenres
                    ? "Ocultar géneros"
                    : "Seleccionar géneros favoritos"}
                </button>
                {showGenres && (
                  <div className={styles.checkboxGroup}>
                    <div className={styles.checkboxColumn}>
                      <div>
                        <label>
                          <Field
                            type="checkbox"
                            name="favoriteGenre"
                            value="romance"
                            className={styles.checkbox}
                          />
                          Romance
                        </label>
                        <label>
                          <Field
                            type="checkbox"
                            name="favoriteGenre"
                            value="comedia"
                            className={styles.checkbox}
                          />
                          Comedia
                        </label>
                        <label>
                          <Field
                            type="checkbox"
                            name="favoriteGenre"
                            value="drama"
                            className={styles.checkbox}
                          />
                          Drama
                        </label>
                      </div>
                      <div>
                        <label>
                          <Field
                            type="checkbox"
                            name="favoriteGenre"
                            value="terror"
                            className={styles.checkbox}
                          />
                          Terror
                        </label>
                        <label>
                          <Field
                            type="checkbox"
                            name="favoriteGenre"
                            value="fantasía"
                            className={styles.checkbox}
                          />
                          Fantasía
                        </label>
                        <label>
                          <Field
                            type="checkbox"
                            name="favoriteGenre"
                            value="thriller"
                            className={styles.checkbox}
                          />
                          Thriller
                        </label>
                      </div>
                    </div>
                  </div>
                )}
                <ErrorMessage
                  name="favoriteGenre"
                  component="div"
                  className={styles.error}
                />
              </div>
              <div className={styles.photoContainer}>
                <label htmlFor="photo" className={styles.labelPhoto}>
                  Agregar foto de perfil
                </label>
                <div className={styles.photoInput}>
                  <Field
                    type="file"
                    name="photo"
                    id="photo"
                    onChange={handleImageChange}
                  />
                </div>
                {selectedImage ? (
                  <div className={styles.imagePreview}>
                    <img src={selectedImage} alt="Selected" />
                  </div>
                ) : <p>No hay ninguna foto</p>}
              </div>
            </div>
          </div>
          <button type="submit" className={styles.submitButton}>
            Registrarse
          </button>
          <div className={styles.link}>
            <p>
              ¿Ya tienes una cuenta? <a href="/user/login">Inicia sesión</a>
            </p>
          </div>
        </Form>
      </Formik>
    </div>
  );
}
