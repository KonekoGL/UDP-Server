const dbconfig = require('../config/db.config.json');
const rethinkdb = require('rethinkdb');
const validate = require('validatorjs');
const crypto = require('crypto');
const moment = require('moment');

exports.create = async (req, reply) => {
    let rules = {
        'maxPlayers': 'required'
    };

    const validation = await new validate(req.body, rules);

    if (validation.fails()) {
        return response.badRequest(validation.messages[0]);
    }

    let db = await rethinkdb.connect(dbconfig);

    var roomId = 0;
    var taken = true;
    
    while(taken) {
        roomId = crypto.randomBytes(3).toString('hex');
        await rethinkdb.table('rooms').filter({'roomId': roomId}).run(db, (err, cursor) => {
            if(err) throw err;

            if (cursor === null) {
                taken = false;
            }
            else {
                cursor.toArray(function(err, results) {
                    if (err) throw err;

                    if (results.length == 0) {
                        taken = false;
                    }
                });
            }
        });
    }

    rethinkdb.table('rooms').insert({
        roomId: roomId,
        maxPlayers: req.body.maxPlayers,
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
    }).run(db, (err) => {
        if(err) throw err;
    });

    return reply.code(201).send({
        roomId: roomId
    });
};

exports.close = async (req, reply) => {
    let rules = {
        'roomId': 'required',
    };

    const validation = await new validate(req.body, rules);
    if (validation.fails()) {
        return response.badRequest({message: 'roomId_missing'});
    }

    let db = await rethinkdb.connect(dbconfig);

    rethinkdb.table('rooms').filter({
        'roomId': req.body.roomId
    }).delete().run(db, (err) => {
        if(err) throw err;
    });

    return reply.code(200).send({
        message: 'closed'
    });
};

exports.join = async (req, reply) => {
    let rules = {
        roomId: 'required'
    };

    const validation = await new validate(req.body, rules);
    if(validation.fails()){
        return response.badRequest({message: 'roomId_missing'});
    }

    let db = await rethinkdb.connect(dbconfig);

    let exists = true; 
    await rethinkdb.table('rooms').filter({'roomId': req.body.roomId}).run(db, (err, cursor) => {
        if(err) throw err;

        if (cursor === null) {
            exists = false;
        }
        else {
            cursor.toArray(function(err, results) {
                if (err) throw err;
    
                if (results.length == 0) {
                    exists = false;
                }
            });
        }
    });

    if(!exists){
        return reply.code(404).send({
            message: 'room not found'
        });
    }

    let playerId = 0;
    await rethinkdb.table('players').insert(req.body, {return_changes: true}).run(db, (err, result) => {
        playerId = result.generated_keys[0];
    });

    return reply.code(200).send({
        playerId: playerId
    });
};

exports.leave = async (req, reply) => {
    let rules = {
        playerId: 'required'
    };

    const validation = await new validate(req.body, rules);
    if(validation.fails()){
        return response.badRequest({message: validation.messages[0]});
    }

    let db = await rethinkdb.connect(dbconfig);

    rethinkdb.table('players').filter({'id': req.body.playerId}).delete().run(db, (err) => {
        if(err) throw err;
    });

    return reply.code(200).send({
        message: 'left_room'
    });
};