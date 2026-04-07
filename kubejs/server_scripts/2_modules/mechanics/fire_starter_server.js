const fire_starters = [
	"minecraft:torch", "minecraft:soul_torch"
];

Utils.getRegistry("minecraft:block").getIds().forEach(id => {
	const { path } = id;
	if (!path.contains("campfire") && !path.contains("candle")) return;
	BlockEvents.rightClicked(id, e => {
		if (e.hand == "off_hand") return;

		const { block, item: { id }, entity, level } = e;
		if (!fire_starters.includes(id) || block.properties.lit == "true") return;

		const { x, y, z } = block;
		Item.of("flint_and_steel").useOn(
			new UseOnContext(
				level, entity, null, Item.of("air"),
				new BlockHitResult(entity.getViewVector(1), "up", new Vec3(x, y, z), false)
			)
		);

		global.particleBurstBlock(level, x, y, z, "flame", 3, 0.04, 0.2);
		global.particleBurstBlock(level, x, y, z, "smoke", 3, 0, 0.4);
		global.sound(level, entity, "block.fire.ambient", 2, 2);
		global.sound(level, entity, "item.firecharge.use", 0.3, 1.2);

		entity.swing();
		e.cancel()
	})
})

NetworkEvents.dataReceived("fire_starter", e => {
	const { data, level, player } = e, { pos } = data;
	const x = pos[0], y = pos[1], z = pos[2];
	const soul = player.mainHandItem.is("minecraft:soul_torch");

	Item.of("flint_and_steel").useOn(
		new UseOnContext(
			level, player, null, Item.of("air"),
			new BlockHitResult(player.getViewVector(1), "up", new Vec3(x, y, z), false)
		)
	);

	level.spawnParticles(
		soul ? "soul_fire_flame" : "flame", true,
		x + 0.5, y + 0.5, z + 0.5,
		0.2, 0.2, 0.2,
		3, 0.04
	);
	level.spawnParticles("smoke", true,
		x + 0.5, y + 0.5, z + 0.5,
		0.4, 0.4, 0.4,
		3, 0
	);
	level.playSound(
		null, x + 0.5, y, z + 0.5,
		"block.fire.ambient", "master",
		2, 2
	);
	level.playSound(null, x + 0.5, y, z + 0.5,
		"item.firecharge.use", "master",
		0.3, 1.2
	);
	player.swing();
	e.cancel()
})