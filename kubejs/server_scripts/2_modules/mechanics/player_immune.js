const player_effects = {
    "kubejs:invincible": (player, type) => true,
    "kubejs:blast_immunity": (player, type) => {
        if (["explosion", "explosion.player", "firework"].includes(type)) return true
    }
}

function player_immune(e, entity, type) {
    const effects = global.getEffects(entity);

    Object.keys(effects).forEach(id => {
        const info = player_effects[id];
        if (info && info(entity, type)) {
            e.cancel()
        }
    });

    if (entity.getTicksFrozen() > 60 && 
        ["inFire", "onFire"].includes(type)) {
        e.cancel()
    }
}