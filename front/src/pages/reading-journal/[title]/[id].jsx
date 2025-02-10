import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header/Header";
import products from "@/api/productos";
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
export default function readingJournal() {
  const router = useRouter();
  //   Buscar el producto por su id
  const { title, id } = router.query;

  const [product, setProduct] = useState(null);
  const [readingEntry, setReadingEntry] = useState(null);
  const [ratings, setRatings] = useState({
    rating: 0,
    romantic: 0,
    happy: 0,
    cry: 0,
    spicy: 0,
    plot: 0,
  });

  useEffect(() => {
    // Buscar el producto por su id
    const foundProduct = products.find((p) => p.id === id);
    setProduct(foundProduct);

    // Buscar el reading entry relacionado con el product
    const foundReading = reading.find((r) => r.book_id === id);
    setReadingEntry(foundReading);
  }, [id]);

  useEffect(() => {
    if (readingEntry) {
      setRatings((prevRatings) => ({
        ...prevRatings,
        rating: readingEntry.rating ?? prevRatings.rating,
        romantic: readingEntry.romantic ?? prevRatings.romantic,
        happy: readingEntry.happy ?? prevRatings.happy,
        cry: readingEntry.cry ?? prevRatings.cry,
        spicy: readingEntry.spicy ?? prevRatings.spicy,
        plot: readingEntry.plot ?? prevRatings.plot,
      }));
    }
  }, [readingEntry]);

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

  // Si no se encuentra el producto
  if (!product) {
    return (
      <div>
        <Header />
        <p>Producto no encontrado</p>
      </div>
    );
  }
  return (
    <div>
      <Header />
      <div className={styles.container}>
        <a className="link" onClick={goBack}>
          <FontAwesomeIcon icon={faChevronLeft} /> Volver atras
        </a>

        {/* Aquí empieza el formulario */}
        <form className={styles.form}>
          <div className={styles.titleContainer}>
            <div>
              <div className={styles.imageContainer}>
                <img
                  src={product.image}
                  alt={product.title}
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
            <div>
              <h2 className={styles.title}>Lectura Terminada</h2>
              <label htmlFor="title">Titulo</label>
              <input type="text" value={product.title} readOnly />
              <label htmlFor="author">Autor</label>
              <input type="text" value={product.author} readOnly />
              <label>Paginas:</label>
              <input
                type="number"
                defaultValue={readingEntry ? readingEntry.pages : ""}
              />
            </div>
          </div>
          <div className={styles.ratings}>
            <div>
              <label>Romance:</label>
              {/* Ignoramos el primer valor, por eso usamos _ */}
              {[...Array(5)].map((_, index) => (
                <FontAwesomeIcon
                  key={index}
                  icon={
                    index + 1 <= ratings.romantic
                      ? faHeartSolid
                      : faHeartRegular
                  } // Si el índice es menor que la calificación, usa la estrella rellena
                  onClick={() => handleStarClick("romantic")(index)} // Actualiza el rating al hacer clic
                  style={{ cursor: "pointer", margin: "0 5px" }}
                />
              ))}
            </div>
            <div>
              <label>Gracioso:</label>
              {/* Ignoramos el primer valor, por eso usamos _ */}
              {[...Array(5)].map((_, index) => (
                <FontAwesomeIcon
                  key={index}
                  icon={
                    index + 1 <= ratings.happy
                      ? faFaceSmileSolid
                      : faFaceSmileRegular
                  } // Si el índice es menor que la calificación, usa la estrella rellena
                  onClick={() => handleStarClick("happy")(index)} // Actualiza el rating al hacer clic
                  style={{ cursor: "pointer", margin: "0 5px" }}
                />
              ))}
            </div>
            <div>
              <label>Triste:</label>
              {/* Ignoramos el primer valor, por eso usamos _ */}
              {[...Array(5)].map((_, index) => (
                <FontAwesomeIcon
                  key={index}
                  icon={
                    index + 1 <= ratings.cry
                      ? faFaceSadTearSolid
                      : faFaceSadTearRegular
                  } // Si el índice es menor que la calificación, usa la estrella rellena
                  onClick={() => handleStarClick("cry")(index)} // Actualiza el rating al hacer clic
                  style={{ cursor: "pointer", margin: "0 5px" }}
                />
              ))}
            </div>
            <div>
              <label>Spicy:</label>
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
            <div>
              <label>Plot twist:</label>
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

          <label>Inicio:</label>
          <input
            type="date"
            defaultValue={readingEntry ? readingEntry.startDate : ""}
          />

          <label>Fin:</label>
          <input
            type="date"
            defaultValue={readingEntry ? readingEntry.endDate : ""}
          />

          <label>Formato:</label>
          <input
            type="text"
            defaultValue={readingEntry ? readingEntry.format : ""}
          />

          <label>Tipo:</label>
          <input
            type="text"
            defaultValue={readingEntry ? readingEntry.type : ""}
          />

          <label>Personajes:</label>
          <input
            type="text"
            defaultValue={
              readingEntry ? readingEntry.characters.join(", ") : ""
            }
          />

          <label>Playlist:</label>
          <input
            type="text"
            defaultValue={readingEntry ? readingEntry.playlist.join(", ") : ""}
          />

          <label>Momentos favoritos:</label>
          <input
            type="text"
            defaultValue={
              readingEntry ? readingEntry.favoriteMoments.join(", ") : ""
            }
          />

          {/* Aquí puedes agregar más campos según sea necesario */}
        </form>
      </div>
    </div>
  );
}
