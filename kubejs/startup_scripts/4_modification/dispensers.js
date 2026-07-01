function ender_pearl(key, block, item) {
	const { level, pos } = block;
	if (level.isClientSide()) return item;

	const { x, y, z } = pos;
	const oldDispenser = level.getBlock(pos);
	const { facing } = oldDispenser.properties;
	const {x: x1, y: y1, z: z1} = Direction[facing];

	item.shrink(1);

	const newDispenser = level.createEntity("falling_block");
	newDispenser.mergeNbt({
		BlockState: {
			Name: "minecraft:dispenser",
			Properties: { facing: facing }
		},
		TileEntityData: { Items: oldDispenser.entityData.Items }
	});
	newDispenser.setPosition(
		x + 0.5 + x1 * 0.5,
		999999,
		z + 0.5 + z1 * 0.5
	);
	newDispenser.spawn();

	const ender_pearl = level.createEntity(key);
	ender_pearl.copyPosition(newDispenser);
	ender_pearl.setY(y + 0.5 + y1 * 0.5);
	ender_pearl.setMotion(x1, y1, z1);
	ender_pearl.setOwner(newDispenser);
	ender_pearl.spawn();

	oldDispenser.inventory.clear();
	oldDispenser.set("air");

	return item
};

DispenserBlock.registerBehavior(Item.of("minecraft:ender_pearl").item, (block, item) => ender_pearl("minecraft:ender_pearl", block, item))
DispenserBlock.registerBehavior(Item.of("kubejs:sticky_ender_pearl").item, (block, item) => ender_pearl("kubejs:sticky_ender_pearl", block, item))

DispenserBlock.registerBehavior(Item.of("kubejs:sticky_torch").item, (block, item) => {
	const { level, pos } = block;
	if (level.isClientSide()) return item;

	const { x, y, z } = pos;
	const dispenser = level.getBlock(pos);
	const { facing } = dispenser.properties;
	const { x: x1, y: y1, z: z1 } = Direction[facing];

	const sticky_torch = level.createEntity("kubejs:sticky_torch");
	sticky_torch.setPosition(
		x + 0.5 + x1 * 0.5,
		y + 0.5 + y1 * 0.5,
		z + 0.5 + z1 * 0.5
	);
	sticky_torch.setMotion(x1, y1, z1);
	sticky_torch.spawn();

	item.shrink(1);
	return item
})

global.Pickaxes.concat(global.Shovels, global.Axes).forEach(i => {
	DispenserBlock.registerBehavior(i, (block, item) => {
		const { level, pos } = block;
		if (level.isClientSide()) return item;

		const dispenser = level.getBlock(pos);
		const { facing } = dispenser.properties;

		const new_block = dispenser[facing];
		const { pos: pos2, blockState } = new_block;
		if (!item.isCorrectToolForDrops(blockState)) return item;

		const hardness = blockState.block.defaultDestroyTime();
		const speed = item.getDestroySpeed(blockState);
		if (Math.random() > (speed / hardness) / 3) {
			level.playSound(null, pos2, "block.stone.hit", "blocks", 1, 1);
		}
		else {
			level.destroyBlock(pos2, true);
		};
		
		return item
	})
})