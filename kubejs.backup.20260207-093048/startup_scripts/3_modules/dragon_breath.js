function dragon_breath_tick(entity) {
	const {level} = entity;
	if(level.isClientSide() || entity.age % 3) return;

	const {x, y, z} = entity;
	level.spawnParticles("minecraft:dragon_breath", true, x, y, z, 0, 0, 0, 1, 0.014);
};
function dragon_breath(context) {
	const {entity} = context, {level} = entity;
	if(level.isClientSide() || Math.random() > 0.4) return;

	const cloud = level.createEntity("minecraft:area_effect_cloud");
	cloud.copyPosition(entity);
	cloud.mergeNbt({RadiusOnUse:0,RadiusPerTick:0,Particle:"dragon_breath",Radius:1.4,Duration:20,Effects:[{Id:7,Amplifier:0,Duration:20,show_particles:false}]});
	cloud.spawn();

	entity.discard();
}