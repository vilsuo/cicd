const unknownEndpoint = (req, res) => {
  return res.status(404).send({ message: 'Unknown endpoint' });
};

module.exports = unknownEndpoint;
