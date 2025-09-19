const { ValidationError, UniqueConstraintError } = require("sequelize")
const { Bien } = require("../db/sequilize")

module.exports= (app)=>{
    app.post('/api/biens',(req,res)=>{
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
              const message = "Le serveur est indisponible pour le moment. Veuillez reesayer dans quelque instant..."
              res.status(500).json({ message, data: e,success : false})
        })
    })
    
}