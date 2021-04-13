exports.uploadToS3 = (req, res) => {

  if(req.error) {
    return res.json({ error: req.error });
  }

  res.json(req.files);
};
