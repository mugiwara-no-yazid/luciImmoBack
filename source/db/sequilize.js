const { Sequelize, DataTypes } = require('sequelize')
const UserModel = require('../models/utilisateur.js')
const BienModel = require('../models/bienImmobilier.js')
const MediaModel = require('../models/mediabien.js')
const CommentaireModel = require('../models/commentaire.js')
const PaiementModel =  require('../models/paiement.js')
const FavoriModel =  require('../models/favori.js')

const sequelize = new Sequelize('immobilier', 'root', '', {
  host: 'localhost',
  dialect: 'mariadb',
  dialectOptions: {
    timezone: 'Etc/GMT-2',
  },
  logging: false
})
  

const User = UserModel(sequelize,DataTypes)
const Bien = BienModel(sequelize,DataTypes)
const Media = MediaModel (sequelize,DataTypes)
const Commentaire = CommentaireModel(sequelize,DataTypes)
const Paiement = PaiementModel(sequelize,DataTypes)
const Favori = FavoriModel(sequelize,DataTypes)

const initDb = () => {
  return sequelize.sync({force:true}).then(_ => {
    User.create({
	 "nom" : "Pikachu",
	 "email": "az@e.com",
	 "mot_de_passe" : "Pikachu",
	 "telephone" : "0007050604",
	"photo_profil" : null,
	"role" : "locataire"
}
)
    console.log('La base de donnée a bien été initialisée !')
  }).catch(e=>console.error("La base de donnée n'as pas demarrer"))
}
  
module.exports = { 
  initDb,User,Bien,Media,Commentaire,Paiement,Favori
}