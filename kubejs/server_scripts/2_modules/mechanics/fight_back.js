PlayerEvents.advancement("kubejs:fight_back", e => {
	const {player} = e;
	player.revokeAdvancement("kubejs:fight_back");

	const effect = player.getEffect("kubejs:fight_back");
	if(!effect || global.throttle(player, 20, 'fb')) return;

	const {amplifier} = effect;
	player.removeEffect("kubejs:fight_back");
	player.heal(1);

	if(amplifier <= 0) return;
	player.potionEffects.add(
		"kubejs:fight_back",
		Math.min(60, effect.duration + 40), 
		effect.amplifier - 1,
		true, false
	)
})

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