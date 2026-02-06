const mimics = [
	"probablychests:coral_chest_mimic_pet", "probablychests:ice_chest_mimic_pet",
    "probablychests:lush_chest_mimic_pet", "probablychests:nether_chest_mimic_pet", 
    "probablychests:normal_chest_mimic_pet", "probablychests:rocky_chest_mimic_pet",
    "probablychests:shadow_chest_mimic_pet", "probablychests:stone_chest_mimic_pet",
	"probablychests:gold_chest_mimic_pet"
];
const mimic_heal_map = {
	"iron_block": "5",
	"gold_block": "10"
};

Object.keys(mimic_heal_map).forEach(key => {
	const data = mimic_heal_map[key];

	ItemEvents.entityInteracted(key, e => {
		const {target} = e;
		if(!e.player.isCrouching() || !mimics.includes(target.type)) return;
		const {x, y, z} = target;
	
		target.heal(data);
		e.item.count--;
	
		global.sound(target, "probablychests:mimic_bite", 0.3, 1.4);
		target.level.spawnParticles("heart", true, x, y+1.5, z, 0.2, 0.2, 0.2, 2, 0);
	})
})