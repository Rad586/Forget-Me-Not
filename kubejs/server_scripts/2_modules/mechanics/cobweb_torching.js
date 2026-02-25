/* Idea from g66ol3eb5u (https://discord.com/channels/303440391124942858/1048591172165189632/threads/1287822838212071544) */
const cobweb_breaker = {
	"minecraft:torch": "flame",
	"minecraft:flint_and_steel": "flame",
	"minecraft:lava_bucket": "lava",
	"minecraft:soul_torch": "soul_fire_flame"
};

["sihywtcamd:messy_cobweb", "minecraft:cobweb"].forEach(key => {
	BlockEvents.leftClicked(key, e => {
		const { item } = e;
		let data = cobweb_breaker[item.id];

		if (item.isEnchanted()) {
			const { enchantments } = item;
			if (enchantments.containsKey("minecraft:fire_aspect")) data = "flame";
			else if (enchantments.containsKey("minecraft:soul_fire_aspect")) data = "soul_fire_flame";
		};
		if (!data) return;

		const { block } = e, { x, y, z, level } = block;
		block.set("air");

		level.spawnParticles(
			data, true, 
			x + 0.5, y + 0.5, z + 0.5, 
			0.2, 0.2, 0.2, 
			3, 0.04
		);
		level.spawnParticles(
			"smoke", true, 
			x + 0.5, y + 0.5, z + 0.5, 
			0.4, 0.4, 0.4, 
			3, 0
		);
		level.playSound(
			null, 
			x + 0.5, y + 0.5, z + 0.5, 
			"block.fire.ambient", "blocks", 
			2, 2
		);
		level.playSound(
			null, 
			x + 0.5, y + 0.5, z + 0.5, 
			"block.fire.extinguish", 
			"blocks", 
			0.4, 2
		)
	})
})