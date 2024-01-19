const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
      {
            username: { type: String, unique: true },
            password: String
      },
      {
            collection: "Users"
      }
);

mongoose.model("Users", UserSchema);