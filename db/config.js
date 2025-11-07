require("dotenv").config();
const mongoose=require('mongoose')

const ConnectDB=async()=>{
    try {
     const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}



// Event listeners
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error(" MongoDB connection error:", err.message);
});

mongoose.connection.once("open", () => {
  console.log("Database connection open");
});


module.exports=ConnectDB