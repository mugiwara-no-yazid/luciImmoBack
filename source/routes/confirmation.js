const { ValidationError, UniqueConstraintError } = require("sequelize")
const { User } = require("../db/sequilize")

module.exports=(app)=>{
    app.post('/api/auth/confirm/:mail/:codeverif',(req,res)=>
        {
            User.findOne( {where : {"email" : req.params.mail}})
            .then(user=>{
                if(!user)
                {
                    const message = `L'utilisateur avec le mail : ${req.params.mail} est introuvable`
                    return res.status(404).json({message,success: false})
                }
                 if(user.code_verification !== req.params.codeverif)
                {
                    const message = "Le code de verification est incorrecte"
                    return res.status(400).json({message,success: false})
                }
                const updateuser = {...user,"etat":"actif"} 
                    User.update(updateuser,{where : {"email" : req.params.mail}})
                    .then(user2=> {
                       const message = "Le compte de l'utilisateur a été activé"
                       return res.json({message , data: user2,success: true})
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
                    const message = "Le serveur est indisponible pour le moment. Veuillez reesayer dans quelque instants..."
                    return res.status(500).json({ message, data: e,success : false})
                    })
            })
            .catch (e=>{
                const message = "Le serveur est indisponible pour le moment. Veuillez reesayer dans quelque instants..."
                return res.json({message,data:e,success:false})
            })
            
        })
}