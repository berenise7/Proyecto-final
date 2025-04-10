import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/core/contexts/AuthContext";
import styles from "./myData.module.css";
import { updateProfileFetch } from "@/api/usersFetch";
import HeaderAndSearch from "@/components/Header/HeaderAndSearch";

export default function MyData() {
  const { user, setUser, setToken } = useAuth();
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(user?.photo || "");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newShowPassword, setNewShowPassword] = useState(false);
  const [errorLastPassword, setErrorLastPassword] = useState("");
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
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwordState, setPasswordState] = useState({
    currentPassword: "",
    newPassword: "",
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
    setError("");
    setErrorLastPassword("");

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

    //Comprueba si uno de los campos esta vacio y el otro no da error
    if (
      showPasswordFields &&
      ((passwordState.newPassword && passwordState.currentPassword === "") ||
        (passwordState.newPassword === "" && passwordState.currentPassword))
    ) {
      setErrorLastPassword(
        "Para poder cambiar la contraseña es necesario completar los dos campos."
      );
      return;
    } else if (showPasswordFields && passwordState.newPassword) {
      // Si newPassword no cumple los requisitos da error
      if (
        !/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}/.test(
          passwordState.newPassword
        )
      ) {
        setErrorLastPassword(
          "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial."
        );
        return;
      }
      formDataToSend.append("currentPassword", passwordState.currentPassword);
      formDataToSend.append("newPassword", passwordState.newPassword);
    }

    const response = await updateProfileFetch(formDataToSend);
    console.log(response);

    if (response.error) {
      if (response.error?.includes("contraseña")) {
        setErrorLastPassword(response.error);
      } else {
        setError(response.error);
      }
      return;
    }

    if (response.status === "Succeeded") {
      setUser(response.data.data);
      if (localStorage.getItem("token")) {
        setToken(response.data.token_refresh);
        localStorage.setItem("token", response.data.token_refresh);
        localStorage.setItem("user", JSON.stringify(response.data.data));
      } else {
        setToken(response.data.token);
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("user", JSON.stringify(response.data.data));
      }
    }

    setShowSuccessMessage(true);
  };
  // Lista de géneros para seleccionar
  const genres = ["Romance", "Fantasía", "Thriller", "Drama", "Terror"];
  return (
    <>
      <HeaderAndSearch />
      {user ? (
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
                  pattern="^[^@]+@[^@]+\.[^@]+$"
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
              <div className={styles.passwordSection}>
                <button
                  type="button"
                  className={
                    isEditing
                      ? styles.changePasswordButton
                      : styles.notChangePasswordButton
                  }
                  disabled={!isEditing}
                  onClick={() => setShowPasswordFields(!showPasswordFields)}
                >
                  {showPasswordFields ? "Cancelar" : "Cambiar Contraseña"}
                </button>

                {showPasswordFields && (
                  <div className={styles.passwordFields}>
                    <label>Contraseña Actual:</label>
                    <div className={styles.passwordContainer}>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="currentPassword"
                        className={styles.input}
                        value={passwordState.currentPassword}
                        onChange={(e) =>
                          setPasswordState({
                            ...passwordState,
                            currentPassword: e.target.value,
                          })
                        }
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

                    <label>Nueva Contraseña:</label>
                    <div className={styles.passwordContainer}>
                      <input
                        type={newShowPassword ? "text" : "password"}
                        name="newPassword"
                        className={styles.input}
                        value={passwordState.newPassword}
                        pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?\':{}|<>]).{8,}$"
                        title="La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial."
                        onChange={(e) =>
                          setPasswordState({
                            ...passwordState,
                            newPassword: e.target.value,
                          })
                        }
                      />
                      <div
                        className={styles.eyeIcon}
                        onClick={() => setNewShowPassword(!newShowPassword)} // Alterna la visibilidad
                      >
                        {newShowPassword ? (
                          <FontAwesomeIcon icon={faEyeSlash} size={20} /> // Ojo cerrado
                        ) : (
                          <FontAwesomeIcon icon={faEye} size={20} /> // Ojo abierto
                        )}
                      </div>
                    </div>
                    {errorLastPassword && (
                      <p style={{ color: "#59485b" }}>{errorLastPassword}</p>
                    )}
                  </div>
                )}
              </div>
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
                          disabled={!isEditing}
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
                  {error && <p style={{ color: "#59485b" }}>{error}</p>}
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
      )}
    </>
  );
}
