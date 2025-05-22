import HeaderAndSearch from "@/components/Header/HeaderAndSearch";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/core/contexts/AuthContext";

import styles from "./AddBook.module.css";
import { createBook } from "@/api/booksFetch";
import Footer from "@/components/Footer/Footer";

export default function addBook() {
  // uso de auth context
  const { user } = useAuth();

  // useRouter
  const router = useRouter();

  // useState
  const [isAuth, setIsAuth] = useState(false);
  const [showGenres, setShowGenres] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isbnError, setIsbnError] = useState("");
  const [error, setError] = useState(false);
  const [errorsFields, setErrorsFields] = useState({});

  // Inicio de datos del formulario a enviar
  const initialFormData = {
    title: "",
    author: "",
    editorial: "",
    isbn: "",
    price: "",
    quantity: "",
    description: "",
    genres: [],
    isNewBook: false,
    isPresale: false,
    bestSeller: false,
    isRecommendation: false,
  };
  const [formData, setFormData] = useState(initialFormData);

  // Validacion de los campos
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "El título es obligatorio";
    if (!formData.author.trim()) newErrors.author = "El autor es obligatorio";
    if (!formData.editorial.trim())
      newErrors.editorial = "La editorial es obligatoria";
    if (!formData.isbn.trim()) newErrors.isbn = "El isbn es obligatorio";
    if (!formData.price) newErrors.price = "El precio es obligatorio";
    if (!formData.quantity) newErrors.quantity = "La cantidad es obligatoria";
    if (!formData.description)
      newErrors.description = "La descripción es obligatoria";
    if (formData.genres.length === 0)
      newErrors.genres = "Es obligatorio marcar algún género";

    setErrorsFields(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // useEffect
  // Verifica si hay token
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token && !user) {
      router.push("/user/login"); // Redirige al login si no está autenticado
    } else {
      setIsAuth(true);
    }
  }, [router]);

  // Muestra un mensaje mientras se verifica el login
  if (!isAuth) {
    return <p>Cargando...</p>;
  }
  // Si su rol es user te redirige a home
  if (user.rol === "user") {
    router.push("/");
  }

  // Función para volver a la página anterior
  const goBack = () => {
    router.back();
  };

  // Función para alternar el estado de los generos
  const toggleGenres = () => {
    setShowGenres((prev) => !prev);
  };

  // Función para manejar cambios y actualizar el estado del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setIsbnError("");
  };

  // Función para manejar los cambios de los checkboxes de géneros
  const handleGenreChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      genres: checked
        ? [...prev.genres, value]
        : prev.genres.filter((genre) => genre !== value),
    }));
  };

  // Función para manejar el cambio de imagen y guardarla en una vista previa
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  // Función para resetear el formulario
  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedImage(null);
    setImageFile(null);
    setShowSuccessMessage(false);
  };

  // Función para el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const sendData = new FormData();
      // Agrega todos los campos al FormData
      Object.keys(formData).forEach((key) => {
        if (Array.isArray(formData[key])) {
          formData[key].forEach((value) => sendData.append(key, value));
        } else {
          sendData.append(key, formData[key]);
        }
      });

      // Agrega una imagen si la hay
      if (imageFile) sendData.append("file", imageFile);

      const response = await createBook(sendData);

      if (response.error?.includes("ISBN")) {
        setIsbnError(response.error);
        return;
      } else if (response.error) {
        setError(true);
        return;
      }

      setShowSuccessMessage(true);
    }
  };
  return (
    <div>
      <HeaderAndSearch />
      {user.rol === "admin" ? (
        <div className={styles.formContainer}>
          <a className="back" onClick={goBack}>
            <FontAwesomeIcon icon={faChevronLeft} /> Volver atras
          </a>
          <h2 className={styles.formTitle}>Añadir nuevo libro</h2>

          <form className={styles.formGridContainer} onSubmit={handleSubmit}>
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
                <label htmlFor="title">Título:</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  onChange={handleChange}
                  className={styles.input}
                  value={formData.title}
                  placeholder={errorsFields.title}
                />
              </div>
              <div>
                <label htmlFor="author">Autor:</label>
                <input
                  type="text"
                  name="author"
                  id="author"
                  className={styles.input}
                  onChange={handleChange}
                  value={formData.author}
                  placeholder={errorsFields.author}
                />
              </div>
              <div>
                <label htmlFor="editorial">Editorial:</label>
                <input
                  type="text"
                  name="editorial"
                  id="editorial"
                  className={styles.input}
                  value={formData.editorial}
                  onChange={handleChange}
                  placeholder={errorsFields.editorial}
                />
              </div>
            </div>

            <div className={styles.formGrid3}>
              <div>
                <label htmlFor="isbn">ISBN:</label>
                <input
                  type="text"
                  name="isbn"
                  id="isbn"
                  className={styles.input}
                  onChange={handleChange}
                  value={formData.isbn}
                  placeholder={errorsFields.isbn}
                />
                {isbnError && <p style={{ color: "#59485b" }}>{isbnError}</p>}
              </div>
              <div>
                <label htmlFor="price">Precio:</label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  className={styles.input}
                  onChange={handleChange}
                  value={formData.price}
                  placeholder={errorsFields.price}
                />
              </div>
              <div>
                <label htmlFor="quantity">Cantidad:</label>
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  className={styles.input}
                  onChange={handleChange}
                  value={formData.quantity}
                  placeholder={errorsFields.quantity}
                />
              </div>
            </div>

            <div className={styles.formGrid1}>
              <div>
                <label htmlFor="description">Descripción:</label>
                <textarea
                  name="description"
                  id="description"
                  className={styles.input}
                  onChange={handleChange}
                  value={formData.description}
                  placeholder={errorsFields.description}
                />
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
                      {[
                        "Romance",
                        "Drama",
                        "Terror",
                        "Fantasía",
                        "Thriller",
                      ].map((genre) => (
                        <label key={genre}>
                          <input
                            type="checkbox"
                            value={genre}
                            onChange={handleGenreChange}
                            checked={formData.genres.includes(genre)}
                          />
                          {genre}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                {errorsFields.genres && (
                  <p style={{ color: "#59485b" }}>{errorsFields.genres}</p>
                )}
              </div>

              <div className={styles.formGrid4}>
                <label>
                  <input
                    type="checkbox"
                    name="isNewBook"
                    onChange={handleChange}
                    checked={formData.isNewBook}
                  />{" "}
                  Nuevo
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="isPresale"
                    onChange={handleChange}
                    checked={formData.isPresale}
                  />{" "}
                  Preventa
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="bestSeller"
                    onChange={handleChange}
                    checked={formData.bestSeller}
                  />{" "}
                  Bestseller
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="isRecommendation"
                    onChange={handleChange}
                    checked={formData.isRecommendation}
                  />{" "}
                  Recomendado
                </label>
              </div>
            </div>

            <button type="submit" className={styles.submitButton}>
              Añadir Libro
            </button>
          </form>

          {showSuccessMessage && (
            <div className={styles.successModal}>
              <div className={styles.successContent}>
                <p>📚 ¡El libro se ha agregado correctamente!</p>
                <button onClick={resetForm}>Aceptar</button>
              </div>
            </div>
          )}
          {error && (
            <div className={styles.successModal}>
              <div className={styles.successContent}>
                <p>📚 ¡No se pudo guardar el libro!</p>
                <button onClick={() => setError(false)}>Aceptar</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Cargando...</p>
      )}
      <Footer />
    </div>
  );
}
