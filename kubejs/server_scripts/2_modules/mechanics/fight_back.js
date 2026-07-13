function fight_back_attack(player, target, amount) {
	if(amount < 3) return;

	const effect = player.getEffect("kubejs:fight_back");
	if (!effect || target.invulnerableTime > 0) return;
	const { amplifier } = effect;
	player.removeEffect("kubejs:fight_back");
	player.heal(1);

	if (amplifier <= 0) return;
	player.potionEffects.add(
		"kubejs:fight_back",
		Math.min(60, effect.duration + 40),
		effect.amplifier - 1,
		true, false
	)
}

function fight_back_hurt(player, amount) {
	if(amount < 2.1) return;

	const effect = player.getEffect("kubejs:fight_back");
	if(!effect) {
		player.potionEffects.add(
			"kubejs:fight_back",
			JavaMath.clamp(amount * 6, 40, 60), 
			Math.min(10, amount/2) - 1,
			true, false
		)
	}
	else {
		player.removeEffect("kubejs:fight_back");
		player.potionEffects.add(
			"kubejs:fight_back",
			Math.min(60, effect.duration + 40), 
			Math.min(10, amount/2 + effect.amplifier) - 1,
			true, false
		)
	}
}