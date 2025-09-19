const { Bien } = require("../db/sequilize")

module.exports=(app)=>
    {
        app.put('/api/biens/:id',(req,res)=>
            {
                Bien.update(req.body,{
                    where :{id_bien : req.params.id}
                }).then(_=>
                    {
                        return Bien.findByPk(req.params.id)
                        .then(bien=>{
                            if(!bien)
                            {
                                const message = "Le bien n'existe pas"
                                return res.status(404).json({message,success : false})
                            }
                            const message = "Les informations du bien ont été modifier"
                            res.json({message,data:bien})
                        })
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
                        const message = "Le serveur est indisponible pour le moment. Veuillez reesayer dans quelque instant..."
                        res.status(500).json({ message, data: e,success : false})
                        })
                    
            })
    }