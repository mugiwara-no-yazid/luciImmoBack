module.exports =(sequelize, DataTypes) =>
{
    const Utilisateurs = sequelize.define('Utilisateurs',{
        id_utilisateur: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nom :{
            type : DataTypes.STRING,
            allowNull : false
        },

        email :
        {
            type : DataTypes.STRING ,
            allowNull : false,
            unique :{msg : "Ce mail est deja pris."},
            validate :
                {
                    notEmpty : {msg :"Le mail ne doit pas etre que des espaces"},
                    notNull : {msg :"Le mail doit pas etre vide"},
                    isEmail : {msg : "Ce mail n'est pas valide."}
                }
        },
        mot_de_passe :
        {
            type : DataTypes.STRING,
            allowNull : false,
        },
        telephone :
        {
            type : DataTypes.STRING,
        },
        photo_profil :
        {
            type: DataTypes.STRING,
        },
        role :
        {
            type : DataTypes.ENUM('admin','proprietaire','locataire'),
            validate :
            {
                isIn : {
                    args : [['admin','proprietaire','locataire']],
                    msg : `Le role ne peut etre que "locataire" ou "proprietaire"`
                }
            }
        } 
    },{
    timestamps: true,
    createdAt: 'date_inscription',
    updatedAt: false
  })

  Utilisateurs.associate = (models) => {
        Utilisateurs.hasMany(models.Biens_Imobiliers, {
            foreignKey: "id_proprietaire",
            as: "biens"
        });
    };
    
    Utilisateurs.associate = (models) => {
        Utilisateurs.hasMany(models.Commentaires, {
            foreignKey: "id_commentaire",
            as: "commentaire"
        });
    }

    Utilisateurs.associate = (models) => {
        Utilisateurs.hasMany(models.Paiements, {
            foreignKey: "id_paiement",
            as: "paiement"
        });
    }
    Utilisateurs.associate = (models) => {
        Utilisateurs.hasMany(models.Favoris, {
            foreignKey: "id_favori",
            as: "favoris"
        });
    }
    return Utilisateurs;
}