const crates = {
	"gofish:wooden_crate": "wooden_crate",
	"gofish:iron_crate": "iron_crate",
	"gofish:golden_crate": "golden_crate",
	"gofish:diamond_crate": "diamond_crate",
	"gofish:frosted_crate": "frosted_crate",
	"gofish:supply_crate": "supply_crate",
	"gofish:fiery_crate": "fiery_crate",
	"gofish:soul_crate": "soul_crate",
	"gofish:gilded_blackstone_crate": "gilded_blackstone_crate",
	"gofish:astral_crate": "astral_crate",
	"gofish:end_crate": "end_crate",
	"gofish:slimey_crate": "slimey_crate"
};

function crate_fix(e) {
	const {player, item} = e;
	const crateId = crates[item.id];
	if(!crateId || !player.isCrouching()) return;

	e.level.runCommandSilent(`loot give ${player.username} loot gofish:gameplay/fishing/${crateId}`);
	global.sound(player, "entity.item.pickup", 1, 1, 0.2);
	item.count--;
}

BlockEvents.rightClicked(e => crate_fix(e))