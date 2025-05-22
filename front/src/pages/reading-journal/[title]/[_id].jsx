import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getBook } from "@/api/booksFetch";
import styles from "./reading.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import {
  faStar as faStarSolid,
  faHeart as faHeartSolid,
  faFaceSmile as faFaceSmileSolid,
  faFaceSadTear as faFaceSadTearSolid,
  faFaceSurprise as faFaceSurprisesolid,
} from "@fortawesome/free-solid-svg-icons";
import {
  faStar as faStarRegular,
  faHeart as faHeartRegular,
  faFaceSmile as faFaceSmileRegular,
  faFaceSadTear as faFaceSadTearRegular,
  faFaceSurprise as faFaceSurpriseRegular,
} from "@fortawesome/free-regular-svg-icons";
import { PiPepperFill, PiPepper } from "react-icons/pi";
import HeaderAndSearch from "@/components/Header/HeaderAndSearch";
import { createJournal, getJournal, updateJournal } from "@/api/journalFetch";
import Footer from "@/components/Footer/Footer";

export default function readingJournal() {
  // useRouter
  const router = useRouter();
  const { _id } = router.query;

  // useState
  const [book, setBook] = useState(null);
  const [readingEntry, setReadingEntry] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [ratings, setRatings] = useState({
    rating: 0,
    romantic: 0,
    happy: 0,
    sad: 0,
    spicy: 0,
    plot: 0,
  });

  // Estado inicial de los datos del formulario
  const initialFormData = {
    pages: 0,
    start_date: "",
    end_date: "",
    format: "",
    type: "",
    characters: "",
    playlist: "",
    favoriteMoments: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  // Obtiene el usuario del almacenamiento
  const storedUser =
    typeof window !== "undefined" &&
    (localStorage.getItem("user") || sessionStorage.getItem("user"));
  // Si hay un usuario almacenado lo parsea y si no hay se convierte en null
  const user = storedUser ? JSON.parse(storedUser) : null;

  // useEffect
  // Verifica si existe un usuario y sino redirige al login
  useEffect(() => {
    if (!user) {
      router.push("/user/login");
    }
  }, []);

  // Carga el libro y, si hay un journal, se actualiza con los datos de la BBDD
  useEffect(() => {
    if (!_id || !user) return;

    const loadBook = async () => {
      const bookAux = await getBook(_id);
      setBook(bookAux.data);

      const journalAux = await getJournal(user._id, _id);

      if (journalAux) {
        setReadingEntry(journalAux.data);

        setFormData(journalAux.data);
        setRatings({
          rating: journalAux?.data?.rating || 0,
          romantic: journalAux?.data?.romantic || 0,
          happy: journalAux?.data?.happy || 0,
          sad: journalAux?.data?.sad || 0,
          spicy: journalAux?.data?.spicy || 0,
          plot: journalAux?.data?.plot || 0,
        });
      }
    };

    loadBook();
  }, [_id]);

  // Actualiza el estado ratings cuando cambian los datos del formulario
  useEffect(() => {
    if (formData) {
      setRatings((prevRatings) => ({
        ...prevRatings,
        rating: formData.rating ?? prevRatings.rating,
        romantic: formData.romantic ?? prevRatings.romantic,
        happy: formData.happy ?? prevRatings.happy,
        sad: formData.sad ?? prevRatings.sad,
        spicy: formData.spicy ?? prevRatings.spicy,
        plot: formData.plot ?? prevRatings.plot,
      }));
    }
  }, [formData]);

  // Para volver a la página anterior
  const goBack = () => {
    router.back();
  };

  // Actualiza la puntuación de una categoría; si se repite la estrella, se reinicia
  const handleStarClick = (category) => (index) => {
    setRatings((prevRatings) => {
      const currentRating = prevRatings[category];
      const newRating = currentRating === index + 1 ? 0 : index + 1;

      return {
        ...prevRatings,
        [category]: newRating,
      };
    });
  };

  // Función para manejar cambios y actualizar el estado del formulario
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  // Envía el formulario para crear o actualizar el diario de lectura y actualiza el estado con la respuesta
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    const baseData = {
      bookId: _id,
      userId: user._id,
      ...formData,
    };

    if (readingEntry) {
      // Si existe un reading journal: (edita)
      Object.keys(baseData).forEach((key) => {
        formDataToSend.set(key, baseData[key]);
      });

      Object.keys(ratings).forEach((key) => {
        formDataToSend.set(key, ratings[key]);
      });
    } else {
      // Si no hay un reading jorunal: (crea uno nuevo)
      Object.keys(baseData).forEach((key) => {
        if (Array.isArray(baseData[key])) {
          baseData[key].forEach((value) => {
            formDataToSend.append(key, value);
          });
        } else {
          formDataToSend.append(key, baseData[key]);
        }
      });

      // Añadimos los ratings
      Object.keys(ratings).forEach((key) => {
        formDataToSend.append(key, ratings[key]);
      });
    }

    // Actualiza si existe un reading journal y sino crea uno nuevo
    const result = readingEntry
      ? await updateJournal(formData?._id, formDataToSend)
      : await createJournal(formDataToSend);

    if (result.error) {
      alert("Error: " + result.error);
    } else {
      setShowSuccessMessage(true);
    }
  };
  // Una vez guardado, se vuelve a cargar el reading journal con los datos actualizados
  const getReading = async () => {
    setShowSuccessMessage(false);

    const journalAux = await getJournal(user._id, _id);
    if (journalAux) {
      setReadingEntry(journalAux.data);
      setFormData(journalAux.data);
      setRatings({
        rating: journalAux.data.rating || 0,
        romantic: journalAux.data.romantic || 0,
        happy: journalAux.data.happy || 0,
        sad: journalAux.data.sad || 0,
        spicy: journalAux.data.spicy || 0,
        plot: journalAux.data.plot || 0,
      });
    }
  };
  return (
    <div>
      <HeaderAndSearch />
      <div className={styles.container}>
        <a className="link" onClick={goBack}>
          <FontAwesomeIcon icon={faChevronLeft} /> Volver atras
        </a>

        {/* Aquí empieza el formulario */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.titleContainer}>
            <div>
              <div className={styles.imageContainer}>
                <img
                  src={formData?.image || book?.image}
                  alt={formData?.image || book?.title}
                  className={styles.image}
                />
              </div>
              <div className={styles.ratingContainer}>
                {/* Ignoramos el primer valor, por eso usamos _ */}
                {[...Array(5)].map((_, index) => (
                  <FontAwesomeIcon
                    key={index}
                    icon={
                      index + 1 <= ratings.rating ? faStarSolid : faStarRegular
                    } // Si el índice es menor que la calificación, usa la estrella rellena
                    onClick={() => handleStarClick("rating")(index)} // Actualiza el rating al hacer clic
                    style={{ cursor: "pointer", margin: "0 5px" }}
                  />
                ))}
              </div>
            </div>
            <div className={styles.titleContainerInfo}>
              <h2 className={styles.title}>Lectura Terminada</h2>
              <label htmlFor="title">Titulo</label>
              <input
                type="text"
                id="title"
                value={formData?.title || book?.title}
                readOnly
              />
              <label htmlFor="author">Autor</label>
              <input
                type="text"
                id="author"
                value={formData?.author || book?.author}
                readOnly
              />
              <div className={styles.bookProgressInfo}>
                <div>
                  <label htmlFor="pages">Paginas:</label>
                  <input
                    type="number"
                    id="pages"
                    onChange={handleChange}
                    defaultValue={formData?.pages || ""}
                  />
                </div>
                <div>
                  <label htmlFor="start_date">Inicio:</label>
                  <input
                    type="date"
                    id="start_date"
                    onChange={handleChange}
                    defaultValue={
                      formData && formData.start_date
                        ? new Date(formData.start_date)
                            .toISOString()
                            .split("T")[0]
                        : formData?.start_date || ""
                    }
                  />
                </div>
                <div>
                  <label htmlFor="end_date">Fin:</label>
                  <input
                    type="date"
                    id="end_date"
                    onChange={handleChange}
                    defaultValue={
                      formData && formData.end_date
                        ? new Date(formData.end_date)
                            .toISOString()
                            .split("T")[0]
                        : formData?.end_date || ""
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.ratingAndDetails}>
            <div className={styles.ratings}>
              <div>
                <label>Romance:</label>
                <div>
                  {/* Ignoramos el primer valor, por eso usamos _ */}
                  {[...Array(5)].map((_, index) => (
                    <FontAwesomeIcon
                      key={index}
                      icon={
                        index + 1 <= ratings.romantic
                          ? faHeartSolid
                          : faHeartRegular
                      }
                      onClick={() => handleStarClick("romantic")(index)}
                      style={{ cursor: "pointer", margin: "0 5px" }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label>Gracioso:</label>
                <div>
                  {/* Ignoramos el primer valor, por eso usamos _ */}
                  {[...Array(5)].map((_, index) => (
                    <FontAwesomeIcon
                      key={index}
                      icon={
                        index + 1 <= ratings.happy
                          ? faFaceSmileSolid
                          : faFaceSmileRegular
                      }
                      onClick={() => handleStarClick("happy")(index)}
                      style={{ cursor: "pointer", margin: "0 5px" }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label>Triste:</label>
                <div>
                  {/* Ignoramos el primer valor, por eso usamos _ */}
                  {[...Array(5)].map((_, index) => (
                    <FontAwesomeIcon
                      key={index}
                      icon={
                        index + 1 <= ratings.sad
                          ? faFaceSadTearSolid
                          : faFaceSadTearRegular
                      }
                      onClick={() => handleStarClick("sad")(index)}
                      style={{ cursor: "pointer", margin: "0 5px" }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label>Spicy:</label>
                <div>
                  {/* Ignoramos el primer valor, por eso usamos _ */}
                  {[...Array(5)].map((_, index) =>
                    index + 1 <= ratings.spicy ? (
                      <PiPepperFill
                        onClick={() => handleStarClick("spicy")(index)}
                        style={{ cursor: "pointer", margin: "0 5px" }}
                      />
                    ) : (
                      <PiPepper
                        onClick={() => handleStarClick("spicy")(index)}
                        style={{ cursor: "pointer", margin: "0 5px" }}
                      />
                    )
                  )}
                </div>
              </div>
              <div>
                <label>Plot twist:</label>
                <div>
                  {/* Ignoramos el primer valor, por eso usamos _ */}
                  {[...Array(5)].map((_, index) => (
                    <FontAwesomeIcon
                      key={index}
                      icon={
                        index + 1 <= ratings.plot
                          ? faFaceSurprisesolid
                          : faFaceSurpriseRegular
                      } // Si el índice es menor que la calificación, usa la estrella rellena
                      onClick={() => handleStarClick("plot")(index)} // Actualiza el rating al hacer clic
                      style={{ cursor: "pointer", margin: "0 5px" }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.formatType}>
            <div>
              <label htmlFor="format">Formato:</label>
              <select
                id="format"
                value={formData?.format || ""}
                onChange={handleChange}
              >
                <option value="">Selecciona un formato</option>
                <option value="Fisico">Físico</option>
                <option value="Digital">Digital</option>
                <option value="Audiolibro">Audiolibro</option>
              </select>
            </div>
            <div>
              <label htmlFor="type">Tipo:</label>
              <select
                id="type"
                value={formData?.type || ""}
                onChange={handleChange}
              >
                <option value="">Selecciona el tipo</option>
                <option value="autoconclusivo">Autoconclusivo</option>
                <option value="bilogia">Bilogía</option>
                <option value="trilogia">Trilogía</option>
                <option value="saga">Saga</option>
              </select>
            </div>
            <div>
              <label htmlFor="playlist">Playlist:</label>
              <input
                type="text"
                id="playlist"
                onChange={handleChange}
                defaultValue={formData?.playlist || ""}
              />
            </div>
          </div>

          <div>
            <label htmlFor="characters">Personajes:</label>
            <input
              type="text"
              id="characters"
              onChange={handleChange}
              defaultValue={formData?.characters || ""}
            />
          </div>

          <div>
            <label htmlFor="favoriteMoments">Momentos favoritos:</label>
            <textarea
              id="favoriteMoments"
              rows="4"
              cols="50"
              onChange={handleChange}
              defaultValue={formData?.favoriteMoments || ""}
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Guardar
          </button>
        </form>

        {showSuccessMessage && (
          <div className={styles.successModal}>
            <div className={styles.successContent}>
              {!readingEntry ? (
                <p>📚 ¡Tu reading journal se ha agregado correctamente!</p>
              ) : (
                <p>📚 ¡Tu reading journal se ha actualizado correctamente!</p>
              )}
              <button onClick={getReading}>Aceptar</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
