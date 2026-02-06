ItemEvents.rightClicked("kubejs:fire_extinguisher", e => {
    const {server, player, level} = e;
    let counter = 0;

    server.scheduleInTicks(2, callback => {
        counter++;
        const {x, y, z} = player;

        const powder = level.createEntity("kubejs:powder");
        powder.copyPosition(player);
        powder.setY(player.eyeY);
        powder.setDeltaMovement(player.lookAngle.scale(2));
        
        powder.spawn();

        level.playSound(null, x, y, z, "minecraft:block.fire.extinguish", "master", 0.1, 2);
        if(counter < 2) callback.reschedule();
    })
})