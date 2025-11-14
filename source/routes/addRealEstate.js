const { ValidationError, UniqueConstraintError } = require("sequelize")
const { Bien, User } = require("../db/sequilize")

module.exports= (app)=>{
    app.post('/api/biens',(req,res)=>{
      User.findByPk(req.body.id_proprietaire)
      .then(user=>{
        if(!user)
            {
                const message ="Cet utilisateur n'existe pas"
                return res.status(404).json({message, success : false})
            }
        if (user.role != "proprietaire")
        {
          return res.status(401).json({message :"Vous n'etes pas autoriser a effectuer cette action", success : false})  
        }
        Bien.create(req.body)
        .then(bien=>{
          const message = "Le bien a été ajouter avec succès"
          res.json({message,data:bien})
        }
        ).catch(e=>{
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
      }).catch(e=>{
            const message = "Le serveur est indisponible pour le moment. Veuillez reesayer dans quelque instants..."
            res.status(500).json({ message, data: e,success : false})
        })
    })
    
}