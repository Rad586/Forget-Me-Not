function fall_damage_modifier(context) {
	const { entity } = context, { level } = entity;
	if (level.isClientSide()) return 0;

	const { fallHeight } = context;
	const value = fallHeight - 4.76;
	const final = value < 0 ? 0 : Math.max(parseInt(value), 1); /* requires an int */
	const pData = entity.persistentData;
	const nodmg =
		final == 0 ||
		entity.nbt.ShoulderEntityLeft ||
		Block.get(entity.block.id) instanceof LeavesBlock || 
		pData.gliding == true

	pData.gliding = false;
	if (global.within(4.76, 6.76, fallHeight)) {
		entity.potionEffects.add("speed", 20, 0, true, false);
		global.sound(level, entity, "entity.player.small_fall", 0.5);
	};
	if (!nodmg) global.sound(level, entity, "entity.player.big_fall", 0.8);

	return nodmg ? 0 : final;
}