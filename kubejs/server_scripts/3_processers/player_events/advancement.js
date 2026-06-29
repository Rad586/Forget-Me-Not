PlayerEvents.advancement("kubejs:slow_tick", e => {
    const { server, level, player } = e;
    const manager = level.structureManager();
    const { STRUCTURE_REGISTRY } = Registry;

    player.revokeAdvancement("kubejs:slow_tick");

    miningFatigue(server, manager, player, STRUCTURE_REGISTRY);
    tpToTop(server, level, manager, player, STRUCTURE_REGISTRY)
})