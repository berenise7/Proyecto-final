import { Formik, Form, ErrorMessage, Field } from "formik";
import styles from "./UserRegister.module.css";
import React, { useState } from "react";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function UserRegisterFormik() {
  const [showGenres, setShowGenres] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleGenres = () => {
    setShowGenres((prev) => !prev);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const saveUser = (values) => {
    const formData = {
      ...values,
      photo: imageFile, // Añade la imagen a los datos
    };

    // Mostrar el formulario completo en el alert (incluyendo la imagen)
    alert(JSON.stringify(formData, null, 2)); // El `null, 2` es para dar formato al JSON de forma legible

    console.log(formData);
  };

  const validationSchema = Yup.object({
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
        onSubmit={saveUser}
      >
        <Form>
          <div className={styles.formGridContainer}>
            <div className={styles.formGrid2}>
              <div>
                <label htmlFor="name">Nombre:</label>
                <Field
                  type="text"
                  name="name"
                  className={styles.input}
                  placeholder="Introduce tu nombre"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className={styles.error}
                />
              </div>
              <div>
                <label htmlFor="lastname">Apellidos:</label>
                <Field
                  type="text"
                  name="lastname"
                  className={styles.input}
                  placeholder="Introduce tus apellidos"
                />
                <ErrorMessage
                  name="lastname"
                  component="div"
                  className={styles.error}
                />
              </div>
              <div>
                <label htmlFor="phone">Teléfono:</label>
                <Field
                  type="text"
                  name="phone"
                  className={styles.input}
                  placeholder="Introduce tu número de telefono"
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className={styles.error}
                />
              </div>
              <div>
                <label htmlFor="address">Dirección:</label>
                <Field
                  type="text"
                  name="address"
                  className={styles.input}
                  placeholder="Introduce tu direccion"
                />
                <ErrorMessage
                  name="address"
                  component="div"
                  className={styles.error}
                />
              </div>
              <div>
                <label htmlFor="email">Correo electrónico:</label>
                <Field
                  type="text"
                  name="email"
                  className={styles.input}
                  placeholder="Introduce tu correo electronico"
                />
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
                  placeholder="Confirma tu correo electronico"
                />
                <ErrorMessage
                  name="confirmEmail"
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
              <div>
                <label htmlFor="confirmPassword">Confirmar contraseña:</label>
                <div className={styles.passwordContainer}>
                  <Field
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className={styles.input}
                    placeholder="Confirma tu contraseña"
                  />
                  <div
                    className={styles.eyeIcon}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Alterna la visibilidad
                  >
                    {showPassword ? (
                      <FontAwesomeIcon icon={faEyeSlash} size={20} /> // Ojo cerrado
                    ) : (
                      <FontAwesomeIcon icon={faEye} size={20} /> // Ojo abierto
                    )}
                  </div>
                </div>
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
              <div className={styles.genresContainer}>
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
                  <input
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
                ) : (
                  <p>No hay ninguna foto</p>
                )}
              </div>
            </div>
          </div>
          <button type="submit" className={styles.submitButton}>
            Registrarse
          </button>
          <div className={styles.link}>
            <p>
              ¿Ya tienes una cuenta? <Link href="/user/login">Inicia sesión</Link>
            </p>
          </div>
        </Form>
      </Formik>
    </div>
  );
}
