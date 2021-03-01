const Joi = require('joi');
let Models = require('../Models');
let UniversalFunctions = require('../Utils/UniversalFunctions');
let Config = require('../Config');
let Service = require('../Services');
let formidable = require('formidable');
let fs = require('fs');
let logger = require('../Config/logger');
let uploadImage = require('../Utils/uploadImage');

module.exports = [
    {
        method: 'POST',
        path: '/cattle/addCattle',
        handler: async  (request, h) =>{
            let {payload:payloadData} = request;
            let {imageQueue} = require('../server')
            try {
                let {name,species,weight,length,long,lat,image} = payloadData;
                let obj = {
                    name:name,
                    species:species,
                    weight:weight,
                    length:length,
                    latlong:[parseFloat(long),parseFloat(lat)],
                    createdAt:new Date(),
                };
                const data = await Service.DataServices.createData(Models.cattle,obj);
                await imageQueue.add({image: payloadData.image,cattleId:data._id});
                return UniversalFunctions.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, {})
            }
            catch (err) {
                console.log("--------",err);
                return UniversalFunctions.sendError(err)
            }
        },
        config: {
            tags: ['api', 'cattle'],
            payload: {
                maxBytes: 1024 * 1024 * 5,
                multipart: {output: "file"},
                parse: true
            },
            validate: {
                payload: Joi.object({
                    name : Joi.string().required(),
                    species : Joi.string().required(),
                    weight : Joi.number().required().min(1),
                    length : Joi.number().required().min(1),
                    long : Joi.number().required(),
                    lat : Joi.number().required(),
                    image: Joi.any().meta({swaggerType: 'file'}).description('image File').required(),
                }),
                failAction: UniversalFunctions.failActionFunction
            },
            plugins: {
                'hapi-swagger': {
                      payloadType: 'form',
                    responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/cattle/getcattle',
        handler: async  (request, h) =>{
            let {query:payloadData} = request;
            try {
                let finalData = {};
               let list,count;
                await Promise.all([
                    list =(async () =>{
                        let criteria = {isActive:true};
                        let projection ={name:1,species:1,weight:1,length:1,latlong:1,createdAt:1,resizedURL:1};
                        let options = {sort:{createdAt:-1},skip:payloadData.skip,limit:payloadData.limit,lean:true};
                        const data = await Service.DataServices.getData(Models.cattle,criteria,projection,options);
                        finalData.list =data;
                    })(),
                    count =(async () =>{
                        let criteria = {isActive:true};
                        const data = await Service.DataServices.dataCount(Models.cattle,criteria);
                        finalData.count =data;
                    })()
                ]);
                return UniversalFunctions.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT,finalData)
            }
            catch (err) {
                return UniversalFunctions.sendError(err)
            }
        },
        config: {
            tags: ['api', 'words'],
            validate: {
                query: Joi.object({
                    skip : Joi.number().required().min(0),
                    limit : Joi.number().required().min(1),
                }),
                failAction: UniversalFunctions.failActionFunction
            },
            plugins: {
                'hapi-swagger': {
                      payloadType: 'form',
                    responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },
 ];


