const { User } = require("./models/user");
const { Post } = require("./models/post");

// User queries
const getAllUsers = async () => {
  return await User.findAll();
};

const getUserById = async (id) => {
  return await User.findByPk(id);
};

const createUser = async (userData) => {
  return await User.create(userData);
};

const updateUser = async (id, userData) => {
  return await User.update(userData, { where: { id } });
};

const deleteUser = async (id) => {
  return await User.destroy({ where: { id } });
};

// Post queries
const getAllPosts = async () => {
  return await Post.findAll();
};

const getPostById = async (id) => {
  return await Post.findByPk(id);
};

const createPost = async (postData) => {
  return await Post.create(postData);
};

const updatePost = async (id, postData) => {
  return await Post.update(postData, { where: { id } });
};

const deletePost = async (id) => {
  return await Post.destroy({ where: { id } });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
