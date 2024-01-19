const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());

app.use(express.json());

const mongoUrl = "mongodb+srv://nrfznhnf:misterhan19@uasdpm.ellwpoi.mongodb.net/?retryWrites=true&w=majority";

const JWT_SECRET = "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jdsds039[]]pou89ywe";

mongoose.connect(mongoUrl).then(() => {
      console.log("Database Terhubung")
}).catch((e) => {
      console.log(e)
});

require('./Users')

const User = mongoose.model("Users")

require('./Task');
const Task = mongoose.model('Task');

app.get("/", (req, res) => {
      res.send({ status: "mulai" })
})

// REGISTER
app.post('/register', async (req, res) => {
      const { username, password } = req.body;

      const oldUser = await User.find({ username: username });

      if (oldUser.length > 0) {
            return res.send({ data: "user sudah ada!!" })
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      try {
            await User.create({
                  username: username,
                  password: encryptedPassword,
            });
            res.send({ status: 'ok', data: 'user dibuat' })
      } catch (error) {
            res.send({ status: 'error', data: error })
      }
});

//LOGIN
app.post("/login", async (req, res) => {
      const { username, password } = req.body;
      const oldUser = await User.findOne({ username: username })

      if (!oldUser) {
            return res.send({ data: "user tidak di temukan !!" })
      }

      if (await bcrypt.compare(password, oldUser.password)) {
            const token = jwt.sign({ username: oldUser.username }, JWT_SECRET);

            if (res.status(201)) {
                  return res.send({ status: "ok", data: token })
            } else {
                  return res.send({ error: "error" })
            }
      }
})

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
      console.log(`Server Berjalan di port ${PORT}`)
})

app.post("/userdata", async (req, res) => {
      const { token } = req.body;
      try {
            const user = jwt.verify(token, JWT_SECRET)
            const userusername = user.username
            User.findOne({ username: userusername }).then(data => {
                  return res.send({ status: "ok", data: data })
            })
      } catch (error) {
            return res.send({ error: "error" })

      }
})

// CREATE
app.post('/tugas', async (req, res) => {
      const { title, description } = req.body;

      try {
            const task = await Task.create({
                  title,
                  description,
            });
            res.send(task);
      } catch (error) {
            res.status(500).send(error.message);
      }
});

// READ
app.get('/tugas', async (req, res) => {
      try {
            const tasks = await Task.find();
            res.send(tasks);
      } catch (error) {
            res.status(500).send(error.message);
      }
});

// UPDATE
app.put('/tugas/:id', async (req, res) => {
      const { title, description } = req.body;

      try {
            const task = await Task.findByIdAndUpdate(
                  req.params.id,
                  {
                        title,
                        description,
                  },
                  { new: true }
            );
            res.send(task);
      } catch (error) {
            res.status(500).send(error.message);
      }
});

// DELETE
app.delete('/tugas/:id', async (req, res) => {
      try {
            await Task.findByIdAndDelete(req.params.id);
            res.send({ message: 'Task deleted successfully' });
      } catch (error) {
            res.status(500).send(error.message);
      }
});