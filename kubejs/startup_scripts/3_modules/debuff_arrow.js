function debuff_arrow(entity, nether_stage) {
	if(
        !nether_stage || 
        Math.random() > 0.03 || 
        entity.level.isClientSide() || 
        entity.tags.contains("kjsed")
    ) return;

	entity.setOffHandItem(
		Item.of("minecraft:tipped_arrow", {
			Potion: global.randomSelect([
                "minecraft:weakness",
                "minecraft:slow_falling",
                "kubejs:burning", "kubejs:soul_burning",
                "kubejs:pull", "kubejs:vulnerability",
                "kubejs:stench_curse", "kubejs:beheading_curse",
                "kubejs:outcast_curse", "kubejs:annoying_curse"
            ])
		})
	);

	entity.addTag("kjsed")
}