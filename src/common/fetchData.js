import axios from "axios";

const fetchData = async (method, url, header, body) => {
  return await axios({
    method: method,
    url: url,
    headers: {
      "Content-Type": "application/json",
      ...header,
    },
    data: body,
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

export default fetchData;
