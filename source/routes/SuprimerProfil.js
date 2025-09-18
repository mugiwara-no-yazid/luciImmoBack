const { User } = require("../db/sequilize")

module.exports=(app)=>
{
    app.delete('/api/users/:id',(req,res)=>
    {
        User.findByPk(req.params.id)
        .then(user=>{
            if(!user)
            {
                const message ="Cet utilisateur n'existe pas"
                return res.status(404).json({message, success : false})
            }
            const userdeleted = user
            
             User.destroy({where:{id_utilisateur : req.params.id}})
            .then(_=>{
                const message = `L'utilisateur avec l'email ${userdeleted.email} a bien été supprimé.`
                res.json({message, data: userdeleted,success : true })
            })
            .catch(e=>
                {
                    const message = 'L\'utilisateur n\'as pas pu être supprimer. Veuillez reesayer plus tard...'
                    res.status(500).json({ message, data: e,success : false})
                }
            )
        })
        .catch(e=>
        {
            const message = 'L\'utilisateur n\'as pas pu être supprimer. Veuillez reesayer plus tard...'
            res.status(500).json({ message, data: e,success : false})
        }
        )
    })
}