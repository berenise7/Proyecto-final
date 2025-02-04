import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faStarHalfAlt,
  faStar as faStarEmpty,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./StarRating.module.css";

export default function StartRating({rating}) {
  const maxStars = 5;
  const fullStars = Math.floor(rating); // Estrellas llenas
  const hasHalfStar = rating % 1 !== 0; // Media estrella
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0); // Estrellas vacías
  return (
    <div className={styles.stars}>
      {/* Estrellas llenas */}
      {[...Array(fullStars)].map((_, index) => (
        <FontAwesomeIcon
          key={index}
          icon={faStar}
          className={styles.starFull}
        />
      ))}
      {/* Media estrella */}
      {hasHalfStar && (
        <FontAwesomeIcon icon={faStarHalfAlt} className={styles.starHalf} />
      )}
      {/* Estrellas vacías */}
      {[...Array(emptyStars)].map((_, index) => (
        <FontAwesomeIcon
          key={index}
          icon={faStarEmpty}
          className={styles.starEmpty}
        />
      ))}
    </div>
  );
}
