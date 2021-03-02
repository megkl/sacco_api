const express = require("express");
const mongoose = require("mongoose")
const app = express()
const port = process.env.port || 5000

mongoose.connect("mongodb+srv://magdaline:VmWZL4LaEoWs2hth@cluster0.djacw.mongodb.net/sacco_loan_app_test?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
const connection = mongoose.connection;
connection.once("open", ()=>{
    console.log("MongoDb connected");
})

//middleware
app.use("/uploads", express.static("uploads"));
app.use(express.json());
const userRoute = require("./routes/user");
app.use("/user", userRoute);
const profileRoute = require("./routes/profile");
app.use("/profile", profileRoute);
const productRoute = require("./routes/product");
app.use("/product", productRoute);

data = "Welcome to mimi na wewe sacco"
  
app.route("/").get((req, res)=>res.json(data));

app.listen(port,()=> console.log("Your server is running on port ${port}"));