const fire_starters = [
	"minecraft:torch", "minecraft:soul_torch"
];

Utils.getRegistry("minecraft:block").getIds().forEach(id => {
	const { path } = id;
	if (!path.contains("campfire") && !path.contains("candle")) return;

	BlockEvents.rightClicked(id, e => {
		if (e.hand == "off_hand") return;
		const { block } = e;
		if (!fire_starters.includes(e.item.id) || block.properties.lit == "true") return;

		const { x, y, z } = block;
		e.player.sendData("fire_starter", { pos: [x, y, z] });
		e.cancel()
	})
})