const extinguish_map = {
	"minecraft:water_bucket": {
		count: 24,
		sound: ["item.bucket.empty", 0.45]
	},
	"minecraft:potion": {
		count: 12,
		sound: ["item.bottle.empty", "master", 0.6],
		action: (item, player) => {
			item.shrink(1);
			player.give("minecraft:glass_bottle");
		}
	}
}

Array.of("minecraft:water_bucket", "minecraft:potion").forEach(id => {
	ItemEvents.rightClicked(id, e => {
		const { player } = e;
		const entity = global.advancedRayTraceEntity(player, 4);
		if (!entity || !entity.isOnFire() || !entity.isAlive()) return;

		player.sendData("extinguish", {
			uuid: String(entity.uuid), 
			id: id
		})
		e.cancel()
	})
})