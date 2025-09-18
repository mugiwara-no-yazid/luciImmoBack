module.exports = (sequilize,DataTypes)=>
{
    const Commentaires= sequilize.define("Commentaires",
        {
            id_commentaire :
            {
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
            id_utilisateur:
            {
                type : DataTypes.INTEGER,
                allowNull : false,
                references :
                {
                    model: "utilisateurs",
                    key :"id_utilisateur"
                },
                onDelete: 'CASCADE',
                onUpdate:'CASCADE'
            },
            contenu :
            {
                type : DataTypes.TEXT,
                allowNull: false
            }
        },
        {
            tableName: "Commentaires",
            timestamps: true,
            createdAt: 'date_post',
            updatedAt: false
        }
    )

    Commentaires.associate = (models) => {
            Commentaires.belongsTo(models.Utilisateurs, {
                foreignKey: "id_utilisateur",
                as: "proprietaire"
            });
        };
    Commentaires.associate = (models) => {
            Commentaires.belongsTo(models.Biens_Imobiliers, {
                foreignKey: "id_bien",
                as: "biens"
            });
        };
    
    return Commentaires
}