/* Idea from g66ol3eb5u (https://discord.com/channels/303440391124942858/1048591172165189632/threads/1287822838212071544) */
const cobweb_breaker = {
	"minecraft:torch": "flame",
	"minecraft:flint_and_steel": "flame",
	"minecraft:lava_bucket": "lava",
	"minecraft:soul_torch": "soul_fire_flame"
};

["sihywtcamd:messy_cobweb", "minecraft:cobweb"].forEach(key => {
	BlockEvents.leftClicked(key, e => {
		const {item} = e;
		let data = cobweb_breaker[item.id];

		if(item.isEnchanted()) {
			const {enchantments} = item;
			if(enchantments.containsKey("minecraft:fire_aspect")) data = "flame";
			else if(enchantments.containsKey("minecraft:soul_fire_aspect")) data = "soul_fire_flame";
		};
		if(!data) return;
	
		const {block, entity} = e, {x, y, z, level} = block;
		block.set("air");
		global.particleBurstBlock(level, x, y, z, data, 3, 0.04, 0.2);
		global.particleBurstBlock(level, x, y, z, "smoke", 3, 0, 0.4);
		global.sound(entity, "block.fire.ambient", 2, 2, 0.1);
		global.sound(entity, "block.fire.extinguish", 0.4, 2, 0.1);
	})
})