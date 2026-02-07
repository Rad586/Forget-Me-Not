PlayerEvents.advancement("kubejs:dizzying", e => {
	const {player} = e;
	player.revokeAdvancement("kubejs:dizzying");

	if(Math.random() > 0.3) return;
	const {lastHurtMob} = player;
	if(!lastHurtMob || 
		!lastHurtMob.isLiving() || 
		lastHurtMob.isPlayer() || 
		!lastHurtMob.isAlive()
	) return;

	const {potionEffects} = lastHurtMob;
	potionEffects.add("minecraft:weakness", 30, 9, true, false);
	potionEffects.add("minecraft:slowness", 20, 9, true, false);

	global.particleBurst(lastHurtMob, blood_particle, 14, 0.1);
})