const Block = global.Block
const { random, server } = Utils

const blood_particle = global.itemParticle("minecraft:redstone_block")

const toggles = {
    "limited_lives": (server, level, player, value) => { global.updateMaxHealth(player) },
    "drop_requires_player": (server, level, player, value) => { },
    "trade_lock": (server, level, player, value) => { }, 
    "haunting": (server, level, player, value) => { }
}
Object.keys(toggles).forEach(name => {
    global.toggles[name] = (server, level, player, value) => {
        server.persistentData[name] = value;
        global[name] = value;
        toggles[name](server, level, player, value);
    }
})