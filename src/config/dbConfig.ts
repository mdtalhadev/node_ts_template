import {connect } from 'mongoose';
import env from 'dotenv';

export const connectDB = async ()=>{
    try {
        await connect(process.env.DB_URL!,);
        console.log('Connected to DB');
    } catch (error) {
        console.log('Error connecting to DB', error);
    }
}