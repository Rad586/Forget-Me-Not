global.torch_alert = (player) => {
	if(player.y > 0 || global.throttle(player, 400, "alert")) return;

	const {level, x, y, z} = player;
	for(let i = 0; i < 4; i++) {
        let dx = (i % 2 ? 1 : -1);
        let dz = (i < 2 ? 1 : -1);
        let aabb = AABB.of(x+16*dx, y-2, z+16*dz, x, y+2, z);

        server.scheduleInTicks(i, () => {
            const entities = level.getEntitiesWithin(aabb).filter(e => e.isMonster());
            entities.forEach(entity => {
				const {tags} = entity;
				if(tags.contains("alert") && entity.target == null) {
					entity.navigation.moveTo(player, 1);
					entity.potionEffects.add("speed", 20, 0, true, false);
					tags.remove("alert");
				}
				else entity.addTag("alert")
			})
        })
    }
}