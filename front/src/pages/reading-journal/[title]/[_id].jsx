import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getBook } from "@/api/booksFetch";
import reading from "@/api/reading";
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
import { createJournal, getJournal } from "@/api/journalFetch";

export default function readingJournal() {
  const router = useRouter();
  //   Buscar el producto por su id
  const { _id } = router.query;

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

  const storedUser =
    typeof window !== "undefined" &&
    (localStorage.getItem("user") || sessionStorage.getItem("user"));
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Buscar el producto por su id
  useEffect(() => {
    if (!_id || !user) return;
    if (!user) {
      router.push("/user/login");
    }
    const loadBook = async () => {
      const bookAux = await getBook(_id);
      setBook(bookAux.data);

      const journalAux = await getJournal(user._id, _id);
      console.log(journalAux);

      if (journalAux) {
        setReadingEntry(journalAux);
        console.log(readingEntry);

        setFormData(journalAux);
        setRatings({
          rating: journalAux.rating || 0,
          romantic: journalAux.romantic || 0,
          happy: journalAux.happy || 0,
          sad: journalAux.sad || 0,
          spicy: journalAux.spicy || 0,
          plot: journalAux.plot || 0,
        });
      }
    };

    loadBook();
  }, [_id]);

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

  const handleStarClick = (category) => (index) => {
    setRatings((prevRatings) => {
      // Si el índice ya es igual al rating actual de la categoría, lo reseteamos a 0
      const currentRating = prevRatings[category];
      const newRating = currentRating === index + 1 ? 0 : index + 1;

      return {
        ...prevRatings, // Conserva las demás categorías
        [category]: newRating, // Solo actualiza la categoría correspondiente
      };
    });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("bookId", _id);
    formDataToSend.append("userId", user._id);

    // Añadimos el formData
    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((value) => {
          formDataToSend.append(key, value);
        });
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Añadimos los ratings
    Object.keys(ratings).forEach((key) => {
      formDataToSend.append(key, ratings[key]);
    });

    const result = await createJournal(formDataToSend); // Asegúrate que createJournal acepte FormData
    if (result.error) {
      alert("Error: " + result.error);
    } else {
      setShowSuccessMessage(true);
    }

    // Una vez guardado se vuelve a cargar el reading journal
    const journalAux = await getJournal(user._id, _id);
    if (journalAux) {
      setReadingEntry(journalAux);
      setFormData(journalAux);
      setRatings({
        rating: journalAux.rating || 0,
        romantic: journalAux.romantic || 0,
        happy: journalAux.happy || 0,
        sad: journalAux.sad || 0,
        spicy: journalAux.spicy || 0,
        plot: journalAux.plot || 0,
      });
    }
  };

  const getReading = async () => {
    setShowSuccessMessage(false);

    const journalAux = await getJournal(user._id, _id);
    if (journalAux) {
      setReadingEntry(journalAux);
      setFormData(journalAux);
      setRatings({
        rating: journalAux.rating || 0,
        romantic: journalAux.romantic || 0,
        happy: journalAux.happy || 0,
        sad: journalAux.sad || 0,
        spicy: journalAux.spicy || 0,
        plot: journalAux.plot || 0,
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
                  src={
                    readingEntry && readingEntry.data?.image
                      ? readingEntry.data?.image
                      : book?.image
                  }
                  alt={
                    readingEntry && readingEntry.data?.image
                      ? readingEntry.data?.image
                      : book?.title
                  }
                  className={styles.image}
                />
              </div>
              <div className={styles.ratingContainer}>
                {/* Ignoramos el primer valor, por eso usamos _ */}
                {[...Array(5)].map((_, index) => (
                  <FontAwesomeIcon
                    key={index}
                    icon={
                      index + 1 <=
                      (readingEntry && readingEntry.data?.rating
                        ? readingEntry.data?.rating
                        : ratings.rating)
                        ? faStarSolid
                        : faStarRegular
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
                value={
                  readingEntry && readingEntry.data?.title
                    ? readingEntry.data?.title
                    : book?.title
                }
                readOnly
              />
              <label htmlFor="author">Autor</label>
              <input
                type="text"
                id="author"
                value={
                  readingEntry && readingEntry.data?.author
                    ? readingEntry.data?.author
                    : book?.author
                }
                readOnly
              />
              <div className={styles.bookProgressInfo}>
                <div>
                  <label htmlFor="pages">Paginas:</label>
                  <input
                    type="number"
                    id="pages"
                    onChange={handleChange}
                    value={
                      readingEntry && readingEntry.data?.pages
                        ? readingEntry.data?.pages
                        : formData?.pages || ""
                    }
                  />
                </div>
                <div>
                  <label htmlFor="start_date">Inicio:</label>
                  <input
                    type="date"
                    id="start_date"
                    onChange={handleChange}
                    value={
                      readingEntry && readingEntry.data?.start_date
                        ? new Date(readingEntry.data?.start_date)
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
                    value={
                      readingEntry && readingEntry.data?.end_date
                        ? new Date(readingEntry.data?.end_date)
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
                        index + 1 <=
                        (readingEntry && readingEntry.data?.romantic
                          ? readingEntry.data?.romantic
                          : ratings.romantic)
                          ? faHeartSolid
                          : faHeartRegular
                      } // Si el índice es menor que la calificación, usa la estrella rellena
                      onClick={() => handleStarClick("romantic")(index)} // Actualiza el rating al hacer clic
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
                        index + 1 <=
                        (readingEntry && readingEntry.data?.happy
                          ? readingEntry.data?.happy
                          : ratings.happy)
                          ? faFaceSmileSolid
                          : faFaceSmileRegular
                      } // Si el índice es menor que la calificación, usa la estrella rellena
                      onClick={() => handleStarClick("happy")(index)} // Actualiza el rating al hacer clic
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
                        index + 1 <=
                        (readingEntry && readingEntry.data?.sad
                          ? readingEntry.data?.sad
                          : ratings.sad)
                          ? faFaceSadTearSolid
                          : faFaceSadTearRegular
                      } // Si el índice es menor que la calificación, usa la estrella rellena
                      onClick={() => handleStarClick("sad")(index)} // Actualiza el rating al hacer clic
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
                    index + 1 <=
                    (readingEntry && readingEntry.data?.spicy
                      ? readingEntry.data?.spicy
                      : ratings.spicy) ? (
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
                        index + 1 <=
                        (readingEntry && readingEntry.data?.plot
                          ? readingEntry.data?.plot
                          : ratings.plot)
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
                value={
                  readingEntry && readingEntry.data?.format
                    ? readingEntry.data?.format
                    : formData?.format || ""
                }
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
                value={
                  readingEntry && readingEntry.data?.type
                    ? readingEntry.data?.type
                    : formData?.type || ""
                }
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
                value={
                  readingEntry && readingEntry.data?.playlist
                    ? readingEntry.data?.playlist
                    : formData?.playlist || ""
                }
              />
            </div>
          </div>

          <div>
            <label htmlFor="characters">Personajes:</label>
            <input
              type="text"
              id="characters"
              onChange={handleChange}
              value={
                readingEntry && readingEntry.data?.characters
                  ? readingEntry.data?.characters
                  : formData?.characters || ""
              }
            />
          </div>

          <div>
            <label htmlFor="favoriteMoments">Momentos favoritos:</label>
            <textarea
              id="favoriteMoments"
              rows="4"
              cols="50"
              onChange={handleChange}
              value={
                readingEntry && readingEntry.data?.favoriteMoments
                  ? readingEntry.data?.favoriteMoments
                  : formData?.favoriteMoments || ""
              }
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Guardar
          </button>
        </form>

        {showSuccessMessage && (
          <div className={styles.successModal}>
            <div className={styles.successContent}>
              <p>📚 ¡Tu reading journal se ha agregado correctamente!</p>
              <button onClick={getReading}>Aceptar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
