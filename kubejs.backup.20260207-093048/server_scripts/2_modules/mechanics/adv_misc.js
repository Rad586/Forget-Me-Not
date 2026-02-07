PlayerEvents.advancement("kubejs:tip/updated", e => {
    const {server, player} = e, {persistentData} = server;
    if(persistentData.nether_stage == true) return; 

    server.persistentData.nether_stage = true;
    server.runCommandSilent("kjs reload startup_script");

    const players = server.players.filter(p => p != player);
    players.forEach(p => p.unlockAdvancement("kubejs:tip/updated"))
})

PlayerEvents.advancement("kubejs:memory_removal", e => {
    const {server} = e, {persistentData} = server;
    if(persistentData.ender_dragon == true) return;

    persistentData.ender_dragon = true;
    server.runCommandSilent("kjs reload startup_script");

    server.players.forEach(player => {
        const {level, potionEffects} = player;
        if(level.dimension != "minecraft:the_end") return;
        potionEffects.add("jump_boost", 999999, 9, true, false);
        potionEffects.add("slow_falling", 999999, 0, true, false);
        global.sound(player, "block.beacon.activate");
    })
})