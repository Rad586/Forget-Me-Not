PlayerEvents.advancement("kubejs:the_end", e => {
	const {player} = e, {potionEffects} = player;
	player.revokeAdvancement("kubejs:the_end");

	if(e.server.persistentData.ender_dragon){
		potionEffects.add("jump_boost", 21, 9, true, false);
		potionEffects.add("slow_falling", 21, 0, true, false);
	}
	else potionEffects.add("jump_boost", 21, 0, true, false);
})