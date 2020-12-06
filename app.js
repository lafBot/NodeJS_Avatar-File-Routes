const express = require('express');
fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');

const app = express();

app.use(fileUpload({
    createParentPath: true
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(morgan('dev'));


app.post('/upload-avatar', async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            })
        } else {
            let avatar = req.files.avatar;

            // place file into upload directory
            avatar.mv('./uploads/' + avatar.name);
        }

        // send response
        res.send({
            status: true,
            message: 'File is uploaded',
            data: {
                name: avatar.name,
                mimetype: avatar.mimetype,
                size: avatar.size
            }
        });
    } catch (err) {
        res.status(500).send(err);
    }
})

app.post('/upload-photos', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            })
        } else {
            let data = [];

            // loop all files
            _.forEach(_.keysIn(req.files.photos), (key) => {
                let photo = req.files.photos[key];

                // move photo to uploads directory
                photo.mv('./uploads/' + photo.name);

                // push file details
                data.push({
                    name: photo.name,
                    mimetype: photo.mimetype,
                    size: photo.size
                });
            });

            // return response
            res.send({
                status: true,
                message: 'Files are uploaded',
                data:data
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});





const port = process.env.PORT || 3000;

app.listen(port, () =>
    console.log(`App is listening on port ${port}`)
);