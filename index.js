const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");

const subscriptionRouters = require("./routes/subscriptionRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/subscriptions",subscriptionRouters);
app.use("/api/auth", authRoutes);

const PORT =process.env.PORT || 5000;

app.listen(PORT,() =>{
    console.log(`server running on port ${PORT}`);
});