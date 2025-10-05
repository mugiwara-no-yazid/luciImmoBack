const { Sequelize, DataTypes } = require('sequelize')
const UserModel = require('../models/utilisateur.js')
const BienModel = require('../models/Biens_Imobiliers.js')
const MediaModel = require('../models/Medias_Biens.js')
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
const models = {User,Bien,Media,Commentaire,Paiement,Favori}

Object.keys(models).forEach(modelName=>{
  if(models[modelName].associate)
  {
   models[modelName].associate(models) 
  }
})
const initDb = () => {
  return sequelize.sync(/*{force :true}*/).then(async _ => { 
    console.log('La base de donnée est prête !')
  }).catch(e=>console.error("La base de donnée n'as pas demarrer",e))
}
  
module.exports = { 
  initDb,User,Bien,Media,Commentaire,Paiement,Favori
}