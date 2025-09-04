export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  if (process.env.NODE_ENV === 'development') {
    return res.status(status).json({ error: err.message, stack: err.stack });
  }
  return res.status(status).json({ error: err.message || 'Internal Server Error' });
};
