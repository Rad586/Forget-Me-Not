function debuff_arrow(entity) {
    if (Math.random() > 0.03) return;
    const { level } = entity
    if(
        level.isClientSide() || 
        level.getDayTime() / 24000 < 32 ||
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