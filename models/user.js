const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        email: {
          type: Sequelize.STRING(40),
          allowNull: true,
        },
        id: {
          //type: Sequelize.STRING(40),
          type: Sequelize.INTEGER,
          allowNull: false,
          unique: true,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING(15),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "User",
        tableName: "users",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.Post)/*, { foreignKey : 'userid' , sourceKey: 'id'}*/;
    db.User.belongsToMany(db.User, {
      foreignKey: "followingId",
      //targetKey: "id",
      as: "Followers",
      through: "Follow",
    });
    db.User.belongsToMany(db.User, {
      foreignKey: "followerId",
      //targetKey: "id",
      as: "Followings",
      through: "Follow",
    });
  }
};
