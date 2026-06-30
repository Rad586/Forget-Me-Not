PlayerEvents.advancement("kubejs:slow_tick", e => {
    const { server, level, player } = e;
    const manager = level.structureManager();
    const registry = level.registryAccess()
        .registryOrThrow(Registry.STRUCTURE_REGISTRY);
    const pos = player.blockPosition()

    player.revokeAdvancement("kubejs:slow_tick");

    miningFatigue(registry, manager, player, pos);
    tpToTop(server, registry, level, manager, player, pos)
})