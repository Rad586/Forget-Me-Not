function half_heart_protection(e, entity, damage) {
    if (
        damage < entity.maxHealth * 0.5 ||
        damage < entity.health ||
        e.source.type == "outOfWorld"
    ) return;

    const currentDay = Math.floor(e.level.getDayTime() / 24000);
    const pData = entity.persistentData, { protection } = pData;

    if (protection == null || protection <= currentDay - 6) {
        pData.protection = currentDay;
        entity.unlockAdvancement("kubejs:tip/protection");
        global.sound(entity, "block.large_amethyst_bud.break", 2, 1.0, 0.2);
        entity.setHealth(1);
        e.cancel();
    }
}