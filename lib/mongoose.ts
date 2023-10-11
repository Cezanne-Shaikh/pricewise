import mongoose from 'mongoose';

let isConnected =false;//Variable to track the connection status

export const connectToDB=async()=>{
    //to prevent unknown queries we make the mongoose to strict mode
    mongoose.set('strictQuery',true);

    if(!process.env.MONGODB_URI) return console.log('MONGODB_URI is not defined');//to check if we're connected or not

    if(isConnected) return console.log('=> using existing database connection');

    try {
        await mongoose.connect(process.env.MONGODB_URI);//if there is a DB then isConnected is true

        isConnected = true;

    console.log('MongoDB Connected');
    
    } catch (error) {
        console.log(error);
    }
}