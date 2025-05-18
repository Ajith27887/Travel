import express from "express";
import dotenv from 'dotenv';
import userroute from "./routes/user.js"
import destinationrouter from "./routes/destination.js"
import connectDB from "./db.js";
import errorhandler from "./middleware/errorhandler.js";

const app = express();

dotenv.config();
await connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//User 
app.use("/api/user", userroute);
app.use("/api/destinations", destinationrouter);

//errhandler
app.use(errorhandler);

//Common Error
app.use((req,res,next) => {
	try {
		res.status(404).json({ msg : "Wrong URL"})
	} catch (error) {
		next(error)
	}
}) 

// Add 404 handler
app.use((req, res) => {
    res.status(404).json({ msg: "Route not found" });
});

app.listen(process.env.PORT, () => console.log(`port is connected ${process.env.PORT}`))

