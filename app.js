const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require("./source/db/sequilize");
const cors = require('cors')



const port = 2000;
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
require('./source/routes/register')(app)
require('./source/routes/login')(app)
require('./source/routes/updateProfil')(app)
require('./source/routes/deleteProfil')(app)
require('./source/routes/allRealEstate')(app)
require('./source/routes/getRealEstate')(app)
require('./source/routes/addRealEstate')(app)
require('./source/routes/updateRealEstate')(app)
require('./source/routes/deleteRealEstate')(app)
require('./source/routes/addImages')(app)
require('./source/routes/deleteImages')(app)
require('./source/routes/getComments')(app)
require('./source/routes/addComments')(app)
require('./source/routes/deleteComment')(app)
require('./source/routes/addFavoris')(app)
require('./source/routes/deleteFavoris')(app)
require('./source/routes/getFavoris')(app)
require('./source/routes/getFullUsers')(app)
require('./source/routes/changeUserState')(app)
require('./source/routes/confirmation')(app)
require('./source/routes/statitique.js')(app)
//End point pour les requette 404
app.use(((req,res)=>
    {
        const message = "Impossible de trouver cette page essayer une autre Url..."
         res.status(404).json(message) 
    }))
app.listen(port,console.log(`Serveur demarer sur http://localhost:${port}`));
