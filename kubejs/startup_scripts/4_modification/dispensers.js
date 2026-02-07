function ender_pearl(key, block, item) {
	const facingMap = {
		"east": [1, 0, 0],
		"west": [-1, 0, 0],
		"south": [0, 0, 1],
		"north": [0, 0, -1],
		"up": [0, 1, 0],
		"down": [0, -1, 0]
	};

	const { level, pos } = block;
	if (level.isClientSide()) return;
	const { x, y, z } = pos;
	const oldDispenser = level.getBlock(pos);
	const { facing } = oldDispenser.properties;
	const facingData = facingMap[facing];

	item.count--;

	const ender_pearl = level.createEntity(key);
	ender_pearl.setPosition(
		x + 0.5 + facingData[0] * 0.5,
		y + 0.5 + facingData[1] * 0.5,
		z + 0.5 + facingData[2] * 0.5
	);
	ender_pearl.setMotion(facingData[0], facingData[1], facingData[2]);
	ender_pearl.spawn();

	const newDispenser = level.createEntity("falling_block");
	newDispenser.mergeNbt({
		BlockState: {
			Name: "minecraft:dispenser",
			Properties: { facing: facing }
		},
		TileEntityData: { Items: oldDispenser.entityData.Items }
	});
	newDispenser.copyPosition(ender_pearl);
	newDispenser.startRiding(ender_pearl);
	newDispenser.spawn();

	oldDispenser.inventory.clear();
	oldDispenser.set("air");
};

DispenserBlock.registerBehavior(Item.of("minecraft:ender_pearl").item, (block, item) => ender_pearl("minecraft:ender_pearl", block, item))
DispenserBlock.registerBehavior(Item.of("kubejs:sticky_ender_pearl").item, (block, item) => ender_pearl("kubejs:sticky_ender_pearl", block, item))

DispenserBlock.registerBehavior(Item.of("kubejs:sticky_torch").item, (block, item) => {
	const facingMap = {
		"east": [1, 0, 0],
		"west": [-1, 0, 0],
		"south": [0, 0, 1],
		"north": [0, 0, -1],
		"up": [0, 1, 0],
		"down": [0, -1, 0]
	};

	const { level, pos } = block;
	if (level.isClientSide()) return;
	const { x, y, z } = pos;
	const dispenser = level.getBlock(pos);
	const { facing } = dispenser.properties;
	const facingData = facingMap[facing];

	item.shrink(1);
	const { entityData } = dispenser;
	server.scheduleInTicks(0, () => dispenser.entityData = entityData)

	const sticky_torch = level.createEntity("kubejs:sticky_torch");
	sticky_torch.setPosition(
		x + 0.5 + facingData[0] * 0.5,
		y + 0.5 + facingData[1] * 0.5,
		z + 0.5 + facingData[2] * 0.5
	);
	sticky_torch.setMotion(facingData[0], facingData[1], facingData[2]);
	sticky_torch.spawn();
})