const player_effects = {
    "kubejs:invincible": (player, type) => true,
    "kubejs:blast_immunity": (player, type) => {
        if (["explosion", "explosion.player", "firework"].includes(type)) return true
    }
}

function player_immune(e, entity, type) {
    const { type } = source;

    const effects = global.getEffects(entity);
    for (const id in effects) {
        if (effects[id](entity, type)) e.cancel()
    };

    if (entity.getTicksFrozen() > 60 && ["inFire", "onFire"].includes(type)) {
        e.cancel()
    }
}