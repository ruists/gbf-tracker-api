const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

//Routes
const elementRoutes = require('./api/routes/element');
const raceRoutes = require('./api/routes/race');
const rarityRoutes = require('./api/routes/rarity');
const styleRoutes = require('./api/routes/style');
const weaponTypeRoutes = require('./api/routes/weaponType');
const baseWeaponRoutes = require('./api/routes/baseWeapon');
const baseSummonRoutes = require('./api/routes/baseSummon');
const weaponRoutes = require('./api/routes/weapon');
const summonRoutes = require('./api/routes/summon');
const characterRoutes = require('./api/routes/character');
//

mongoose.connect('mongodb+srv://' +
    process.env.MONGO_ATLAS_U + ':' +
    process.env.MONGO_ATLAS_PW +
    '@trainingcluster.3uayb.mongodb.net/' +
    process.env.MONGO_DB_NAME + 
    '?retryWrites=true&w=majority', {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });

//log incoming requests
app.use(morgan('dev'));

//parse requests' body
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


const corsOptions = {
    optionSuccessStatus: 200,
    methods: 'PUT,POST,PATCH,DELETE,GET',
    allowedHeaders: 'ORIGIN,X-Requested-With,Content-Type,Accept,Authorization',
    origin: '*'
};
app.use(cors(corsOptions));

//Handle route requests
app.use('/element', elementRoutes);
app.use('/race', raceRoutes);
app.use('/rarity', rarityRoutes);
app.use('/style', styleRoutes);
app.use('/weaponType', weaponTypeRoutes);
app.use('/baseWeapon', baseWeaponRoutes);
app.use('/baseSummon', baseSummonRoutes);
app.use('/weapon', weaponRoutes);
app.use('/summon', summonRoutes);
app.use('/character', characterRoutes);
//

//handle other requests
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

//handle errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;