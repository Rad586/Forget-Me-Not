const blocks1 = ["minecraft:stone", "minecraft:granite", "minecraft:polished_granite", "minecraft:diorite", "minecraft:polished_diorite", "minecraft:andesite", "minecraft:polished_andesite", "minecraft:deepslate", "minecraft:polished_deepslate", "minecraft:calcite", "minecraft:oak_planks", "minecraft:spruce_planks", "minecraft:birch_planks", "minecraft:dark_oak_planks", "minecraft:acaia_planks", "minecraft:jungle_planks", "minecraft:mangrove_planks", "minecraft:crimson_planks", "minecraft:warped_planks", "minecraft:bedrock", "minecraft:iron_block", "minecraft:gold_block", "minecraft:redstone_block", "minecraft:diamond_block", "minecraft:lapis_block", "minecraft:netherite_block", "minecraft:ancient_debris", "minecraft:glass", "minecraft:tinted_glass", "minecraft:sandstone", "minecraft:chiseled_sandstone", "minecraft:oak_slab", "minecraft:dark_oak_slab", "minecraft:acacia_slab", "minecraft:jungle_slab", "minecraft:mangrove_slab", "minecraft:warped_slab", "minecraft:crimson_slab", "minecraft:petrified_oak_slab", "minecraft:spruce_slab", "minecraft:birch_slab", "minecraft:stone_slab", "minecraft:smooth_stone_slab", "minecraft:sandstone_slab", "minecraft:cut_sandstone_slab", "minecraft:brick_slab", "minecraft:stone_brick_slab", "minecraft:mud_brick_slab", "minecraft:nether_brick_slab", "minecraft:quartz_slab", "minecraft:red_sandstone_slab", "minecraft:cut_red_sandstone_slab", "minecraft:purpur_slab", "minecraft:prismarine_brick_slab", "minecraft:dark_prismarine_slab", "minecraft:smooth_quartz", "minecraft:smooth_red_sandstone", "minecraft:smooth_sandstone", "minecraft:smooth_stone", "minecraft:bricks", "minecraft:bookshelf", "minecraft:purpur_block", "minecraft:purpur_pillar", "minecraft:purpur_stairs", "minecraft:netherrack", "minecraft:basalt", "minecraft:polished_basalt", "minecraft:smooth_basalt", "minecraft:stone_bricks", "minecraft:mossy_stone_bricks", "minecraft:cracked_stone_bricks", "minecraft:chiseled_stone_bricks", "minecraft:packed_mud", "minecraft:mud_bricks", "minecraft:deepslate_bricks", "minecraft:cracked_deepslate_bricks", "minecraft:deepslate_tiles", "minecraft:cracked_deepslate_tiles", "minecraft:chiseled_deepslate", "minecraft:reinforced_deepslate", "minecraft:brick_stairs", "minecraft:stone_brick_stairs", "minecraft:mud_brick_stairs", "minecraft:nether_bricks", "minecraft:cracked_nether_bricks", "minecraft:chiseled_nether_bricks", "minecraft:nether_brick_stairs", "minecraft:end_stone_bricks", "minecraft:sandstone_stairs", "minecraft:emerald_block", "minecraft:oak_stairs", "minecraft:spruce_stairs", "minecraft:acacia_stairs", "minecraft:jungle_stairs", "minecraft:birch_stairs", "minecraft:mangrove_stairs", "minecraft:warped_stairs", "minecraft:crimson_stairs", "minecraft:dark_oak_stairs", "minecraft:chiseled_quartz_block", "minecraft:quartz_block", "minecraft:quartz_bricks", "minecraft:quartz_stairs", "minecraft:white_terracotta", "minecraft:orange_terracotta", "minecraft:magenta_terracotta", "minecraft:light_blue_terracotta", "minecraft:yellow_terracotta", "minecraft:lime_terracotta", "minecraft:pink_terracotta", "minecraft:gray_terracotta", "minecraft:light_gray_terracotta", "minecraft:cyan_terracotta", "minecraft:purple_terracotta", "minecraft:blue_terracotta", "minecraft:brown_terracotta", "minecraft:green_terracotta", "minecraft:red_terracotta", "minecraft:black_terracotta", "minecraft:terracotta", "minecraft:white_stained_glass", "minecraft:orange_stained_glass", "minecraft:magenta_stained_glass", "minecraft:light_blue_stained_glass", "minecraft:yellow_stained_glass", "minecraft:lime_stained_glass", "minecraft:pink_stained_glass", "minecraft:gray_stained_glass", "minecraft:light_gray_stained_glass", "minecraft:cyan_stained_glass", "minecraft:purple_stained_glass", "minecraft:blue_stained_glass", "minecraft:brown_stained_glass", "minecraft:green_stained_glass", "minecraft:red_stained_glass", "minecraft:black_stained_glass", "minecraft:prismarine_bricks", "minecraft:dark_prismarine", "minecraft:prismarine_brick_stairs", "minecraft:dark_prismarine_stairs", "minecraft:sea_lantern", "minecraft:brown_stained_glass", "minecraft:sea_lantern", "minecraft:red_sandstone", "minecraft:chiseled_red_sandstone", "minecraft:cut_red_sandstone", "minecraft:red_sandstone_stairs", "minecraft:red_nether_bricks", "minecraft:bone_block", "minecraft:polished_granite_stairs", "minecraft:smooth_red_sandstone_stairs", "minecraft:mossy_stone_brick_stairs", "minecraft:polished_diorite_stairs", "minecraft:end_stone_brick_stairs", "minecraft:stone_stairs", "minecraft:smooth_sandstone_stairs", "minecraft:smooth_quartz_stairs", "minecraft:granite_stairs", "minecraft:andesite_stairs", "minecraft:red_nether_brick_stairs", "minecraft:polished_andesite_stairs", "minecraft:diorite_stairs", "minecraft:polished_deepslate_stairs", "minecraft:deepslate_brick_stairs", "minecraft:deepslate_tile_stairs", "minecraft:polished_granite_slab", "minecraft:smooth_red_sandstone_slab", "minecraft:mossy_stone_brick_slab", "minecraft:polished_diorite_slab", "minecraft:end_stone_brick_slab", "minecraft:smooth_sandstone_slab", "minecraft:smooth_quartz_slab", "minecraft:granite_slab", "minecraft:andesite_slab", "minecraft:red_nether_brick_slab", "minecraft:polished_andesite_slab", "minecraft:diorite_slab", "minecraft:polished_deepslate_slab", "minecraft:deepslate_brick_slab", "minecraft:deepslate_tile_slab", "minecraft:polished_blackstone", "minecraft:polished_blackstone_slab", "minecraft:chiseled_polished_blackstone", "minecraft:polished_blackstone_bricks", "minecraft:polished_blackstone_brick_slab", "minecraft:polished_blackstone_brick_stairs", "minecraft:cracked_polished_blackstone_bricks", "minecraft:chest", "minecraft:crafting_table", "minecraft:furnace", "minecraft:jukebox", "minecraft:brick_wall", "minecraft:red_sandstone_wall", "minecraft:mossy_stone_brick_wall", "minecraft:granite_wall", "minecraft:stone_brick_wall", "minecraft:mud_brick_wall", "minecraft:nether_brick_wall", "minecraft:andesite_wall", "minecraft:red_nether_brick_wall", "minecraft:sandstone_wall", "minecraft:end_stone_brick_wall", "minecraft:diorite_wall", "minecraft:polished_blackstone_wall", "minecraft:polished_blackstone_brick_wall", "minecraft:polished_deepslate_wall", "minecraft:deepslate_brick_wall", "minecraft:deepslate_tile_wall", "minecraft:anvil", "minecraft:chipped_anvil", "minecraft:damaged_anvil", "minecraft:white_carpet", "minecraft:orange_carpet", "minecraft:magenta_carpet", "minecraft:light_blue_carpet", "minecraft:yellow_carpet", "minecraft:lime_carpet", "minecraft:pink_carpet", "minecraft:gray_carpet", "minecraft:light_gray_carpet", "minecraft:cyan_carpet", "minecraft:purple_carpet", "minecraft:blue_carpet", "minecraft:brown_carpet", "minecraft:green_carpet", "minecraft:red_carpet", "minecraft:black_carpet", "minecraft:shulker_box", "minecraft:white_shulker_box", "minecraft:orange_shulker_box", "minecraft:magenta_shulker_box", "minecraft:light_blue_shulker_box", "minecraft:yellow_shulker_box", "minecraft:lime_shulker_box", "minecraft:pink_shulker_box", "minecraft:gray_shulker_box", "minecraft:light_gray_shulker_box", "minecraft:cyan_shulker_box", "minecraft:purple_shulker_box", "minecraft:blue_shulker_box", "minecraft:brown_shulker_box", "minecraft:green_shulker_box", "minecraft:red_shulker_box", "minecraft:black_shulker_box", "minecraft:white_glazed_terracotta", "minecraft:orange_glazed_terracotta", "minecraft:magenta_glazed_terracotta", "minecraft:light_blue_glazed_terracotta", "minecraft:yellow_glazed_terracotta", "minecraft:lime_glazed_terracotta", "minecraft:pink_glazed_terracotta", "minecraft:gray_glazed_terracotta", "minecraft:light_gray_glazed_terracotta", "minecraft:cyan_glazed_terracotta", "minecraft:purple_glazed_terracotta", "minecraft:blue_glazed_terracotta", "minecraft:brown_glazed_terracotta", "minecraft:green_glazed_terracotta", "minecraft:red_glazed_terracotta", "minecraft:black_glazed_terracotta"];
const blocks2 = ["minecraft:end_stone", "minecraft:cobblestone", "minecraft:cobbled_deepslate", "minecraft:dripstone_block", "minecraft:coal_ore", "minecraft:deepslate_coal_ore", "minecraft:iron_ore", "minecraft:deepslate_iron_ore", "minecraft:gold_ore", "minecraft:deepslate_gold_ore", "minecraft:emerald_ore", "minecraft:deepslate_emerald_ore", "minecraft:lapis_ore", "minecraft:deepslate_lapis_ore", "minecraft:diamond_ore", "minecraft:deepslate_diamond_ore", "minecraft:nether_gold_ore", "minecraft:nether_quartz_ore", "minecraft:coal_block", "minecraft:raw_iron_block", "minecraft:raw_gold_block", "minecraft:amethyst_block", "minecraft:budding_amethyst", "minecraft:stripped_oak_log", "minecraft:stripped_birch_log", "minecraft:stripped_mangrove_log", "minecraft:stripped_dark_oak_log", "minecraft:stripped_acacia_log", "minecraft:stripped_jungle_log", "minecraft:stripped_spruce_log", "minecraft:stripped_crimson_stem", "minecraft:stripped_warped_stem", "minecraft:cobblestone_slab", "minecraft:prismarine", "minecraft:mossy_cobblestone", "minecraft:obsidian", "minecraft:glowstone", "minecraft:basalt", "minecraft:prismarine", "minecraft:prismarine_stairs", "minecraft:magma_block", "minecraft:mossy_cobblestone_slab", "minecraft:cobbled_deepslate_slab", "minecraft:blackstone", "minecraft:blackstone_slab", "minecraft:blackstone_stairs", "minecraft:gilded_blackstone", "minecraft:crying_obsidian", "minecraft:cobblestone_wall", "minecraft:prismarine_wall", "minecraft:mossy_cobblestone_wall", "minecraft:blackstone_wall"];
const blocks3 = ["minecraft:grass", "minecraft:oak_sapling", "minecraft:spruce_sapling", "minecraft:acacia_sapling", "minecraft:jungle_sapling", "minecraft:dark_oak_sapling", "minecraft:birch_sapling", "minecraft:spruce_sapling", "minecraft:fern", "minecraft:dead_bush", "minecraft:dandelion", "minecraft:poppy", "minecraft:allium", "minecraft:azure_bluet", "minecraft:red_tulip", "minecraft:orange_tulip", "minecraft:white_tulip", "minecraft:pink_tulip", "minecraft:oxeye_daisy", "minecraft:cornflower", "minecraft:lily_of_the_valley", "minecraft:blue_orchid", "minecraft:wither_rose", "minecraft:brown_mushroom", "minecraft:red_mushroom", "minecraft:crimson_fungus", "minecraft:waroed_fungus", "minecraft:crimson_roots", "minecraft:warped_roots", "minecraft:nether_sprouts", "minecraft:carrots", "minecraft:potatoes", "minecraft:beetroots", "minecraft:wheat", "minecraft:torch", "minecraft:soul_torch", "farmersdelight:sandy_shrub", "farmersdelight:wild_cabbages", "farmersdelight:wild_onions", "farmersdelight:wild_tomatoes", "farmersdelight:wild_carrots", "farmersdelight:wild_potatoes", "farmersdelight:wild_beetroots", "farmersdelight:brown_mushroom_colony", "farmersdelight:red_mushroom_colony", "farmersdelight:onions", "farmersdelight:tomatoes", "farmersdelight:cabbages"];
const blocks4 = ["minecraft:lilac", "minecraft:rose_bush", "minecraft:peony", "minecraft:tall_grass", "minecraft:large_fern", "minecraft:sugar_cane"];
const blocks6 = ["minecraft:slime_block", "minecraft:white_bed", "minecraft:orange_bed", "minecraft:yellow_bed", "minecraft:white_bed", "minecraft:black_bed", "minecraft:blue_bed", "minecraft:magenta_bed", "minecraft:gray_bed", "minecraft:light_gray_bed", "minecraft:brown_bed", "minecraft:pink_bed", "minecraft:cyan_bed", "minecraft:light_blue_bed", "minecraft:red_bed", "minecraft:green_bed", "minecraft:purple_bed",];
const blocks7 = ["minecraft:sand", "minecraft:red_sand", "minecraft:gravel", "minecraft:rooted_dirt", "minecraft:podzol", "minecraft:white_wool", "minecraft:orange_wool", "minecraft:yellow_wool", "minecraft:white_wool", "minecraft:black_wool", "minecraft:blue_wool", "minecraft:magenta_wool", "minecraft:gray_wool", "minecraft:light_gray_wool", "minecraft:brown_wool", "minecraft:pink_wool", "minecraft:cyan_wool", "minecraft:light_blue_wool", "minecraft:red_wool", "minecraft:green_wool", "minecraft:purple_wool", "minecraft:white_concrete", "minecraft:orange_concrete", "minecraft:yellow_concrete", "minecraft:white_concrete", "minecraft:black_concrete", "minecraft:blue_concrete", "minecraft:magenta_concrete", "minecraft:gray_concrete", "minecraft:light_gray_concrete", "minecraft:brown_concrete", "minecraft:pink_concrete", "minecraft:cyan_concrete", "minecraft:light_blue_concrete", "minecraft:red_concrete", "minecraft:green_concrete", "minecraft:purple_concrete", "minecraft:white_concrete_powder", "minecraft:orange_concrete_powder", "minecraft:yellow_concrete_powder", "minecraft:white_concrete_powder", "minecraft:black_concrete_powder", "minecraft:blue_concrete_powder", "minecraft:magenta_concrete_powder", "minecraft:gray_concrete_powder", "minecraft:light_gray_concrete_powder", "minecraft:brown_concrete_powder", "minecraft:pink_concrete_powder", "minecraft:cyan_concrete_powder", "minecraft:light_blue_concrete_powder", "minecraft:red_concrete_powder", "minecraft:green_concrete_powder", "minecraft:purple_concrete_powder", "minecraft:hay_block", "minecraft:dried_kelp_block"];
const probablychests = ["probablychests:lush_chest", "probablychests:normal_chest", "probablychests:rocky_chest", "probablychests:stone_chest", "probablychests:gold_chest", "probablychests:shadow_chest", "probablychests:nether_chest", "probablychests:ice_chest", "minecraft:glowing_lichen", "minecraft:nether_portal"];
const norandomtick = ["minecraft:budding_amethyst", "minecraft:vine", "minecraft:mud", "minecraft:brown_mushroom", "minecraft:red_mushroom", "minecraft:kelp"];

