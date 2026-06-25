import axios from 'axios';

const API_URL = 'https://promblempilot.onrender.com/api/problems';

export const getProblems = () => axios.get(API_URL);
export const getProblem = (id) => axios.get(`${API_URL}/${id}`);
export const createProblem = (problemData) => axios.post(API_URL, problemData);
export const updateProblem = (id, problemData) => axios.put(`${API_URL}/${id}`, problemData);
export const deleteProblem = (id) => axios.delete(`${API_URL}/${id}`);