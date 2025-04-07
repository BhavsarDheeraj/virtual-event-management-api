const app = require('./app')
const dotenv = require('dotenv');
const connectDB = require('./config/db');
dotenv.config();


const run = () => {
    connectDB().then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    }).catch((err) => {
        console.log(err);
    });
}

run();
