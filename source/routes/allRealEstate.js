const { Bien, Media } = require("../db/sequilize")



module.exports=(app)=>{
    app.get('/api/biens',(req,res)=>{
        
        Bien.findAll({
            include :[{
                model : Media,
                as: "photos"
            }]
        })
        .then(bien=>
        { 
               if(bien.length == 0)
               {
                const message ="Il n'y a aucun bien enregistré sur le site"
                return res.json({message,success:false,data:bien})
               }
               const message = "La liste des biens enregistré a bien été envoyer"
                res.json({message,success:true,data: bien})
        })
        .catch(e=>{
            const message = "Le serveur est indisponible pour le moment. Veuillez reesayer dans quelque instant..."
            res.status(500).json(message)
        })
                
    })
               
}