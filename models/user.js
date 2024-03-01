const sequelize = require("../config/db");
const { DataTypes, Model } = require("sequelize");
const crypto = require("crypto");

class User extends Model {}

User.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bio: {
      type: DataTypes.TEXT,
    },
    avatar: {
      type: DataTypes.STRING,
    },
    googleId: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);

async function findOrCreateGoogleUser(profile) {
  try {
    if (!profile || !profile.emails) {
      throw new Error("Profile or profile emails is undefined");
    }

    const user = await User.findOrCreate({
      where: { googleId: profile.id },
      defaults: {
        email: profile.emails[0].value,
        password: crypto.randomBytes(16).toString("hex"), // create a random password
      },
    });

    return user; // return user object
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  User,
  findOrCreateGoogleUser,
};
