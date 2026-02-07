ItemEvents.rightClicked("minecraft:water_bucket", e => {
	const {entity} = e.target;
	if(!entity || !entity.isOnFire() || !entity.isAlive()) return;

	entity.extinguish();
	global.particleBurst(entity, "splash", 24, 0, entity.boundingBox.size/4);
	global.sound(entity, "block.fire.extinguish", 0.4, 2);
	e.player.swing();
	e.cancel()
})