const { User } = require("../db/sequilize")

module.exports=(app)=>
{
    app.get('/api/admin/utilisateurs',(req,res)=>{
        User.findAll()
        .then(users=>{
            const message= `La listes des ${users.length} utilisateurs` 
            res.json({message,data:users,success:true}) 
        })
        .catch(e=>{
            const message = "Le serveur est indisponible pour le moment. Veuillez reesayer dans quelque instants..."
            res.status(500).json({message,e,success:false})
        })
    })
}