BlockEvents.modification(e => {
	blocks1.forEach(blockName => e.modify(blockName, block => block.speedFactor = 1.018));
	blocks2.forEach(blockName => e.modify(blockName, block => block.speedFactor = 1.012));
	blocks3.forEach(blockName => e.modify(blockName, block => block.speedFactor = 0.972));
	blocks4.forEach(blockName => e.modify(blockName, block => {
		block.speedFactor = 0.976
		block.jumpFactor = 0.976
	}));
	blocks6.forEach(blockName => e.modify(blockName, block => {
		block.jumpFactor = 1.485
		block.speedFactor = 0.92
	}));
	blocks7.forEach(blockName => e.modify(blockName, block => {
		block.speedFactor = 0.975
		block.jumpFactor = 0.976
	}));
	probablychests.forEach(blockName => e.modify(blockName, block => block.lightEmission = 8));
	norandomtick.forEach(blockName => e.modify(blockName, block => block.setIsRandomlyTicking(false)));

	e.modify("minecraft:cobweb", block => block.destroySpeed = 1.2);

	e.modify("minecraft:snow", block => {
		block.setHasCollision(false);
		block.speedFactor = 0.972
	});

	e.modify("minecraft:dirt_path", block => block.speedFactor = 1.08);
	e.modify("minecraft:soul_sand", block => {
		block.jumpFactor = 0.945
		block.speedFactor = 0.6
	});
	e.modify("minecraft:sponge", block => {
		block.jumpFactor = 0.935
		block.speedFactor = 0.92
	});
	e.modify("minecraft:wet_sponge", block => {
		block.jumpFactor = 0.86
		block.speedFactor = 0.76
	});
	e.modify("minecraft:farmland", block => {
		block.jumpFactor = 0.935
		block.speedFactor = 0.8
	});
	e.modify("farmersdelight:rich_soil_farmland", block => {
		block.jumpFactor = 0.935
		block.speedFactor = 0.8
	})

	global.Leaves.forEach(leaves => {
		e.modify(leaves.id, block => {
			block.speedFactor = 0.96;
			block.jumpFactor = 0.972;
			block.setHasCollision(false);
			block.setIsRandomlyTicking(false)
		})
	})
})


