import axios from "axios";

const API = axios.create({
  baseURL: "https://knox-backend-2.onrender.com/api/character",
  withCredentials: true,
});

export const getAllCharacters = () => API.get("/");
export const deleteCharacter = (id) => API.delete(`/${id}`);
export const getCharacterById = (id) => API.get(`/${id}`);

