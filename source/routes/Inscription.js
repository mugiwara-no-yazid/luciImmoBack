const { ValidationError, UniqueConstraintError } = require("sequelize")
const { User } = require("../db/sequilize")
const bcrypt = require("bcrypt")
module.exports=async (app)=> {
    app.post("/api/auth/register",(req,res)=>{
        bcrypt.hash(req.body.mot_de_passe,10)
        .then(hash=>{
            User.create({
            "nom" : req.body.nom,
            "email": req.body.email,
            "mot_de_passe" :hash,
            "telephone" : req.body.telephone,
            "photo_profil" : req.body.photo_profil,
            "role" : req.body.role
          })
          .then(user=>{
              const message = `l'utilisateur ${req.body.nom} à été créer`
              res.json({message, data: user, success:true})
          })
          .catch(e=>{
              if(e instanceof ValidationError)
                {
                  return  res.status(400).json({message :e.message, data : e,success : false}) 
                } 
              if(e instanceof UniqueConstraintError)
                {
                  return  res.status(400).json({message :e.message, data : e,success : false}) 
                } 
              const message = 'L\'utilisateur n\'as pas été ajouté. Veuillez reesayer plus tard...'
              res.status(500).json({ message, data: e,success : false})
            })
        })
        .catch(err=>{
          const message = "Une erreur est survenu veuillez reesayer..."
          res.json({message,data:err,success:false})
        })
    })
}
