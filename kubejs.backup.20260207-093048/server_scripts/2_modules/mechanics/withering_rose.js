BlockEvents.broken("minecraft:wither_rose", e => {
    const {player} = e;
    if(!player) return;

    const effect = entity.getEffect("minecraft:wither");
    entity.potionEffects.add(
        "minecraft:wither", 
        Math.min(100, effect ? 20 : effect.duration + 20), 0, 
        false, true
    )
})