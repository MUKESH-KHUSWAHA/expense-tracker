import api from "./api.js";

export const changePassword = async (oldPassword, newPassword) => {
  return await api.put("/users/change-password", { oldPassword, newPassword });
};

