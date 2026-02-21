import api from "./api.js";

export const loginUser = async (email, password) => {
  return await api.post("/auth/login", { email, password });
};

export const registerUser = async (name, email, password) => {
  return await api.post("/auth/register", { name, email, password });
};
