module.exports = (sequilize,DataTypes)=>
{
    const Paiements= sequilize.define("Paiements",
        {
            id_paiement :{
                type : DataTypes.INTEGER,
                primaryKey : true,
                autoIncrement : true
            },
            id_locataire:
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
            montant :
            {
                type : DataTypes.FLOAT,
                allowNull: false
            },
            moyen_paiement :
            {
                type : DataTypes.ENUM("MobileMoney", "CarteBancaire", "PayPal", "Wave"),
                allowNull : false,
                validate :
                {
                    isIn : {
                        args : [["MobileMoney", "CarteBancaire", "PayPal", "Wave"]],
                        msg : "Le moyens de paiement est invalide essayer de payer avec MobileMoney, CarteBancaire, PayPal, Wave"
                    }
                }
            },
            statut :
            {
                type : DataTypes.ENUM("en_attente", "payé", "échoué"),
                allowNull : false,
                validate :
                {
                    isIn : {
                        args : [["en_attente", "payé", "échoué"]],
                        msg : "Le statut du paiement doit etre : en_attente, payé, échoué"
                    }
                }
            },
            reference : {
                type : DataTypes.STRING,
                allowNull : false,
                unique : {msg : "Cette reference de paiement existe deja."}
            }
        },
        {
            tableName: "Paiements",
            timestamps: true,
            createdAt: 'date_paiement',
            updatedAt: false
        }
    )

    Paiements.associate = (models) => {
            Paiements.belongsTo(models.Utilisateurs, {
                foreignKey: "id_utilisateur",
                as: "proprietaire"
            });
        };
    Paiements.associate = (models) => {
            Paiements.belongsTo(models.Biens_Imobiliers, {
                foreignKey: "id_bien",
                as: "biens"
            });
        };

    return Paiements
}