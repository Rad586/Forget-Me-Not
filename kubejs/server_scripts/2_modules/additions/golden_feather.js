const golden_feathers = {
	"kubejs:golden_feather": {time:"2", amp:"0"},
	"kubejs:enchanted_golden_feather": {time:"7", amp:"30"},
};

ItemEvents.rightClicked(["kubejs:golden_feather", "kubejs:enchanted_golden_feather"], e => {
	const {server, item, player} = e;
	const info = golden_feathers[item.id];

	server.scheduleInTicks(20, () => player.potionEffects.add("kubejs:soft_landing", info.time*20, 0));
	player.potionEffects.add("levitation", 20, info.amp, true, false);
	global.sound(player, "block.amethyst_cluster.break", 1, 1, 0.14);

	item.count -= player.isCreative() ? 0 : 1;
})