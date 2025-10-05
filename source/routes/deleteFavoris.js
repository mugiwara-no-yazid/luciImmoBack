const { Favori } = require("../db/sequilize")

module.exports=(app)=>
    {
        app.delete("/api/favoris/:id",(req,res)=>{
            Favori.findByPk(req.params.id)
            .then(fav=>{
                if(!fav)
                {
                   return res.status(404).json({message:"Cet favoris n'existe pas",success : false})
                }
                Favori.destroy({where:{id_favori : req.params.id}})
                 .then(
                res.json({message:"Le favoris à bien été supprimer", success : true})
             )
            .catch(e=>
                {
                    const message = "Le serveur est indisponible pour le moment. Veuillez reesayer dans quelque instants..."
                    res.status(500).json({ message, data: e,success : false})
                })
             
        })
        .catch(e=>
        {
            const message = "Le serveur est indisponible pour le moment. Veuillez reesayer dans quelque instants..."
            res.status(500).json({ message, data: e,success : false})
        })
    })
}