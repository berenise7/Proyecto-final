import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/core/contexts/AuthContext";
import styles from "./EditProfileFormik.module.css";
import { updateProfileFetch } from "@/api/usersFetch";

export default function EditProfileFormik() {
  const { user, setUser, setToken } = useAuth();
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(user?.photo || "");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [error, setError] = useState("");
  const [userState, setUserState] = useState({
    name: "",
    lastname: "",
    phone: "",
    address: "",
    email: "",
    birthday: "",
    rol: "",
    favoritesGenres: [],
    photo: "",
  });

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token && !user) {
      router.push("/user/login"); // Redirige al login si no está autenticado
    } else {
      setIsAuth(true);
    }
  }, [router, user]);

  useEffect(() => {
    if (user?.photo) {
      setSelectedImage(user.photo);
    }
  }, [user]);

  useEffect(() => {
    const storedUser =
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(sessionStorage.getItem("user"));
    if (storedUser) {
      setUserState({
        ...storedUser,
        birthday: storedUser.birthday
          ? storedUser.birthday.split("T")[0] // Extrae solo la parte `YYYY-MM-DD`
          : "", // Evita errores si la fecha es null o undefined
      });
    }
  }, []);

  if (!isAuth) {
    return <p>Cargando...</p>; // Muestra un mensaje mientras se verifica el login
  }

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

  const handleGenreChange = (e) => {
    const { value, checked } = e.target;
    setUserState((prev) => {
      const newGenres = checked
        ? [...prev.favoritesGenres, value] // Agrega el género si está seleccionado
        : prev.favoritesGenres.filter((genre) => genre !== value); // Lo quita si está desmarcado

      return { ...prev, favoritesGenres: newGenres };
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Función para actualizar los datos del usuario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Agregamos los datos del formulario
    Object.keys(userState).forEach((key) => {
      if (Array.isArray(userState[key])) {
        userState[key].forEach((value) => {
          formDataToSend.append(key, value);
        });
      } else {
        formDataToSend.append(key, userState[key]);
      }
    });

    // Si el usuario ha cambiado la imagen, la agregamos a FormData
    if (imageFile) {
      formDataToSend.append("file", imageFile);
    }

    const response = await updateProfileFetch(formDataToSend);
    if (response.error) {
      setError(response.error);
      return;
    }
    console.log(response);

    if (response.status === "Succeeded") {
      setUser(response.data.data);
      setToken(response.data.token);
      if (localStorage.getItem("token")) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data));
      } else {
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("user", JSON.stringify(response.data.data));
      }
    }

    setShowSuccessMessage(true);
  };
  // Lista de géneros para seleccionar
  const genres = ["Romance", "Fantasía", "Thriller", "Drama", "Terror"];

  return user ? (
    <div className={styles.formContainer}>
      <a className="back" onClick={goBack}>
        <FontAwesomeIcon icon={faChevronLeft} /> Volver atras
      </a>
      <h2 className={styles.formTitle}>Editar Perfil</h2>

      <form className={styles.formGridContainer} onSubmit={handleSubmit}>
        <div className={styles.formGrid2}>
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              name="name"
              className={styles.input}
              disabled={!isEditing}
              value={userState.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Apellido:</label>
            <input
              type="text"
              name="lastname"
              className={styles.input}
              disabled={!isEditing}
              value={userState.lastname}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Correo:</label>
            <input
              type="email"
              name="email"
              className={styles.input}
              disabled={!isEditing}
              value={userState.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Dirección:</label>
            <input
              type="text"
              name="address"
              className={styles.input}
              disabled={!isEditing}
              value={userState.address}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Teléfono:</label>
            <input
              type="text"
              name="phone"
              className={styles.input}
              disabled={!isEditing}
              value={userState.phone}
              onChange={handleChange}
            />
          </div>
          {/* <div>
                <label htmlFor="password">Contraseña:</label>
                <div className={styles.passwordContainer}>
                  <input
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
             
              </div> */}
        </div>
        <div className={styles.formGrid3}>
          <div>
            <label htmlFor="birthday">Fecha de nacimiento:</label>
            <input
              type="date"
              name="birthday"
              className={styles.input}
              disabled={!isEditing}
              value={userState.birthday}
              onChange={handleChange}
            />
          </div>

          {user.rol === "admin" ? (
            <div>
              <label htmlFor="rol">Rol:</label>
              <select
                name="rol"
                className={styles.input}
                disabled={!isEditing}
                value={userState.rol}
                onChange={handleChange}
              >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          ) : (
            ""
          )}

          <div>
            <label htmlFor="favoritesGenres">Géneros favoritos:</label>
            <div className={styles.checkboxGroup}>
              <div className={styles.checkboxColumn}>
                {genres.map((genre) => (
                  <label key={genre}>
                    <input
                      type="checkbox"
                      value={genre}
                      onChange={handleGenreChange}
                      checked={
                        userState.favoritesGenres?.includes(genre) || false
                      }
                    />
                    {genre}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.photoContainer}>
            <div className={styles.photoInput}>
              {selectedImage ? (
                <div className={styles.imagePreview}>
                  <img
                    src={selectedImage || userState.photo || null}
                    alt="Selected"
                  />
                </div>
              ) : (
                <label htmlFor="photo">
                  <img
                    src={selectedImage || userState.photo || null}
                    className={styles.imagePreview}
                  />
                </label>
              )}
              <input
                type="file"
                name="photo"
                id="photo"
                className={styles.hiddenInput}
                onChange={handleImageChange}
                disabled={!isEditing}
              />
            </div>
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
      </form>

      {showSuccessMessage && (
        <div className={styles.successModal}>
          <div className={styles.successContent}>
            <p>¡Tus datos se han actualizado correctamente!</p>
            <button onClick={() => router.reload()}>Aceptar</button>
          </div>
        </div>
      )}
    </div>
  ) : (
    <p>Cargando...</p>
  );
}
