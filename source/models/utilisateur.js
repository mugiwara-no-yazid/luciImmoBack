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
        },
        code_verification :
        {
            type : DataTypes.STRING,
            allowNull : false,
            unique:{msg : "Cet code est deja utiliser"}
        }
        ,
        etat :
        {
            type : DataTypes.ENUM('actif','suspendu','bannis'),
            allowNull : false,
            validate :
            {
                isIn : {
                    args : [['actif','suspendu','bannis']],
                    msg : `L'etat de l'utilisateur ne peut etre que "actif", "suspendu" ou "bannis"`
                }
            }
        } 
    },{
    timestamps: true,
    createdAt: 'date_inscription',
    updatedAt: false
  })

  Utilisateurs.associate = (models) => {
        Utilisateurs.hasMany(models.Bien, {
            foreignKey: "id_utilisateur"
        });
        Utilisateurs.hasMany(models.Commentaire, {
            foreignKey: "id_commentaire"
        });
        Utilisateurs.hasMany(models.Paiement, {
            foreignKey: "id_paiement"
        });
        Utilisateurs.hasMany(models.Favori, {
            foreignKey: "id_favori"
        });
    }
    return Utilisateurs;
}