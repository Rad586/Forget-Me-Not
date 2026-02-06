const demon_sfx = {
    "entity.warden.heartbeat": {volume: 2, pitch: 0.6, shift: 0.1},
    "entity.warden.roar": {volume: 1, pitch: 1.45, shift: 0.2},
    "block.beacon.deactivate": {volume: 1, pitch: 1, shift:0.2},
    "entity.wither.spawn": {volume: 1.36, pitch: 1.9, shift:0.1},
    "entity.wither.hurt": {volume: 0.5, pitch: 0.6, shift:0.1},
    "entity.warden.heartbeat": {volume: 2, pitch: 0.6, shift:0.1},
    "entity.elder_guardian.ambient": {volume: 0.6, pitch: 0.6, shift:0.1},
    "item.totem.use": {volume: 0.5, pitch: 0.8, shift:0.1},
    "entity.firework_rocket.large_blast_far": {volume: 1, pitch: 0.6, shift:0.1}
};
const demon_effects = {
    "regeneration": {time: 30, amp: 5},
    "fire_resistance": {time: 800},
    "kubejs:invincible": {time: 60},
    "wither": {time: 30, particle: false},
    "saturation": {time: 30, amp: 2, particle: false}
};

function heart_of_demon(e) {
    const entity = e.entity;
    const {x, y, z, level, server} = entity;

    if(!entity.isHoldingInAnyHand("kubejs:heart_of_demon")) return;
    if(player.maxHealth <= 6) return;

    entity.sendData("totemAnimation", {item: "kubejs:heart_of_demon"});

    global.particleBurst(entity, "soul_fire_flame", 30, 0.4);
    level.spawnParticles("alessandrvenchantments:enderwave", true, x, y, z, 0, 0, 0, 1, 0);

    Object.keys(demon_sfx).forEach(s => {
        const sfxInfo = demon_sfx[s];
        global.sound(entity, s, sfxInfo.volume, sfxInfo.pitch, sfxInfo.shift)
    });
    server.scheduleInTicks(30, () => global.sound(entity, "entity.warden.heartbeat", 2, 0.6, 0.1));

    level.getEntitiesWithin(AABB.of(x-4, y-2, z-4, x+4, y+2, z+4)).forEach((entity2) => {
        if(!entity2.isLiving() || entity2 == entity) return;
        entity2.knockback(1.0, x-entity2.x, z-entity2.z);
    });	

    global.updateMaxHealth(player, -2);

    effectPack(demon_effects, entity);
    entity.setHealth(2.0);
    e.cancel();
}