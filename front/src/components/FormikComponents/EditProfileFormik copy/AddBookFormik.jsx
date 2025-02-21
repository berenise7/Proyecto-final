import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/core/contexts/AuthContext";

import styles from "./AddBookFormik.module.css";
import { createBook } from "@/api/booksFetch";

export default function AddBookFormik() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [showGenres, setShowGenres] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    editorial: "",
    isbn: "",
    price: "",
    quantity: "",
    description: "",
    url: "",
    genres: [],
    isNewBook: false,
    isPresale: false,
    bestSeller: false,
    isRecommendation: false,
  });

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleGenreChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      genres: checked
        ? [...prev.genres, value]
        : prev.genres.filter((genre) => genre !== value),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sendData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((value) => sendData.append(key, value));
      } else {
        sendData.append(key, formData[key]);
      }
    });

    if (imageFile) sendData.append("file", imageFile);

    try {
      await createBook(sendData);
  
      alert("Libro agregado correctamente");
    } catch (error) {
      console.log(`Hubo este error: ${error}`);
    }
  };

  return user.rol === "admin" ? (
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
              type="textarea"
              name="title"
              id="title"
              onChange={handleChange}
              className={styles.input}
              value={formData.title}
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
            />
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
            />
          </div>
        </div>

        <div className={styles.formGrid2}>
          <div className={styles.description}>
            <label htmlFor="description">Descripción:</label>
            <textarea
              name="description"
              id="description"
              className={styles.input}
              onChange={handleChange}
              value={formData.description}
            />
          </div>
          <div>
            <label htmlFor="url">URL del libro:</label>
            <input
              type="text"
              name="url"
              id="url"
              className={styles.input}
              onChange={handleChange}
              value={formData.url}
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
              {showGenres ? "Ocultar géneros" : "Seleccionar géneros favoritos"}
            </button>
            {showGenres && (
              <div className={styles.checkboxGroup}>
                <div className={styles.checkboxColumn}>
                  {[
                    "Romance",
                    "Comedia",
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
    </div>
  ) : (
    <p>Cargando...</p>
  );
}
