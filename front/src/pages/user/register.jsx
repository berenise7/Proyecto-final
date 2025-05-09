import HeaderAndSearch from "@/components/Header/HeaderAndSearch";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./register.module.css";
import { registerUser } from "@/api/usersFetch";
import { useAuth } from "@/core/contexts/AuthContext";
import Footer from "@/components/Footer/Footer";

export default function register() {
  const router = useRouter();
  const { setUser, setToken } = useAuth();
  const [showGenres, setShowGenres] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorsFields, setErrorsFields] = useState({});
  const [errorEmail, setErrorEmail] = useState("");
  const [dontMatchEmail, setDontMatchEmail] = useState("");
  const [dontMatchPassword, setDontMatchPassword] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const initialFormData = {
    name: "",
    lastname: "",
    phone: "",
    address: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    birthday: "",
    favoritesGenres: [],
  };
  const [formData, setFormData] = useState(initialFormData);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!formData.lastname.trim())
      newErrors.lastname = "El apellido es obligatorio";
    if (!formData.phone.trim()) newErrors.phone = "El teléfono es obligatorio";
    if (!formData.address.trim())
      newErrors.address = "La direccion es obligatoria";
    if (!formData.email) newErrors.email = "El email es obligatorio";
    if (!formData.confirmEmail)
      newErrors.confirmEmail = "Debes confirmar tu correo";
    if (!formData.password)
      newErrors.password = "La contraseña es obligatoria.";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Debes confirmar tu contraseña";

    setErrorsFields(newErrors);
    return Object.keys(newErrors).length === 0;
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
    setErrorEmail("");
  };

  const handleGenreChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      favoritesGenres: checked
        ? [...prev.favoritesGenres, value]
        : prev.favoritesGenres.filter((genre) => genre !== value),
    }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const saveUser = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const sendData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (Array.isArray(formData[key])) {
          formData[key].forEach((value) => sendData.append(key, value));
        } else {
          sendData.append(key, formData[key]);
        }
      });

      if (imageFile) sendData.append("file", imageFile);

      const response = await registerUser(sendData);

      if (response.error?.includes("email")) {
        setErrorEmail(response.error);
        return;
      } else if (response.error?.includes("correos")) {
        setDontMatchEmail(response.error);
        return;
      } else if (response.error?.includes("contraseñas")) {
        setDontMatchPassword(response.error);
        return;
      } else if (response.error) {
        alert("Surgio un error");
        return;
      }
      if (response.status === "Succeeded") {
        setUser(response.data);
        setToken(response.token);

        sessionStorage.setItem("token", response.token);
        sessionStorage.setItem("user", JSON.stringify(response.data));
      }
      setShowSuccessMessage(true);
    }
  };

  const goBack = () => {
    router.back();
  };
  return (
    <div>
      <HeaderAndSearch />
      <div className={styles.formContainer}>
        <a className="back" onClick={goBack}>
          <FontAwesomeIcon icon={faChevronLeft} /> Volver atras
        </a>
        <h2 className={styles.formTitle}>Registro</h2>

        <form onSubmit={saveUser}>
          <div className={styles.formGridContainer}>
            <div className={styles.formGrid2}>
              <div>
                <label htmlFor="name">Nombre:</label>
                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  value={formData.name}
                  className={styles.input}
                  placeholder={
                    errorsFields.name
                      ? errorsFields.name
                      : "Introduce tu nombre"
                  }
                />
              </div>
              <div>
                <label htmlFor="lastname">Apellidos:</label>
                <input
                  type="text"
                  name="lastname"
                  onChange={handleChange}
                  value={formData.lastname}
                  className={styles.input}
                  placeholder={
                    errorsFields.lastname
                      ? errorsFields.lastname
                      : "Introduce tus apellidos"
                  }
                />
              </div>
              <div>
                <label htmlFor="phone">Teléfono:</label>
                <input
                  type="text"
                  name="phone"
                  onChange={handleChange}
                  value={formData.phone}
                  className={styles.input}
                  placeholder={
                    errorsFields.phone
                      ? errorsFields.phone
                      : "Introduce tu número de telefono"
                  }
                />
              </div>
              <div>
                <label htmlFor="address">Dirección:</label>
                <input
                  type="text"
                  name="address"
                  onChange={handleChange}
                  value={formData.address}
                  className={styles.input}
                  placeholder={
                    errorsFields.address
                      ? errorsFields.address
                      : "Introduce tu direccion"
                  }
                />
              </div>
              <div>
                <label htmlFor="email">Correo electrónico:</label>
                <input
                  type="text"
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                  className={styles.input}
                  placeholder={
                    errorsFields.email
                      ? errorsFields.email
                      : "Introduce tu correo electronico"
                  }
                  pattern="^[^@]+@[^@]+\.[^@]+$"
                  title="El email debe tener un formato válido con '@'."
                />
                {errorEmail && <p style={{ color: "#59485b" }}>{errorEmail}</p>}
                {dontMatchEmail && (
                  <p style={{ color: "#59485b" }}>{dontMatchEmail}</p>
                )}
              </div>
              <div>
                <label htmlFor="confirmEmail">
                  Confirmar correo electrónico:
                </label>
                <input
                  type="text"
                  name="confirmEmail"
                  onChange={handleChange}
                  value={formData.confirmEmail}
                  className={styles.input}
                  placeholder={
                    errorsFields.confirmEmail
                      ? errorsFields.confirmEmail
                      : "Confirma tu correo electronico"
                  }
                />
              </div>
              <div>
                <label htmlFor="password">Contraseña:</label>
                <div className={styles.passwordContainer}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    onChange={handleChange}
                    value={formData.password}
                    className={styles.input}
                    placeholder={
                      errorsFields.password
                        ? errorsFields.password
                        : "Introduce tu contraseña"
                    }
                    pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?\':{}|<>]).{8,}$"
                    title="La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial."
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
                {errorsFields.password && (
                  <p style={{ color: "#59485b" }}>{errorsFields.password}</p>
                )}
                {dontMatchPassword && (
                  <p style={{ color: "#59485b" }}>{dontMatchPassword}</p>
                )}
              </div>
              <div>
                <label htmlFor="confirmPassword">Confirmar contraseña:</label>
                <div className={styles.passwordContainer}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    onChange={handleChange}
                    value={formData.confirmPassword}
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
              </div>
            </div>
            <div className={styles.formGrid3}>
              <div>
                <label htmlFor="birthday">Fecha de nacicimiento:</label>
                <input
                  type="date"
                  name="birthday"
                  onChange={handleChange}
                  value={formData.birthday}
                  className={styles.input}
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
                            checked={formData.favoritesGenres.includes(genre)}
                          />
                          {genre}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
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
              ¿Ya tienes una cuenta?{" "}
              <Link href="/user/login">Inicia sesión</Link>
            </p>
          </div>
        </form>
        {showSuccessMessage && (
          <div className={styles.successModal}>
            <div className={styles.successContent}>
              <p>¡Se ha registrado correctamente!</p>
              <button onClick={() => router.push("/")}>Aceptar</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
