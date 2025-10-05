const { User } = require("../db/sequilize")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const key = require('../../auth/privatekey')

module.exports=(app)=>{
    app.post('/api/auth/login',(req,res)=>{
        User.findOne(
            {where : {
                "email" :req.body.email
            }}
        )
        .then(user=>{
            
            if(!user)
            {
                const message ="Les identifiants entré sont incorecte"
                return res.status(404).json({message, success : false})
            }
            bcrypt.compare(req.body.mot_de_passe,user.mot_de_passe)
            .then(isValide=>{
                if (isValide)
                {
                    const token = jwt.sign({userId : user.id}, key,{expiresIn : "24h"})
                    const message = "Utilisateur connecté"
                    return res.json({message,user,token,success:true})
                }
                    const message = "Le mot de passe entré est incorrecte"
                    res.json({message,success:false})      
            })
        })
        .catch(e=>{
            const message = "Le serveur est indisponible pour le moment. Veuillez reesayer dans quelque instants..."
            res.status(500).json({message,e,success:false}) 
        })
    })
}