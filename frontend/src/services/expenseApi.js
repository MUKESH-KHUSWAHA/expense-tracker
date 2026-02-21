import api from "./api.js";

export const getExpenses = async () => {
  return await api.get("/expenses");
};

export const createExpense = async (data) => {
  return await api.post("/expenses", data);
};

export const deleteExpense = async (id) => {
  return await api.delete(`/expenses/${id}`);
};

export const updateExpense = async (id, data) => {
  return await api.put(`/expenses/${id}`, data);
};

export default api;
