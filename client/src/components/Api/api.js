import axios from "axios";
// import { url } from "../../const";

const url = "http://localhost:8000";

function generateRandomId() {
  // Thực hiện logic sinh số ngẫu nhiên ở đây
  return Math.floor(Math.random() * 1000000).toString();
}

export const getListData = async (setData, setError, setLoading) => {
  try {
    const response = await axios.get(`${url}/get`);
    if (response.status !== 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = response.data;
    if (result.success) {
      setData(result.data);
    } else {
      setError(result.error);
    }
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

export const uploadFile = (data) => {
  axios
    .post(`${url}/upload`, data)
    .then((response) => {
      console.log(response);
    })
    .catch((e) => {
      console.log(e);
    });
};

export const addData = (formData) => {
  if (!formData.FirstName) return;
  const formatData = { ...formData, Id: generateRandomId() };
  axios
    .post(`${url}/add`, formatData)
    .then((response) => {
      console.log(response);
    })
    .catch((e) => {
      console.log(e);
    });
};

export const updateData = (formData) => {
  axios
    .put(`${url}/update`, formData)
    .then((response) => {
      console.log(response);
    })
    .catch((e) => {
      console.log(e);
    });
};

export const deleteData = (formData) => {
  axios
    .delete(`${url}/delete/${formData.Id}`, formData)
    .then((response) => {
      console.log(response);
    })
    .catch((e) => {
      console.log(e);
    });
};
