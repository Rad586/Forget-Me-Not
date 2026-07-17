function fight_back_attack(player, amount) {
	const effect = player.getEffect("kubejs:fight_back");
	if (!effect) return;
	const { amplifier } = effect;

	player.heal(amount * (amplifier + 1) / 5);
	player.removeEffect("kubejs:fight_back")
}

function fight_back_hurt(player, amount) {
	if(amount < 3) return;
	const amp = (amount) => amount / 3;
	const time = (amount) => amount * 13;

	const effect = player.getEffect("kubejs:fight_back");
	if(!effect) {
		player.potionEffects.add(
			"kubejs:fight_back",
			Math.min(60, time(amount)), 
			Math.min(3, amp(amount)) - 1,
			true, false
		)
	}
	else {
		player.potionEffects.add(
			"kubejs:fight_back",
			Math.min(60, time(amount)), 
			Math.min(4, amp(amount) + effect.amplifier),
			true, false
		)
	}
}