import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/core/contexts/AuthContext";
import styles from "./EditProfileFormik.module.css";

export default function EditProfileFormik() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(user?.photo || "");

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token && !user) {
      router.push("/user/login"); // Redirige al login si no está autenticado
    } else {
      setIsAuth(true);
    }
  }, [router]);

  if (!isAuth) {
    return <p>Cargando...</p>; // Muestra un mensaje mientras se verifica el login
  }

  const goBack = () => {
    router.back();
  };

  // Lista de géneros para seleccionar
  const genres = [
    "Romance",
    "Fantasía",
    "Thriller",
    "Comedia",
    "Drama",
    "Terror",
  ];

  // Esquema de validación con Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("El nombre es obligatorio"),
    lastname: Yup.string().required("El apellido es obligatorio"),
    email: Yup.string()
      .email("Correo inválido")
      .required("El correo es obligatorio"),
    address: Yup.string().required("La dirección es obligatoria"),
    phone: Yup.string()
      .matches(/^\d+$/, "El teléfono solo debe contener números")
      .min(9, "El teléfono debe tener al menos 9 dígitos")
      .required("El teléfono es obligatorio"),
    password: Yup.string().min(6, "Debe tener al menos 6 caracteres"),
    birthday: Yup.date().required("La fecha de nacimiento es obligatoria"),
    rol: Yup.string().oneOf(["admin", "user"], "Rol inválido"),
    favoriteGenre: Yup.array().min(1, "Elige al menos un género"),
  });
  return user ? (
    <div className={styles.formContainer}>
      <a className="back" onClick={goBack}>
        <FontAwesomeIcon icon={faChevronLeft} /> Volver atras
      </a>
      <h2 className={styles.formTitle}>Editar Perfil</h2>

      <Formik
        initialValues={{
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          address: user.address,
          phone: user.phone,
          password: user.password,
          birthday: user.birthday,
          rol: user.rol,
          favoriteGenre: user.favoriteGenre,
          photo: user.photo || "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          updateUser({ ...user, ...values }); // Guarda cambios en el contexto y localStorage
          alert("Perfil actualizado!");
        }}
      >
        {({ values, setFieldValue }) => (
          <Form className={styles.formGridContainer}>
            <div className={styles.formGrid2}>
              <div>
                <label>Nombre:</label>
                <Field
                  type="text"
                  name="name"
                  className={styles.input}
                  disabled={!isEditing}
                />
                <ErrorMessage name="name" component="div" className="error" />
              </div>
              <div>
                <label>Apellido:</label>
                <Field
                  type="text"
                  name="lastname"
                  className={styles.input}
                  disabled={!isEditing}
                />
                <ErrorMessage
                  name="lastname"
                  component="div"
                  className={styles.error}
                />
              </div>
              <div>
                <label>Correo:</label>
                <Field
                  type="email"
                  name="email"
                  className={styles.input}
                  disabled={!isEditing}
                />
                <ErrorMessage name="email" component="div" className="error" />
              </div>
              <div>
                <label>Dirección:</label>
                <Field
                  type="text"
                  name="address"
                  className={styles.input}
                  disabled={!isEditing}
                />
                <ErrorMessage
                  name="address"
                  component="div"
                  className={styles.error}
                />
              </div>
              <div>
                <label>Teléfono:</label>
                <Field
                  type="text"
                  name="phone"
                  className={styles.input}
                  disabled={!isEditing}
                />
                <ErrorMessage
                  name="phone"
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
                    disabled={!isEditing}
                  />
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.eyeIcon}
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
            </div>
            <div className={styles.formGrid3}>
              <div>
                <label htmlFor="birthday">Fecha de nacimiento:</label>
                <Field
                  type="date"
                  name="birthday"
                  className={styles.input}
                  disabled={!isEditing}
                />
                <ErrorMessage
                  name="birthday"
                  component="div"
                  className={styles.error}
                />
              </div>

              {user.rol === "admin" ? (
                <div>
                  <label htmlFor="rol">Rol:</label>
                  <Field
                    as="select"
                    name="rol"
                    className={styles.input}
                    disabled={!isEditing}
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </Field>
                  <ErrorMessage
                    name="rol"
                    component="div"
                    className={styles.error}
                  />
                </div>
              ) : (
                ""
              )}

              <div>
                <label htmlFor="favoriteGenre">Géneros favoritos:</label>
                <div className={styles.checkboxGroup}>
                  <div className={styles.checkboxColumn}>
                    {genres.map((genre) => (
                      <label key={genre}>
                        <Field
                          type="checkbox"
                          name="favoriteGenre"
                          className={styles.checkbox}
                          value={genre}
                          checked={values.favoriteGenre.includes(genre)} // ✔ Marca los valores guardados
                          onChange={(e) => {
                            if (!isEditing) return;
                            const { checked, value } = e.target;
                            const newGenres = checked
                              ? [...values.favoriteGenre, value] // Agrega si está marcado
                              : values.favoriteGenre.filter((g) => g !== value); // Quita si se desmarca
                            setFieldValue("favoriteGenre", newGenres); // Actualiza el estado en Formik
                          }}
                          disabled={!isEditing}
                        />
                        {genre}
                      </label>
                    ))}
                  </div>
                </div>
                <ErrorMessage
                  name="favoriteGenre"
                  component="div"
                  className={styles.error}
                />
              </div>

              <div className={styles.photoContainer}>
                <label htmlFor="photo">Foto de perfil:</label>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    name="photo"
                    onChange={(event) => {
                      if (!isEditing) return;
                      const file = event.currentTarget.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          setFieldValue("photo", reader.result);
                          setPreviewPhoto(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    disabled={!isEditing}
                  />
                </div>
                {previewPhoto && (
                  <div>
                    <img src={previewPhoto} alt="Foto de perfil" width="100" />
                  </div>
                )}
              </div>
            </div>

            <div className={styles.buttonContainer}>
              {isEditing ? (
                <>
                  <button type="submit" className={styles.submitButton}>
                    Guardar Cambios
                  </button>
                  <span
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </span>
                </>
              ) : (
                <span
                  type="button"
                  className={styles.editButton}
                  onClick={() => setIsEditing(true)}
                >
                  Editar
                </span>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  ) : (
    <p>Cargando...</p>
  );
}
