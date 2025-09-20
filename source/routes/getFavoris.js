const { Favori } = require("../db/sequilize")

module.exports=(app)=>{
    app.get("/api/favoris/:id",(req,res)=>{
        Favori.findAll({where:{id_utilisateur : req.params.id}})
        .then(fav=>
            {
                if(fav.length==0)
                {
                   return res.json({message:"Cet utilisateur n'as aucun bien en favoris",success:true})
                }
                const message = `La liste des biens mis en favoris par l'utilisateur ${req.params.id}`
                res.json({message,success:true,data:fav})
            })
            .catch(e=>{
                const message = "Le serveur est indisponible pour le moment. Veuillez reesayer dans quelque instant..."
      res.status(500).json({message,e,success:false})
            })
        })
    }