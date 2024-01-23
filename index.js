const express = require("express");
const { connection } = require("./configs/db");
const { UserModel } = require("./model/User.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { appoitmentRouter } = require("./routes/appoitment.routes");
const { dashboardRouter } = require("./routes/dashboard.routes");
const { AppoitmentModel } = require("./model/appoitment.model");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "API is working for more kindly refer the docs" });
});

app.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user_already_exist = await UserModel.findOne({ email });

        if (user_already_exist) {
            return res.status(400).json({ message: "User Already exists, please login" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.create({ email, password: hashedPassword });

        res.json({ message: "Signup successful" });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.json({ message: "Please Signup first" });
        }

        const hashed_password = user.password;

        bcrypt.compare(password, hashed_password, function (err, result) {
            if (result) {
                const token = jwt.sign({ email: user.email }, '123', { expiresIn: '1h' });
                res.json({ message: "Login successful", token });
                localStorage.setItem("mytoken",token);
            } else {
                alert("Invalid Credentials")
                res.json({ message: "Invalid credential, login failed!" });
            }
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.use("/appoitments",appoitmentRouter)

app.use("/dashboard",dashboardRouter)







app.get('/getFilteredAppointments', async (req, res) => {
    try {
      let query = {};
  
      if (req.query.specialization) {
        query.specialization = req.query.specialization;
      }
  
      let sortQuery = { date: 1 }; 
  
      if (req.query.sortByDate && req.query.sortByDate.toLowerCase() === 'desc') {
        sortQuery = { date: -1 }; 
      }
  
      const appointments = await AppoitmentModel.find(query).sort(sortQuery);
  
      res.status(200).json(appointments);
    } catch (error) {
      console.error('Error fetching filtered appointments:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


app.listen(8080, async () => {
    try {
        await connection;
        console.log("Database connected successfully!");
    } catch (error) {
        console.log("Error connecting to the database:", error);
    }
    console.log("App is listening on port no 8080");
});
