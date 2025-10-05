const { User } = require("../db/sequilize")
const { ValidationError, UniqueConstraintError } = require("sequelize")

module.exports=(app)=>{
    app.put('/api/admin/utilisateurs/:id/suspendre',(req,res)=>
        {
            User.findByPk(req.params.id)
            .then(user=>{
                if(!user)
                {
                    const message = "Cet utilisateur n'existe pas"
                    return res.status(404).json({message,success:false})
                }
                const updateUser = {...user.dataValues,etat : req.body.etat}
                User.update(updateUser,{where:{id_utilisateur : req.params.id}})
                .then(_=>{
                    const message = `L'utilisateur ${updateUser.email} à été ${updateUser.etat}`
                    res.json({message,data:updateUser,success:true})
                })
                .catch(e=>{
                    if(e instanceof ValidationError)
                        {
                        return  res.status(400).json({message :e.message, data : e,success : false}) 
                        } 
                    if(e instanceof UniqueConstraintError)
                        {
                        return  res.status(400).json({message :e.message, data : e,success : false}) 
                        } 
                    const message = "Le serveur est indisponible pour le moment. Veuillez reesayer dans quelque instants..."
                    res.status(500).json({ message, data: e,success : false})
                })
            })
            .catch(e=>{
                const message = "Le serveur est indisponible pour le moment. Veuillez reesayer dans quelque instants..."
                res.status(500).json({ message, data: e,success : false})
            })
        })
}