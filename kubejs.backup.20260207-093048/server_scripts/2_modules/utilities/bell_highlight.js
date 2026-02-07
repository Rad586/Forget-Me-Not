ItemEvents.rightClicked("minecraft:bell", e => {
    const {server, level, player} = e, {x, y, z} = player;
    let raiders = 0;

    player.addItemCooldown("minecraft:bell", 80);
    global.sound(player, "minecraft:block.bell.use", 0.06, 1.1);
    global.sound(player, "minecraft:block.bell.resonate", 0.6, 2);

    for(let i = 0; i < 4; i++) {
        let dx = (i % 2 ? 1 : -1);
        let dz = (i < 2 ? 1 : -1);
        let aabb = AABB.of(x+48*dx, y+48, z+48*dz, x, y-48, z);
        server.scheduleInTicks(i+20, () => {
            const entities = level.getEntitiesWithin(aabb).filter(e => e instanceof Raider);
            entities.forEach(e => {
                raiders++;
                e.potionEffects.add("minecraft:glowing", 600, 0, true, false);
            });
            player.statusMessage = raiders + Text.translate("dialogue.fmn.raider").getString()
        })
    }
})