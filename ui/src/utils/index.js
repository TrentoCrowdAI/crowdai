const flattenError = error => {
  if (error.response && error.response.data) {
    return error.response.data.payload || error.response.data;
  }
  return error;
};

export {flattenError};
