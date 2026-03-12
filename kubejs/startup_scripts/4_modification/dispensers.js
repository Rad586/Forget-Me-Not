function ender_pearl(key, block, item) {
	const { level, pos } = block;
	if (level.isClientSide()) return;

	const { x, y, z } = pos;
	const oldDispenser = level.getBlock(pos);
	const { facing } = oldDispenser.properties;
	const {x: x1, y: y1, z: z1} = Direction[facing];

	item.shrink(1);

	const ender_pearl = level.createEntity(key);
	ender_pearl.setPosition(
		x + 0.5 + x1 * 0.5,
		y + 0.5 + y1 * 0.5,
		z + 0.5 + z1 * 0.5
	);
	ender_pearl.setMotion(x1, y1, z1);
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
	const { level, pos } = block;
	if (level.isClientSide()) return;

	const { x, y, z } = pos;
	const dispenser = level.getBlock(pos);
	const { facing } = dispenser.properties;
	const { x: x1, y: y1, z: z1 } = Direction[facing];

	item.shrink(1);
	const { entityData } = dispenser;
	server.scheduleInTicks(0, () => dispenser.entityData = entityData)

	const sticky_torch = level.createEntity("kubejs:sticky_torch");
	sticky_torch.setPosition(
		x + 0.5 + x1 * 0.5,
		y + 0.5 + y1 * 0.5,
		z + 0.5 + z1 * 0.5
	);
	sticky_torch.setMotion(x1, y1, z1);
	sticky_torch.spawn()
})