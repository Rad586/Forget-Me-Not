const fireResistant = ["dragonloot:dragon_anvil", "minecraft:goat_horn"];
const uncommon =["bosses_of_mass_destruction:soul_star","bosses_of_mass_destruction:void_lily","fancydyes:aurora_dye","fancydyes:flame_dye","fancydyes:aurora_dye","rottencreatures:treasure_chest","probablychests:gold_chest","probablychests:mimic_core","probablychests:pet_mimic_key","probablychests:mimic_key"];

const effectMap = {
	common: {
		"minecraft:glow_berries": ["glowing", 10],

		"farmersdelight:cooked_rice": ["absorption", 15],

		"farmersdelight:egg_sandwitch": ["saturation", 3],
		"farmersdelight:chicken_sandwitch": ["saturation", 4],
		"farmersdelight:bacon_sandwich": ["saturation", 5]
	},
	uncommon: {
		"farmersdelight:barbeque_stick": ["kubejs:fire_aspect", 40],

		"farmersdelight:nether_salad": ["fire_resistance", 60],

		"farmersdelight:hamburger": ["regeneration", 5],
		"farmersdelight:mutton_wrap": ["strength", 20],

		"farmersdelight:cabbage_rolls": ["kubejs:purity", 30],
		"farmersdelight:stuffed_potato": ["kubejs:smite", 60],
		"farmersdelight:steak_and_potatoes": ["kubejs:thorns", 40],

		"farmersdelight:fish_stew": ["water_breathing", 20],
		"farmersdelight:beef_stew": ["kubejs:fire_aspect", 60],
		"farmersdelight:bone_broth": ["resistance", 30],

		"farmersdelight:noodle_soup": ["kubejs:aquatic_healing", 90],
		"farmersdelight:vegetable_soup": ["regeneration", 8],
		// "farmersdelight:pumpkin_soup": ["kubejs:breach", 60],
		"farmersdelight:chicken_soup": ["regeneration", 8],

		"farmersdelight:fried_rice": ["kubejs:sweeping_edge", 60],
		"farmersdelight:bacon_and_eggs": ["kubejs:blast_immunity", 15],
		
		"farmersdelight:salmon_roll": ["regeneration", 3],
		"farmersdelight:cod_roll": ["regeneration", 3],
		"farmersdelight:kelp_roll_slice": ["speed", 60]
	},
	rare: {
		"farmersdelight:mushroom_rice": ["kubejs:soul_fire_aspect", 180],
	
		"farmersdelight:dumplings": ["kubejs:blessed", 60],

		"farmersdelight:vegetable_noodles": ["kubejs:poison_aspect", 180],

		"farmersdelight:roasted_mutton_chops": ["kubejs:freeze_aspect", 180],
		"farmersdelight:baked_cod_stew": ["kubejs:soul_flame", 120],
		"farmersdelight:grilled_salmon": ["kubejs:flame", 180]

	},
	epic: {
		"farmersdelight:ratatouille": ["kubejs:purity", 120],

		"farmersdelight:squid_ink_pasta": ["kubejs:aquatic_healing", 300, 1],
		"farmersdelight:pasta_with_mutton_chop": ["kubejs:thorns", 300, 1],
		"farmersdelight:pasta_with_meatballs": ["saturation", 480, 1],

		"farmersdelight:roast_chicken": ["strength", 300],
		"farmersdelight:stuffed_pumpkin": ["resistance", 240],
		"farmersdelight:shepherds_pie": ["kubejs:arcane_armor", 90],
		"farmersdelight:honey_glazed_ham": ["regeneration", 90]
	}
}


ItemEvents.modification(e => {
	/* fire resistant */
	fireResistant.forEach(itemName => e.modify(itemName, item => item.fireResistant = true));

	/* uncommon */
	uncommon.forEach(itemName => e.modify(itemName, item => item.rarity="uncommon"));

	/* food effects */
	Object.keys(effectMap).forEach(rarity => {
		const ids = effectMap[rarity];
		Object.keys(ids).forEach(id => {
			const effectInfo = ids[id];
			if(rarity != "common") {
				e.modify(id, item => item.rarity = rarity)
			};
			e.modify(id, item => item.foodProperties = food => food.effect(effectInfo[0], effectInfo[1]*20, effectInfo[2] || 0, 1));
		})
	})

	/* drinkable dragon breath */
	e.modify("minecraft:dragon_breath", item => 
		item.foodProperties = food => {
			food.effect("kubejs:dragon_powered", 100, 0, 1);
			food.alwaysEdible()
		}
	)

	/* fast to eat */
	e.modify("minecraft:melon_slice", item => item.foodProperties = food => food.fastToEat())
	e.modify("minecraft:cookie", item => item.foodProperties = food => food.fastToEat())

	e.modify("minecraft:glistering_melon_slice", item =>
		item.foodProperties = food => {
			food.effect("minecraft:regeneration", 22, 0, 1);
			food.alwaysEdible();
			food.fastToEat()
		}
	)

	const diamond_armors = [
		"minecraft:diamond_helmet", "minecraft:diamond_chestplate", 
		"minecraft:diamond_leggings", "minecraft:diamond_boots"
	]
	e.modify(diamond_armors, item => item.armorToughness = 0)

	/* torch hit but more */
	global.Emitters
		.map(i => i.asItem().id)
		.forEach(id => {
			e.modify(id, item => {
				const soul = id.includes(":soul_");
				const builder =
					new ItemBuilder(id)
						.hurtEnemy(c => {
							const { target } = c;
							if (target.isOnFire()) return;
							target.setSecondsOnFire(1);
							if (soul == true) {
								target.setFireType("minecraft:soul")
							}
						})
				item.setItemBuilder(builder);
			})
		})

	/*no mis-eating */
	global.EdibleCrops
		.map(i => i.asItem().id)
		.forEach(id => {
			e.modify(id, item => {
				const builder =
					new ItemBuilder(id)
						.use((level, player, hand) => {
							if (player.isCrouching()) return true;
							const result = global.advancedRayTraceBlock(player, 4);
							const block = level.getBlock(result.blockPos);
							return !(
								block &&
								block.id == "minecraft:farmland" &&
								result.direction == "up"
							)
						})
				item.setItemBuilder(builder);
			})
		})
})