module.exports = (sequelize, DataTypes) => {
    const File  = sequelize.define("File", {
    id:{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
        },
    file_name :{
        allowNull: false,
        type: DataTypes.STRING
        },
    path :{
        allowNull: false,
        type: DataTypes.STRING
        },
    url :{
        allowNull: false,
        type: DataTypes.STRING
        },
    });

    File.associate = function(models) { 
        File.belongsTo(models.Dept)
    };
   
    return File;
  };