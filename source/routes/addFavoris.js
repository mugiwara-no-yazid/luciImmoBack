const { default: ValidationError } = require("sequelize/lib/errors/validation-error")
const { Favori } = require("../db/sequilize")

module.exports = (app)=>{
    app.post("/api/favoris",(req,res)=>
        {
            Favori.create(req.body)
            .then(favori=>{
                const message = "L'article a bien été ajouté parmis les favoris"
                res.json({message,data:favori,success:true})
            })
            .catch(e=>{
                if(e instanceof ValidationError)
                {
                    return  res.status(400).json({message :e.message, data : e,success : false}) 
                }     
                const message = "Le serveur est indisponible pour le moment. Veuillez reesayer dans quelque instants..."
                res.status(500).json({message,e,success:false})
            })
        })
}