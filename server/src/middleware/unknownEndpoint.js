const unknownEndpoint = (req, res) => res.status(404).send({
  message: 'Unknown endpoint',
});

module.exports = unknownEndpoint;
