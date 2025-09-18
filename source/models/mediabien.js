module.exports = (sequilize, DataTypes) =>
{
    const Medias_Biens = sequilize.define("Medias_Biens",
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
            tableName: "Medias_Biens",
            createdAt: false,
            updatedAt: false
        }
    )
    Medias_Biens.associate = (models) => {
            Biens_Imobiliers.belongsTo(models.Biens_Imobiliers, {
                foreignKey: "id_bien",
                as: "biens"
            });
        };
    return Medias_Biens;
}