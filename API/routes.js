let cors            = require("cors");
let validate        = require("./validateQuery.js");
let search          = require("./database/oscarsData_search.js");


//API Endpoints
let appRouter = function(app){
    
    //Singleton response endpoint
    app.get("/", cors(), async function(req,res){
        if(req.query.hasOwnProperty('ID')){ 
            let ID = req.query.ID;

            ID = {'ID' : parseInt(ID)};

            let result = await search(ID);

            //Response for valid ID
            if(result) res.status(200).send(result);

            //Response for invalid ID
            else res.status(400).send('Invalid Request');
        }

        //Response for empty request
        else res.status(400).send('Empty Request');
    });
    
    //Muli-object response endpoint
    app.get('/search/', cors(), async function(req,res){
    
        //Place query into corresponding database keys
        let queryOBJ = {};

        if(req.query.hasOwnProperty('w'))       queryOBJ.winner         = req.query.w;
        if(req.query.hasOwnProperty('yr'))      queryOBJ.year           = req.query.yr;     
        if(req.query.hasOwnProperty('gc'))      queryOBJ.general_cat    = req.query.gc;
        if(req.query.hasOwnProperty('c'))       queryOBJ.category       = req.query.c;
        if(req.query.hasOwnProperty('e'))       queryOBJ.entity         = req.query.e;

        //Validate query and format values for database search
        queryOBJ = validate(queryOBJ);

        //Response for valid query
        if(JSON.stringify(queryOBJ) !== '{}') res.status(200).send(await search(queryOBJ));

        //Response for invalid query
        else res.status(400).send('Invalid Request');
    });
}

module.exports = appRouter;