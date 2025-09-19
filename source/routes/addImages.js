const { ValidationError } = require("sequelize")
const { Media } = require("../db/sequilize")

module.exports=(app)=>{
    app.post('/api/biens/images',(req,res)=>
        {
            Media.create(req.body)
            .then(media=>
                {
                    const message = "La photo a bien été ajouter"
                    res.json({message,success:true,data:media})
                }
            ).catch(e=>{
                if(e instanceof ValidationError)
                {
                  return  res.status(400).json({message :e.message, data : e,success : false}) 
                } 
                const message = "Le serveur est indisponible pour le moment. Veuillez reesayer dans quelque instant..."
                res.status(500).json({ message, data: e,success : false})
            })
        })
}