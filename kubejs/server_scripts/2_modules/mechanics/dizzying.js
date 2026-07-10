function dizzying(level, target, amount) {
	if (amount < 11 || Math.random() > 0.3) return;

	const { potionEffects } = target;
	potionEffects.add("minecraft:weakness", 30, 9, true, false);
	potionEffects.add("minecraft:slowness", 20, 9, true, false);

	global.particleBurst(level, target, blood_particle, 14, 0.1)
}