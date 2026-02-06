ItemEvents.rightClicked("minecraft:tnt", e => {
	const {player} = e;
	if(!player.isFallFlying()) return;

	const tnt = e.level.createEntity("tnt");
	tnt.copyPosition(player);
	tnt.setDeltaMovement(player.deltaMovement.multiply(0.5, 0.5, 0.5))
	tnt.spawn();
	e.item.count--;

	tnt.playSound("entity.tnt.primed", 1, 2);
	global.particleBurst(tnt, "flame", 3, 0.08, 0.15)
})