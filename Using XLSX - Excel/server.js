const cors = require('cors');
const fileUpload = require('express-fileupload');
const route = require('./route')
const express = require('express');
const PORT = process.env.PORT || 2423

const app = express();

app.use(express.json());
app.use(cors({
    origin: "*"
}))
app.use(fileUpload({ 
    useTempFiles: true
}))
app.use('/uploads', express.static('uploads'));
app.use('/lesson', route)


app.get('/', (req, res)=>{
    res.send('Welcome, Let us use excel to send Messages to different email Addresses!')
})

app.listen(PORT, ()=>{
    console.log('listening on PORT: '+PORT);
});