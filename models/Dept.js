module.exports = (sequelize, DataTypes) => {
    const Dept  = sequelize.define("Dept", {
    id:{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
        },
    dept_name :{
        allowNull: false,
        type: DataTypes.STRING
        },
    });

    Dept.associate = function(models) { 
        Dept.hasMany(models.User )
        Dept.hasMany(models.File )
    };
   
    return Dept;
  };