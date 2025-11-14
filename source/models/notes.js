const { type } = require("express/lib/response")

module.exports=(sequelize,DataTypes) =>
{
    const Note=sequelize.define("Notes",{
        id_bien :{
            type : DataTypes.INTEGER,
            primaryKey: true,
            references :
                {
                    model: "biens_Imobiliers",
                    key :"id_bien"
                },
            onDelete: 'CASCADE',
            onUpdate:'CASCADE'
        },
        id_proprietaire:
        {
            type : DataTypes.INTEGER,
            primaryKey: true,
            references :
            {
                model: "utilisateurs",
                key :"id_utilisateur"
            },
            onDelete: 'CASCADE',
            onUpdate:'CASCADE'
        },
        valeur:{
            type: DataTypes.FLOAT,
            allowNull: false
        }
    })
    return Note
}