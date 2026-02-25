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
Object.keys(extinguish_map).forEach(id => {
	const info = extinguish_map[id];
	const bucket = id == "minecraft:water_bucket";

	ItemEvents.rightClicked(id, e => {
		const { player } = e;
		const entity = global.advancedRayTraceEntity(player, 4);
		if (!entity || !entity.isOnFire() || !entity.isAlive()) return;

		const { level } = e, { x, eyeY, z } = entity;
		entity.extinguish();
		if(info.action) info.action(e.item, player);

		level.spawnParticles("splash", true, x, eyeY, z, 0.1, 0.1, 0.1, info.count, 2);
		if(bucket && player.rayTrace(4).block) {
			level.playSound(null, x, eyeY, z, info.sound[0], "master", info.sound[1], 1.6)
		};
		level.playSound(null, x, eyeY, z, "block.fire.extinguish", "master", 0.4, 2);

		player.swing();
		e.cancel()
	})
})