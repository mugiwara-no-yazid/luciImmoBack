const { Media } = require("../db/sequilize")

module.exports=(app)=>
    {
        app.delete("/api/images/:id",(req,res)=>{
            Media.findByPk(req.params.id)
            .then(media=>{
                if (!media)
                {
                    const message = "Le media n'existe pas"
                    return res.status(404).json({message})
                }
                const mediaDel = media
                Media.destroy({where :{id_image : req.params.id}})
                .then(_=>{
                    const message = "Le media a bien été supprimer"
                    res.json({message,success:true,data:mediaDel})
                }).catch(e=>
                {
                    const message = "Le serveur est indisponible pour le moment. Veuillez reesayer dans quelque instant..."
                    res.status(500).json({ message, data: e,success : false})
                }
            )
        })
        .catch(e=>
        {
            const message = "Le serveur est indisponible pour le moment. Veuillez reesayer dans quelque instant..."
            res.status(500).json({ message, data: e,success : false})
        }
        )
    })
}