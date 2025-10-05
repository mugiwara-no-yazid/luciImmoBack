const { Bien,Media,Commentaire, User } = require("../db/sequilize")

module.exports=(app)=>{
    app.get("/api/biens/:id",async (req,res)=>
        {
            Bien.findByPk(req.params.id,{
            include :[{
                model : Media,
                as: "photos"
            },{
                model : Commentaire,
                include :[{
                model : User,
                attributes :['nom']
            }]
                
            }]
        })
            .then(bien=>
                {
                    if (!bien)
                    { 
                        const message = "Ce bien n'existe pas"
                        return res.status(404).json({message, success : false})
                    }
                    const message = "Le bien a bien été envoyé"
                    res.json({message,success:true,data:bien})
                })
            .catch(e=>{
                console.log(e);
                
                const message = "Le serveur est indisponible pour le moment. Veuillez reesayer dans quelque instants..."
                res.status(500).json({message,e,success:false})
            })
        })
}