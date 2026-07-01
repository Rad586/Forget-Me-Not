EntityEvents.death("minecraft:player", e => {
	const {entity} = e;

	hotbar_totem(e, level, entity);
	medallion(e, level, entity);
	heart_of_demon(e, level, entity);

	recovery_pearl_death(entity);
	mob_sense(entity)
})