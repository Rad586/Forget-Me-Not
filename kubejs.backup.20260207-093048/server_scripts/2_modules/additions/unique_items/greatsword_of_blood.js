ItemEvents.rightClicked("kubejs:greatsword_of_blood", e => {
	const {player} = e;
	player.addItemCooldown("kubejs:greatsword_of_blood", 400);
	player.potionEffects.add("kubejs:shadow_form", 100, 0, true, false);
	player.attack(player.health >= 14.5 ? 14 : 13);

	global.particleBurst(player, blood_particle, 32, 0.3, 0.2);
	global.sound(player, "block.bell.use", 0.07, 0.5);
	global.sound(player, "entity.wither.ambient", 0.24, 0.5);
	global.sound(player, "entity.wither.spawn", 1, 1.5);
	global.sound(player, "entity.wither.hurt", 0.38, 0.68);
	global.sound(player, "entity.player.breath", 1, 0.5);
	global.sound(player, "entity.warden.heartbeat", 2, 0.5);
	global.sound(player, "entity.vex.death", 2, 1.07);
})