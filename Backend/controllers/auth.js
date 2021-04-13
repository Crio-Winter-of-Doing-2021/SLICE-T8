const { authenticateToS3, authenticateToDrive, authenticateToDigiMocker } = require("slicedoclib");


exports.authS3 = (req, res) => {
  const { accessKeyId, secretAccessKey, Bucket } = req.body;
  
  const callBack = (err, token) => {
	  if(err) {
		  return res.json({
			  error: err
		  })
	  } else {
		  return res.json({
			  token: token
		  })
	  }
  }

  authenticateToS3(accessKeyId, secretAccessKey, Bucket, callBack);
};

exports.authGoogleDrive = async (req, res) => {
  const file =  await authenticateToDrive(
	process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URIS,
    req.body.tokens
  )
    return res.send(file);
}

exports.authDigiMocker = async (req, res) => {
  const { email, password } = req.body;
  
  try {
	let data = await authenticateToDigiMocker(email, password)
	console.log('data is : ', data)
	if(data.message && data.message === 'Request failed with status code 400') {
		return res.json({
			error: 'Password is wrong'
		})
	} else if (data === 'Email not found') {
		return res.json({
			error: 'Email not found'
		})
	} else {
		return res.json({
			token: data
		})
	}
  } catch (error) {
	return res.json({
		error: error.message
	})
  }
}
