const { ValidationError, UniqueConstraintError } = require("sequelize")
const { User } = require("../db/sequilize")

module.exports=(app)=>
{
    app.put('/api/users/:id',(req,res)=>
    {
        User.update(req.body,{
            where : {id_utilisateur : req.params.id}
        })
        .then(pass=>{
            return User.findByPk(req.params.id)
            .then(user=>{
                if(!user)
                {
                    const message ="Cet utilisateur n'existe pas"
                    return res.status(404).json({message, success : false})
                } 
                const message ="Les information ont été modifier"
                res.json({message,user, success : true})
            })
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
              res.status(500).json({ message, data: e,success : false})
            })
    })
            
}
