const bcrypt = require('bcryptjs');

let users = [];

module.exports = {
  getAll: () => users,
  create: async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
    users.push(user);
    return user;
  },
  findByEmail: (email) => users.find(user => user.email === email),
  comparePassword: async (password, hash) => await bcrypt.compare(password, hash)
};