// {
// 	"minecraft:copper_ore": "minecraft:coal_ore",
// 	"minecraft:deepslate_copper_ore": "minecraft:deepslate_coal_ore",
// 	"minecraft:raw_copper_block": "minecraft:coal_block"
// };
global.copper_variants1 = [
	"", "waxed_"
];
global.copper_variants2 = [
	"", "weathered_", "exposed_", "oxidized_"
];
global.copper_variants3 = [
	"", "cut_"
];
global.copper_variants4 = [
	"", "_stairs", "_slab"
];
global.copper_expose_map = {
	"": ["acacia"],
	"weathered_": ["prismarine", 1.5, 6, "stone"],
	"exposed_": ["jungle"],
	"oxidized_": ["warped"]
}

BlockEvents.modification(e => {
	e.modify("raw_copper_block", block => {
		block.setMaterial("stone");
		block.setSoundType("stone");
	});
	e.modify("copper_ore", block => {
		block.setMaterial("stone");
		block.setSoundType("stone");
	});
	e.modify("deepslate_copper_ore", block => {
		block.setMaterial("deepslate");
		block.setSoundType("deepslate");
	});
	e.modify("copper_block", block => {
		block.setRequiresTool(false);
		block.settings.setHardness(2);
		block.settings.setResistance(3);
		block.setMaterial("wood");
		block.setSoundType("wood");
		block.setIsRandomlyTicking(false)
	});
	e.modify("waxed_copper_block", block => {
		block.setRequiresTool(false);
		block.settings.setHardness(2);
		block.settings.setResistance(3);
		block.setMaterial("wood");
		block.setSoundType("wood")
	});
	global.copper_variants1.forEach(wax => {
		global.copper_variants2.forEach(expose => {
			global.copper_variants3.forEach(type => {
				global.copper_variants4.forEach(key => {
					const id = `${wax}${expose}${type}copper${key}`;
					if (["copper", "waxed_copper"].includes(id) || (type == "" && key != "")) return;
					const data = global.copper_expose_map[expose];
					e.modify(id, block => {
						block.setRequiresTool(expose.includes("weathered_") ? true : false);
						block.settings.setHardness(data[1] || 2);
						block.settings.setResistance(data[2] || 3);
						block.setMaterial(data[3] || "wood");
						block.setSoundType(data[3] || "wood");
						block.setIsRandomlyTicking(false)
					})
				})
			})
		})
	})
})