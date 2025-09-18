const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require("./source/db/sequilize");
const cors = require('cors')



const port = 3000;
const app = express();
app.use(bodyParser.json())
.use(cors(
    {
        origin:'*',
        methods : ['GET','POST','DELETE','PUT']
    }
))
sequelize.initDb()

//Mettre les point de terminaison
app.get('/',(req,res)=>{
    res.json("hello world") 
})
require('./source/routes/Inscription')(app)
require('./source/routes/Connexion')(app)
require('./source/routes/ModifierProfil')(app)
require('./source/routes/SuprimerProfil')(app)
//End point pour les requette 404
app.use(((req,res)=>
    {
        const message = "Impossible de trouver cette page essayer une autre Url..."
         res.status(404).json(message) 
    }))
app.listen(port,console.log(`Serveur demarer sur http://localhost:${port}`));
