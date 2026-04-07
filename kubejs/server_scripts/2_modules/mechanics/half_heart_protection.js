function half_heart_protection(e, entity, damage) {
    if (damage < entity.maxHealth * 0.5 ||
        damage < entity.health ||
        e.source.type == "outOfWorld"
    ) return;

    const { level } = e;
    const currentDay = Math.floor(level.getDayTime() / 24000);
    const pData = entity.persistentData, { protection } = pData;

    if (protection == null || protection <= currentDay - 6) {
        pData.protection = currentDay;
        entity.unlockAdvancement("kubejs:tip/protection");
        global.sound(level, entity, "block.large_amethyst_bud.break", 2, 1);
        entity.setHealth(1);
        e.cancel();
    }
}