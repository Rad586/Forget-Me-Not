EntityEvents.death("minecraft:player", e => {
	const {entity, source} = e;
	medallion(e);
	heart_of_demon(e);
	recovery_pearl_death(entity);
	ender_dragon_death(entity, source.actual);
	mob_sense(entity);
})