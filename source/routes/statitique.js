const {Op,fn,col} = require("sequelize")
const { Bien } = require("../db/sequilize")

module.exports =(app)=>{
    app.get("/api/statistique",async (req,res)=>{
        try {
            const currentYear = new Date().getFullYear()
            const lastYear = currentYear -1
            const thisYearCount = await Bien.count ({where : {statut :"occupé",updatedAt:{
                [Op.between]: [new Date(currentYear-01-01),new Date(currentYear-12-31)]
            }}})
            const lastYearCount = await Bien.count ({where : {statut :"occupé",updatedAt:{
                [Op.between]: [new Date(lastYear-01-01),new Date(lastYear-12-31)]
            }}})
            const maisonLouees =await Bien.count({where : {statut :"occupé"}})
            const maisonDispo =await Bien.count({where : {statut :"disponible"}})
            const croissanceAnuelle = lastYearCount==0? 100 : ((thisYearCount-lastYearCount)/lastYearCount*100).toFixed(2)
            const maisonPremium = await Bien.findAll({limit : 5})
            
            res.json({message : "les statistiques du sites et les biens premiums ont été envoyé", data:{maisonLouees,maisonDispo,croissanceAnuelle,maisonPremium},success:true})
        
        } catch (e) {
            const message = "Le serveur est indisponible pour le moment. Veuillez reesayer dans quelque instants..."
            res.status(500).json({message,e,success:false})
        }
    })
}