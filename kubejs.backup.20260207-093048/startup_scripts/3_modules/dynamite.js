function dynamite_block(entity, result) {
	const {level} = entity;
	if(level.isClientSide()) return;
	const {x, y, z} = result.blockPos;

	entity.owner.potionEffects.add("kubejs:blast_immunity", 20, 0, true, false);
	level.createExplosion(x, y, z).strength(6).explode();
	entity.discard();

	global.particleBurst(entity, "lava", 12, 0.2);
};
function dynamite_entity(entity) {
	const {level} = entity;
	if(level.isClientSide()) return;

	const item = level.createEntity("item");
	item.item = "kubejs:dynamite";
	item.copyPosition(entity);
	item.setMotion(0, 0.3, 0);
	item.spawn();
	entity.discard();

	global.sound(entity, "block.azalea.fall");
	global.particleBurst(entity, "large_smoke", 3, 0.06);
}