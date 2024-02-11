import axios from 'axios';

const BASE_URL = '/api/notes';

const getNotes = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

const getNote = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

const postNote = async (values) => {
  const response = await axios.post(BASE_URL, values);
  return response.data;
};

export default {
  getNotes,
  getNote,
  postNote,
};

