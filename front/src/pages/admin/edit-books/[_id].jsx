import { getBook, updateBook } from "@/api/booksFetch";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "./bookEdit.module.css";
import HeaderAndSearch from "@/components/Header/HeaderAndSearch";

export default function bookEdit() {
  const router = useRouter();
  const { _id } = router.query;
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showGenres, setShowGenres] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBook = async () => {
      if (!_id) return; // Evita llamar la API si _id no está definido

      try {
        const bookAux = await getBook(_id);
        if (bookAux && bookAux.data) {
          setFormData(bookAux.data);
        } else {
          console.error("No se encontraron datos del libro.");
        }
      } catch (error) {
        console.error("Error al cargar el libro:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [_id]);

  if (loading) return <p>Cargando...</p>;

  // Para volver a la página anterior
  const goBack = () => {
    router.back();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const toggleGenres = () => {
    setShowGenres((prev) => !prev);
  };

  const handleGenreChange = (e) => {
    const { value, checked } = e.target;

    setFormData((prev) => {
      const newGenres = checked
        ? [...prev.genres, value] // Agrega el género si está seleccionado
        : prev.genres.filter((genre) => genre !== value); // Lo quita si está desmarcado

      return { ...prev, genres: newGenres };
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Agregamos los datos del formulario
    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((value) => {
          formDataToSend.append(key, value);
        });
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Si el usuario ha cambiado la imagen, la agregamos a FormData
    if (imageFile) {
      formDataToSend.append("file", imageFile);
    }

    const response = await updateBook(_id, formDataToSend);
    if (response.error) {
      setError(response.error);
      return;
    }
    setShowSuccessMessage(true);
  };

  return (
    <div>
      <HeaderAndSearch />
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
                <label htmlFor="image">
                  <img src={formData.image} className={styles.imagePreview} />
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
          <div className={styles.formGrid1}>
            <div>
              <label htmlFor="description">Descripción:</label>
              <textarea
                name="description"
                id="description"
                className={styles.input}
                onChange={handleChange}
                value={formData.description}
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
                    {["Romance", "Drama", "Terror", "Fantasía", "Thriller"].map(
                      (genre) => (
                        <label key={genre}>
                          <input
                            type="checkbox"
                            value={genre}
                            onChange={handleGenreChange}
                            checked={formData.genres?.includes(genre) || false}
                          />
                          {genre}
                        </label>
                      )
                    )}
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
            Guardar Libro
          </button>
        </form>
      </div>

      {showSuccessMessage && (
        <div className={styles.successModal}>
          <div className={styles.successContent}>
            <p>📚 ¡El libro se ha editado correctamente!</p>
            <button
              onClick={() => router.push("/admin/edit-books/all-books-edits")}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
