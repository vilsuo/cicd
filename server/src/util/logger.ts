export const info = (...params: Array<unknown>) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params);
  }
};

export const error = (...params: Array<unknown>) => {
  console.log(...params);
};
