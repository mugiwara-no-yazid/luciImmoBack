const { Commentaire } = require("../db/sequilize")

module.exports=(app)=>
    {
        app.get('/api/biens/:id/commentaires',(req,res)=>{
            Commentaire.findAll({where:{id_bien : req.params.id}})
            .then(commentaires=>{
                if(commentaires.length==0)
                {
                    const message="Il n'y a aucun commentaire sur cet poste"
                    return res.json({message,success:true})
                }
                const message = "La liste des commentaire relatif a cet poste"
                res.json({message,success:true,data:commentaires})
            })
            .catch(e=>{
                const message = "Le serveur est indisponible pour le moment. Veuillez reesayer dans quelque instant..."
                res.status(500).json({message,e,success:false})
            })
        })
    }