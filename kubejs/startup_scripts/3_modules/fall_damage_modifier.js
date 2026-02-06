function fall_damage_modifier(context) {
	const { entity } = context;
	const { level } = entity;
	if (level.isClientSide()) return 0;

	const { fallHeight } = context;
	const crouching = entity.isCrouching();
	const value = fallHeight - 4.76 - (crouching ? 2 : 0);
	const final = value < 0 ? 0 : Math.max(parseInt(value), 1); /* requires an int */
	const nodmg =
		final == 0 ||
		entity.nbt.ShoulderEntityLeft ||
		level.dimension == "minecraft:the_nether" || 
		Block.get(entity.block.id) instanceof LeavesBlock

	if (global.within(4.76, 6.76, fallHeight) && crouching) {
		entity.potionEffects.add("speed", 20, 0, true, false);
		global.sound(entity, "entity.player.small_fall", 0.5);
	};
	if (!nodmg) global.sound(entity, "entity.player.big_fall", 0.8);

	return nodmg ? 0 : final;
}