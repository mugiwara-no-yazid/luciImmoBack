const { Commentaire } = require("../db/sequilize")

module.exports=(app)=>{
    app.delete('/api/commentaires/:id',(req,res)=>{

        Commentaire.findByPk(req.params.id)
        .then(commentaire=>{
            if (!commentaire)
            {
                const message= "Le commentaire n'existe pas"
                return res.status(404).json({message,success:false})
            }
             Commentaire.destroy({where:{id_commentaire : req.params.id}})
             .then(
                res.json({message:"Le commentaire à bien été supprimer", success : true})
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