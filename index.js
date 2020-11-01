const express = require("express");
const bodyParser = require('body-parser');
const multer = require('multer');
const axios = require('axios'); // HTTP client
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const { getImageDataFromResults } = require('./utils');

const app = express();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage, limits: { fileSize: 4000000 } }).single('image');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(express.static('./public'));
app.use('/uploads', express.static('./uploads'))
app.use('/tmp', express.static('/tmp'))

app.post('/find-image', (req, res) => {
  upload(req, res, async function (err) {
    // check for error
    if (err || req.file === undefined) {
      console.log(err);
      res.status(400);
      res.send("Some error occured")
    } else {
      let form = new FormData();

      form.append('organs', 'flower');
      form.append('images', fs.createReadStream(req.file.path));

      // everything worked fine
      console.log(req.file);
      console.log('image done');

      try {
        const { status, data } = await axios.post(
          'https://my-api.plantnet.org/v2/identify/all?api-key=2a10NFrcMiB2xCpxBQF4rxEe',
          form,
          {
            headers: form.getHeaders()
          }
        );

        if (status === 200 && data) {
          console.log(data.results)
          const response = getImageDataFromResults(data.results);
          res.send({ filePath: req.file.path, data: response });
        } else {
          res.send({ filePath: req.file.path });
        }
      } catch (error) {
        console.error('error', error);
        res.status(400);
        res.send("Some error occurred");
      }
    }
  })
});

app.get('/', (req, res) => {
  res.sendFile("index.html");
});


app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port 3000");
});