export const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params);
  }
};

export const error = (...params) => {
  console.log(...params);
};
