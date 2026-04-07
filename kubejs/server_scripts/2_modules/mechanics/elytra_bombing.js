ItemEvents.rightClicked("minecraft:tnt", e => {
	const { player, level } = e;
	if (!player.isFallFlying()) return;

	const tnt = level.createEntity("tnt");
	tnt.copyPosition(player);
	tnt.setDeltaMovement(player.deltaMovement.multiply(0.5, 0.5, 0.5))
	tnt.spawn();
	e.item.shrink(1);

	tnt.playSound("entity.tnt.primed", 1, 2);
	global.particleBurst(level, tnt, "flame", 3, 0.08, 0.15)
})