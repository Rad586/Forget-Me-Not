PlayerEvents.advancement("kubejs:tip/updated", e => {
    const { server, player } = e, { persistentData } = server;
    if (persistentData.nether_stage == true) return;

    server.persistentData.nether_stage = true;
    global.reloadStartupScript()

    const players = server.players.filter(p => p != player);
    players.forEach(p => p.unlockAdvancement("kubejs:tip/updated"))
})