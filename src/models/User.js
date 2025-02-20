const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');
const { sequelize } = require('../../config');

class User extends Model {
  async checkPassword(loginPw) {
    return bcrypt.compare(loginPw, this.password);
  }
}

User.init({
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true,
    validate: { isEmail: true }
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users', // Explicit table name
  timestamps: true, // Ensure timestamps
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 12);
    },
    beforeUpdate: async (user) => {
        if (user.changed('password')) {
            user.password = await bcrypt.hash(user.password, 12);
        }
    },
  }
});

module.exports = User;
