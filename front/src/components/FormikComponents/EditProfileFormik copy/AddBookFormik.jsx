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
import styles from "./AddBookFormik.module.css";

export default function AddBookFormik() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [showGenres, setShowGenres] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

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

  if (user.rol === "user") {
    router.push("/");
  }

  const goBack = () => {
    router.back();
  };

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

  const initialValues = {
    title: "",
    author: "",
    genre: [],
    editorial: "",
    isbn: "",
    price: "",
    quantity: "",
    image: "",
    isNewBook: false,
    isPresale: false,
    bestSeller: false,
    isRecommendation: false,
    description: "",
    ratings: [],
    url: "",
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("El título es obligatorio"),
    author: Yup.string().required("El autor es obligatorio"),
    genre: Yup.array().min(1, "Selecciona al menos un género"),
    editorial: Yup.string().required("La editorial es obligatoria"),
    isbn: Yup.string().required("El ISBN es obligatorio"),
    price: Yup.number()
      .required("El precio es obligatorio")
      .positive("El precio debe ser positivo"),
    quantity: Yup.number()
      .required("La cantidad es obligatoria")
      .min(1, "Debe haber al menos una unidad"),
    description: Yup.string().required("La descripción es obligatoria"),
    url: Yup.string().url("Debe ser una URL válida"),
  });
  return user.rol === "admin" ? (
    <div className={styles.formContainer}>
      <a className="back" onClick={goBack}>
        <FontAwesomeIcon icon={faChevronLeft} /> Volver atras
      </a>
      <h2 className={styles.formTitle}>Añadir nuevo libro</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        // onSubmit={onSubmit}
      >
        <Form className={styles.formGridContainer}>
          <div className={styles.photoContainer}>
            <div className={styles.photoInput}>
              {selectedImage ? (
                <div className={styles.imagePreview}>
                  <img src={selectedImage} alt="Selected" />
                </div>
              ) : (
                <label htmlFor="image" className={styles.labelPhoto}>
                  Agregar foto de perfil
                </label>
              )}
              <input
                type="file"
                name="image"
                id="image"
                className={styles.hiddenInput}
                onChange={handleImageChange}
              />
            </div>
          </div>
          <div className={styles.formGrid3}>
            <div>
              <label>Título:</label>
              <Field type="textarea" name="title" className={styles.input} />
              <ErrorMessage name="title" component="div" className={styles.error}/>
            </div>
            <div>
              <label>Autor:</label>
              <Field type="text" name="author" className={styles.input} />
              <ErrorMessage name="author" component="div" className={styles.error}/>
            </div>
            <div>
              <label>Editorial:</label>
              <Field type="text" name="editorial" className={styles.input} />
              <ErrorMessage name="editorial" component="div" className={styles.error}/>
            </div>
          </div>

          <div className={styles.formGrid3}>
            <div>
              <label>ISBN:</label>
              <Field type="text" name="isbn" className={styles.input} />
              <ErrorMessage name="isbn" component="div" className={styles.error}/>
            </div>
            <div>
              <label>Precio:</label>
              <Field type="number" name="price" className={styles.input} />
              <ErrorMessage name="price" component="div" className={styles.error}/>
            </div>
            <div>
              <label>Cantidad:</label>
              <Field type="number" name="quantity" className={styles.input} />
              <ErrorMessage name="quantity" component="div" className={styles.error}/>
            </div>
          </div>

          <div className={styles.formGrid2}>
            <div className={styles.description}>
              <label>Descripción:</label>
              <Field as="textarea" name="description" className={styles.input} />
              <ErrorMessage name="description" component="div" className={styles.error}/>
            </div>
            <div>
              <label>URL del libro:</label>
              <Field type="text" name="url" className={styles.input} />
              <ErrorMessage name="url" component="div" className={styles.error}/>
            </div>
          </div>
          <div className={styles.formGrid2}>
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
                          value="Romance"
                          className={styles.checkbox}
                        />
                        Romance
                      </label>
                      <label>
                        <Field
                          type="checkbox"
                          name="favoriteGenre"
                          value="Comedia"
                          className={styles.checkbox}
                        />
                        Comedia
                      </label>
                      <label>
                        <Field
                          type="checkbox"
                          name="favoriteGenre"
                          value="Drama"
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
                          value="Terror"
                          className={styles.checkbox}
                        />
                        Terror
                      </label>
                      <label>
                        <Field
                          type="checkbox"
                          name="favoriteGenre"
                          value="Fantasía"
                          className={styles.checkbox}
                        />
                        Fantasía
                      </label>
                      <label>
                        <Field
                          type="checkbox"
                          name="favoriteGenre"
                          value="Thriller"
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

            <div className={styles.formGrid4}>
              <label>
                <Field type="checkbox" name="isNewBook" /> Nuevo
              </label>
              <label>
                <Field type="checkbox" name="isPresale" /> Preventa
              </label>
              <label>
                <Field type="checkbox" name="bestSeller" /> Bestseller
              </label>
              <label>
                <Field type="checkbox" name="isRecommendation" /> Recomendado
              </label>
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>Añadir Libro</button>
        </Form>
      </Formik>
    </div>
  ) : (
    <p>Cargando...</p>
  );
}
