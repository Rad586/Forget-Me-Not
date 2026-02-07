function block_variant_unify(e) {
	const block_variant_map = {
		"minecraft:cobbled_deepslate": [
			"minecraft:polished_deepslate", "minecraft:chiseled_deepslate",
			"minecraft:cracked_deepslate_bricks", "minecraft:deepslate_tiles",
			"minecraft:cracked_deepslate_tiles", "minecraft:deepslate_bricks"
		],
		"minecraft:cobbled_deepslate_stairs": [
			"minecraft:polished_deepslate_stairs", "minecraft:deepslate_brick_stairs",
			"minecraft:deepslate_tile_stairs"
		],
		"minecraft:cobbled_deepslate_slab": [
			"minecraft:polished_deepslate_slab", "minecraft:deepslate_brick_slab",
			"minecraft:deepslate_tile_slab"
		],
		"minecraft:cobbled_deepslate_wall": [
			"minecraft:polished_deepslate_wall", "minecraft:deepslate_brick_wall",
			"minecraft:deepslate_tile_wall"
		],
		"minecraft:sandstone": [
			"minecraft:cut_sandstone", "minecraft:chiseled_sandstone",
			"minecraft:smooth_sandstone"
		],
		"minecraft:red_sandstone": [
			"minecraft:cut_red_sandstone", "minecraft:chiseled_red_sandstone",
			"minecraft:smooth_red_sandstone"
		],
		"minecraft:stone_bricks": [
			"minecraft:mossy_stone_bricks", "minecraft:cracked_stone_bricks",
			"minecraft:chiseled_stone_bricks"
		],
		"minecraft:quartz_block": [
			"minecraft:smooth_quartz", "minecraft:chiseled_quartz_block",
			"minecraft:quartz_bricks", "minecraft:quartz_pillar"
		],
		"minecraft:blackstone": [
			"minecraft:polished_blackstone", "minecraft:chiseled_polished_blackstone",
			"minecraft:polished_blackstone_bricks", "minecraft:cracked_polished_blackstone_bricks"
		],
		"minecraft:nether_bricks": [
			"minecraft:cracked_nether_bricks", "minecraft:chiseled_nether_bricks"
		],
		"minecraft:purpur_block": [
			"minecraft:purpur_pillar"
		],
		"minecraft:prismarine": [
			"minecraft:prismarine_bricks"
		],

		"minecraft:poppy": global.small_flowers,
		"minecraft:oak_leaves": global.leaves,
		"minecraft:cobblestone": global.stones,
		"minecraft:dirt": global.dirts,
		"minecraft:oak_log": global.logs
	};
    Object.keys(block_variant_map).forEach(key => {
		const data = block_variant_map[key];
		data.forEach(variant => {
			e.addLootTypeModifier(LootType.BLOCK)
				.randomChanceWithEnchantment("minecraft:silk_touch", [1, 0]) 
				.replaceLoot(variant, key)
			e.addLootTypeModifier(LootType.values().filter(l => l != LootType.BLOCK))
				.replaceLoot(variant, key)
		})
	})
	e.addLootTypeModifier(LootType.BLOCK)
		.randomChanceWithEnchantment("minecraft:silk_touch", [1, 0]) 
		.replaceLoot("minecraft:deepslate", "minecraft:cobbled_deepslate")
	e.addLootTypeModifier(LootType.values().filter(l => l != LootType.BLOCK))
		.replaceLoot("minecraft:deepslate", "minecraft:cobbled_deepslate")
}