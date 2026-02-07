ItemEvents.rightClicked("kubejs:amethyst_feather", e => {
	const {player, item} = e;
	if(player.hasEffect("kubejs:timer") || player.hasEffect("kubejs:soft_landing")) return;
	const {server, potionEffects} = player;
	let counter = 0;

	function gliding() {
		server.scheduleInTicks(1, callback => {
			counter++
			if(player.pitch < -20 || counter > 100 || player.isOnGround()) {
				potionEffects.add("kubejs:soft_landing", 100, 0);
				return;
			};
			player.startFallFlying();
			player.resetFallDistance();
			potionEffects.add("kubejs:timer", 5, 0, true, false);
			callback.reschedule();
		})
	};

	player.addItemCooldown(item, 60);
	item.count -= player.isCreative() ? 0 : 1;

	potionEffects.add("levitation", 15, 30, true, false);
	server.scheduleInTicks(40, () => gliding());

	global.sound(player, "block.amethyst_cluster.break", 1, 1, 0.14);
})

ItemEvents.rightClicked("minecraft:firework_rocket", e => {
	const {player} = e;
	if(!player.hasEffect("kubejs:timer")) {
		if(player.chestArmorItem.id == "minecraft:elytra") player.startFallFlying();
		return;
	};
	global.sound(player, "block.fire.extinguish", 0.6, 1, 0.14);
	e.cancel();
})