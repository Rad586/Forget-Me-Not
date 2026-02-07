PlayerEvents.respawned(e => {
    const {player} = e;
    if(player.inventory.find("recovery_compass") == -1) {
        player.give("recovery_compass");
    };

    /* Tip */
	if(["NORMAL", "HARD"].includes(e.level.getDifficulty().toString())) {
        player.unlockAdvancement("kubejs:tip/death");
    };

    limited_lives(player);

    player.persistentData.temp = 0;
    player.potionEffects.add("kubejs:normal_temp", 10, 0, true, false);
})