const fire_starters = [
	"minecraft:torch", "minecraft:soul_torch"
];

Utils.getRegistry("minecraft:block").getIds().forEach(id => {
	const {path} = id;
	if(!path.contains("campfire") && !path.contains("candle")) return;
	BlockEvents.rightClicked(id, e => {
		if(e.hand == "off_hand") return;

		const {block, item: {id}, entity, level} = e;
		if(!fire_starters.includes(id) || block.properties.lit == "true") return;
	
		const {x, y, z} = block;
		Item.of("flint_and_steel").useOn(
			new UseOnContext(
				level, entity, null, Item.of("air"),
				new BlockHitResult(entity.getViewVector(1), "up", new Vec3(x, y, z), false)
			)
		);
	
		global.particleBurstBlock(level, x, y, z, "flame", 3, 0.04, 0.2);
		global.particleBurstBlock(level, x, y, z, "smoke", 3, 0, 0.4);
		global.sound(entity, "block.fire.ambient", 2, 2, 0.1);
		global.sound(entity, "item.firecharge.use", 0.3, 1.2, 0.2);
	
		entity.swing();
		e.cancel()
	})
})