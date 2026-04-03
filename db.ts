import mongoose from "mongoose";

let isConnected = false;

const connectDb = async () => {
    if(isConnected){
        console.log("Already connected to mongodb")
        return
    }

    if(!process.env.MONGODB_URI){
        throw new Error('Mongodb url env is not defined')
    }

    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI,{ bufferCommands: false})
    } catch (error) {
        console.log("Error connecting to mongodb" , error)
        throw error
    }
}

mongoose.connection.on('connected' , () => {
    isConnected = true;
    console.log("Connected to mongoDb")
})

mongoose.connection.on('disconnected' , () => {
    isConnected = false
    console.log("Disconnected from mongoDb")
})

mongoose.connection.on('error' , (error) => {
    isConnected = false
    console.log('Mongose connection error' , error)
})

export default connectDb