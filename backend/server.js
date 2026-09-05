import dotenv from 'dotenv'
dotenv.config();

import app from './src/app.js';
import { connectDB } from './src/config/db.js';

const PORT = process.env.PORT || 5000;

const Server = async() => {
    try {
        await connectDB();
        app.listen(PORT, ()=>{
            console.log(`Server Running on port: ${PORT}`);
        });
    } catch (error) {
        console.log("Failed to Start Server", error.message);
        process.exit(1);
    };
};

Server();