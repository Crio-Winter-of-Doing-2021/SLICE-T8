const axios = require("axios");

exports.authenticateToDigiMocker = async (email, password) => {
  try {
    let response = await axios.post(
      "https://digimocker.herokuapp.com/api/user/login",
      {
        email: email,
        password: password,
      }
    );
	return response.data;
  } catch (err) {
    return err;
  }
};

exports.getDocsFromMocker = async (email, token) => {
  const response = await axios.post(
    "https://digimocker.herokuapp.com/api/docs",
    {
      email: email,
    },
    {
      headers: {
        "auth-token": token,
      },
    }
  );

  return response.data;
};

exports.getSpecificDocsFromMocker = async (name, email, token) => {
  const response = await axios.post(
    `https://digimocker.herokuapp.com/api/docs/${name}`,
    {
      email: email,
    },
    {
      headers: {
        "auth-token": token,
      },
    }
  );

  return response.data;
};
