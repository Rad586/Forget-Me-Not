NetworkEvents.dataReceived("sit", e => {
    const { player } = e;
    const dummy = e.level.createEntity("kubejs:dummy");

    dummy.copyPosition(player);
    dummy.playSound("item.armor.equip_leather", 0.5, 0.6);

    dummy.setYaw(player.yaw);
    e.server.scheduleInTicks(3, () => {
        dummy.spawn();
        player.setShiftKeyDown(false);
        player.startRiding(dummy)
    })
})