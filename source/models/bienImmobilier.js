module.exports = (sequelize,DataTypes) =>
{
    const Biens_Imobiliers = sequelize.define("Biens_Imobiliers",
        {
            id_bien:{
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            id_proprietaire:
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
            titre:
            {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description :
            {
                type : DataTypes.TEXT, 
            },
            type_bien:
            {
                type: DataTypes.ENUM("appartement", "maison", "studio", "terrain"),
                allowNull : false,
                validate :
                {
                    isIn :{
                        args :[["appartement", "maison", "studio", "terrain"]],
                        msg : "Le type du bien doit etre : appartement,  maison, studio, terrain"
                    }
                }
            },
            adresse :
            {
                type: DataTypes.STRING,
                allowNull : false,
            },
            ville : 
            {
                type: DataTypes.STRING,
                allowNull : false,
            },
            statut :
            {
                type: DataTypes.ENUM("disponible", "réservé", "occupé"),
                allowNull : false,
                validate :
                {
                    isIn :{
                        args :[["disponible", "réservé", "occupé"]],
                        msg : "Le statut du bien doit etre : disponible, réservé, occupé"
                    }
                }
            },
            prix :
            {
                type: DataTypes.FLOAT,
                allowNull:false
            },
            surface:
            {
                type : DataTypes.FLOAT
            },
            nb_pieces:
            {
                type : DataTypes.INTEGER
            }
        },
        {
            tableName: "Biens_Imobiliers",
            timestamps: true,
            createdAt: 'date_ajout',
            updatedAt: false
        })


    Biens_Imobiliers.associate = (models) => {
            Biens_Imobiliers.belongsTo(models.Utilisateurs, {
                foreignKey: "id_proprietaire",
                as: "proprietaire"
            });
        };
    Biens_Imobiliers.associate = (models) => {
        Biens_Imobiliers.hasMany(models.Medias_Biens, {
            foreignKey: "id_image",
            as: "image_bien"
        });
    };
    Biens_Imobiliers.associate = (models) => {
        Biens_Imobiliers.hasMany(models.Commentaires, {
            foreignKey: "id_commentaire",
            as: "commentaire"
        });
    };

    Biens_Imobiliers.associate = (models) => {
        Biens_Imobiliers.hasMany(models.Paiements, {
            foreignKey: "id_paiement",
            as: "paiement"
        });
    }
    Biens_Imobiliers.associate = (models) => {
        Biens_Imobiliers.hasMany(models.Favoris, {
            foreignKey: "id_favori",
            as: "favoris"
        });
    }
    return Biens_Imobiliers;
}