const battleShipRouter = require('../src/routers/battleShipRouter');
const xoRouter = require('../src/routers/xoRouter');
module.exports = {
    MAPPING_ROUTERS : {
        '/api/v1/battle-ship' : battleShipRouter,
        '/api/v1/xo': xoRouter
    }
    
}