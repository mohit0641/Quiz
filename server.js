'use strict';

const Hapi = require('@hapi/hapi');
let Plugins = require('./Plugins');
let mongoose = require('mongoose');
let Routes = require('./Routes');
let logger = require('./Config/logger');
//let Queue = require('bull');
//let uploadImage = require('./Utils/uploadImage');
//let Service = require('./Services');
//let Models = require('./Models');

(async () => {
    try {

        const server = Hapi.Server({
            app: {
                name: "Word Counter"
            },
            port: 8000,
            routes: {cors: true}
        });

        await mongoose.connect("mongodb://localhost:27017/quiz", {useNewUrlParser: true,useUnifiedTopology:true});
        logger.info('MongoDB Connected');

        server.route(
            [
                {
                    method: 'GET',
                    path: '/',
                    handler:  (req, h) =>{
                        //TODO Change for production server
                        return h.view('index')

                    }
                },
            ]
        );
        await server.register(Plugins);

        server.views({
            engines: {
                html: require('handlebars')
            },
            relativeTo: __dirname,
            path: './Views'
        });

        server.route(Routes);

        await server.start();

        logger.log('info','Server running at %s', server.info.uri);

    }
    catch (err) {
        logger.log("error","====================", err);
        process.exit(1);
    }
})();


