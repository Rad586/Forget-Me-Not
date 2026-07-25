const player_effects = {
    "kubejs:invincible": (player, type) => 
        type != "mob" || !player.hasEffect("kubejs:parry"),
    "kubejs:blast_immunity": (player, type) => 
        ["explosion", "explosion.player", "firework"].includes(type)
}

function player_immune(e, entity, type) {
    const effects = global.getEffects(entity);

    Object.keys(effects).forEach(id => {
        const info = player_effects[id];
        if (!info || !info(entity, type)) return;

        e.cancel()
    });

    if (entity.getTicksFrozen() < 60 ||
        !["inFire", "onFire"].includes(type)) return;

    e.cancel()
}