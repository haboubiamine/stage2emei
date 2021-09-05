module.exports = (sequelize, DataTypes) => {
    const User  = sequelize.define("User", {
    id:{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
        },
   email :{
        allowNull: false,
        type: DataTypes.STRING
        },
    pwd :{
        allowNull: false,
        type: DataTypes.STRING
        },
    Role : {
        allowNull: false,
        type: DataTypes.STRING
    }
    });
    
    User.associate = function(models) { 
        User.belongsTo(models.Dept)
    };
   
    return User;
  };