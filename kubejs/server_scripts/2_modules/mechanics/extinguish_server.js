const extinguish_map = {
	"minecraft:water_bucket": {
		count: 24,
		sound: ["item.bucket.empty", 0.45]
	},
	"minecraft:potion": {
		count: 12,
		sound: ["item.bottle.empty", 0.6],
		action: (item, player) => {
			item.shrink(1);
			player.give("minecraft:glass_bottle");
		}
	}
}

NetworkEvents.dataReceived("extinguish", e => {
	const { level, player, data } = e, { uuid, id } = data;
	const info = extinguish_map[id];
	const entity = level.getEntity(uuid), item = player.mainHandItem;
	const { x, eyeY, z } = entity;

	entity.extinguish();
	if (info.action) info.action(item, player);

	level.spawnParticles("splash", true, x, eyeY, z, 0.1, 0.1, 0.1, info.count, 2);
	level.playSound(null, x, eyeY, z, info.sound[0], "master", info.sound[1], 1.6)
	level.playSound(null, x, eyeY, z, "block.fire.extinguish", "master", 0.4, 2);
	player.swing()
})