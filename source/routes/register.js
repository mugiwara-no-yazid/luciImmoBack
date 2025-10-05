const { ValidationError, UniqueConstraintError } = require("sequelize")
const { User } = require("../db/sequilize")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const nodemailer = require('nodemailer')

module.exports=async (app)=> {
    app.post("/api/auth/register",(req,res)=>{
      const code_verification = crypto.randomBytes(6).toString('hex') 
      let etat= ""
      if(req.body.role !="locataire" && req.body.role !="proprietaire" )
      {
        return res.status(400).json({message : "Votre role ne peut etre que \"locataire\" ou \"proprietaire\"", success:false})
      }
      if(req.body.role!="admin")
         { etat = "suspendu"}
      
        bcrypt.hash(req.body.mot_de_passe,10)
        .then(hash=>{
            User.create({
            "nom" : req.body.nom,
            "email": req.body.email,
            "mot_de_passe" :hash,
            "telephone" : req.body.telephone,
            "photo_profil" : req.body.photo_profil,
            "role" : req.body.role,
            "etat":etat,
            "code_verification" : code_verification
          })
          .then(user=>{
              const monmail = "yazidsoumanouu@gmail.com" 
              const lienconfirmation = `localhost:3000/api/auth/confirm/${user.email}/${user.code_verification}`
              const message = `l'utilisateur ${req.body.nom} à été créer`
              const transporteur = nodemailer.createTransport({
                service: 'gmail',
                auth : {
                  user : monmail,
                  pass : "monMotDePasse"
                }
              })
              const mailoption = {
                from: monmail,
                to : user.email,
                subject: "Confirmez votre compte",
                text:`Cliquez sur ce lien pour confirmer votre compte :
                ${lienconfirmation}`
              }
              res.json({message, data: user, success:true})
          })
          .catch(e=>{
            if(e instanceof UniqueConstraintError)
                {
                  return  res.status(400).json({message :"Ce mail est deja pris.", data : e,success : false}) 
                } 
              if(e instanceof ValidationError)
                {
                  return  res.status(400).json({message :"Vous avez soumis des information incorrecte. Veuillez reesayer.", data : e,success : false}) 
                } 
              const message = 'L\'utilisateur n\'as pas été ajouté. Veuillez reesayer plus tard...'
              res.status(500).json({ message, data: e,success : false})
            })
        })
        .catch(err=>{
          
          const message = "Le serveur est indisponible pour le moment. Veuillez reesayer dans quelque instants..."
          res.json({message,data:err,success:false})
        })
    })
}
