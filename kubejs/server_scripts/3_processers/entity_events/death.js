EntityEvents.death("minecraft:player", e => {
	const {entity, source} = e;
	medallion(e);
	heart_of_demon(e);
	recovery_pearl_death(entity);
	mob_sense(entity);
})