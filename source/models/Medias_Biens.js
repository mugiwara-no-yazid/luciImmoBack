const Biens_Imobiliers = require("./Biens_Imobiliers");

module.exports = (sequelize, DataTypes) =>
{
    const Medias_Biens = sequelize.define("Medias_Biens",
        {
            id_image :{
                type : DataTypes.INTEGER,
                primaryKey : true,
                autoIncrement : true
            },
            id_bien:
            {
                type : DataTypes.INTEGER,
                allowNull : false,
                references :
                {
                    model: "Biens_Imobiliers",
                    key :"id_bien"
                },
                onDelete: 'CASCADE',
                onUpdate:'CASCADE'
            },
            url_image :
            {
                type : DataTypes.STRING,
                allowNull: false
            },
            is_principale :
            {
                type : DataTypes.BOOLEAN,
                allowNull: false
            }
        },
        {
            createdAt: false,
            updatedAt: false
        }
    )
    Medias_Biens.associate = (models) => {
        Medias_Biens.belongsTo(models.Bien, {
            foreignKey: "id_bien",   as: "bien"
        });
    };
    return Medias_Biens;
}