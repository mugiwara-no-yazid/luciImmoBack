module.exports =(sequilize,DataTypes)=>  {
const Favoris =  sequilize.define( "Favoris",
    {
        id_favori :{
                type : DataTypes.INTEGER,
                primaryKey : true,
                autoIncrement : true
            },
        utilisateur:
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
    },
    {
        tableName: "Favoris",
        timestamps: true,
        createdAt: 'date_ajout',
        updatedAt: false
    }
)
    Favoris.associate = (models) => {
            Favoris.belongsTo(models.Utilisateurs, {
                foreignKey: "id_utilisateur",
                as: "proprietaire"
            });
        };
    Favoris.associate = (models) => {
            Favoris.belongsTo(models.Biens_Imobiliers, {
                foreignKey: "id_bien",
                as: "biens"
            });
        };

    return Favoris
}