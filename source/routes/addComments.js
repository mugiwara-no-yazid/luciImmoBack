const { ValidationError } = require("sequelize")
const { Commentaire } = require("../db/sequilize")

module.exports=(app)=>
    {
        app.post('/api/biens/commentaires',(req,res)=>
            {
                Commentaire.create(req.body)
                .then(commentaire=>
                    {
                        const message = "le commentaire a bien été ajouter"
                        res.json({message,data:commentaire,success:true})
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