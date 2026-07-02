ItemEvents.rightClicked("minecraft:bell", e => {
    const { level, player} = e, { x, y, z } = player;
    let raiders = 0;

    player.addItemCooldown("minecraft:bell", 80);
    global.sound(level, player, "minecraft:block.bell.use", 0.06, 1.1);
    global.sound(level, player, "minecraft:block.bell.resonate", 0.6, 2);

    const entities = level
        .getEntitiesOfClass(Raider, player.boundingBox.inflate(48));
    entities.forEach(en => {
        raiders++;
        en.potionEffects.add("glowing", 600, 0, true, false);
    });
    player.statusMessage = raiders + Text.translate("dialogue.fmn.raider").getString()
})