const log_types = [
	"oak", "dark_oak", "spruce", "birch",
	"jungle", "mangrove", "acacia"
];
const colors = [
	"red", "orange", "yellow", "green",
	"lime", "cyan", "light_blue", "blue",
	"purple", "pink", "magenta", "brown",
	"white", "light_gray", "gray", "black"
]

ServerEvents.tags("item", e => {
	log_types.forEach(type => {
		e.add("kubejs:carpets", `kubejs:${type}_leaf_pile`);
		e.add(`kubejs:${type}_leaf_piles`, `kubejs:${type}_leaf_pile`);
		e.add(`kubejs:${type}_leaves`, `minecraft:${type}_leaves`);

		colors.forEach(color => {
			const key = `${color}_${type}`;
			e.add("kubejs:carpets", `kubejs:${key}_leaf_pile`);
			e.add(`kubejs:${type}_leaf_piles`, `kubejs:${key}_leaf_pile`);
			e.add(`kubejs:${type}_leaves`, `kubejs:${key}_leaves`);
		})
	})

	e.add("kubejs:torches", "minecraft:torch");
	e.add("kubejs:torches", "minecraft:soul_torch");

	colors.forEach(color => {
		e.add("kubejs:carpets", `minecraft:${color}_carpet`)
	})
	e.add("kubejs:carpets", "minecraft:moss_carpet")
})

ServerEvents.recipes(e => {
	[
		"andromeda", "bettertridents", "betteranimalsplus",
		"endermanoverhaul", "waystones",
		"illagerexp", "livingthings", "ecologics",
		"naturalist", 
		"sds", "elementalcreepers", "probablychests", 
		"twilightforest", "musictriggers"
	].forEach(key => e.remove({ mod: key }))

	/* 染料拓展配方 Dye recipe expansion */
	e.shapeless("minecraft:black_dye", ["minecraft:charcoal"])
	e.shapeless("2x minecraft:brown_dye", ["minecraft:red_dye", "minecraft:green_dye"])
	e.shapeless("2x minecraft:green_dye", ["minecraft:blue_dye", "minecraft:yellow_dye"])
	e.shapeless("minecraft:white_dye", ["minecraft:white_tulip"])

	/* 镶金黑石制作 Gilded blackstone crafting */
	e.shaped("2x minecraft:gilded_blackstone", [
		"01",
		"10"
	], {
		0: "minecraft:blackstone",
		1: "minecraft:gold_ingot"
	})

	/* 纸合成书 Paper to book */
	e.shapeless("minecraft:book", ["9x minecraft:paper"])

	/* 无序纸合成 Shapeless paper crafting */
	e.shapeless("3x minecraft:paper", ["3x minecraft:sugar_cane"])

	/* 可合成的马凯 Craftable horse armor */
	const horse_armor_recipe = {
		"leather": "leather", "diamond": "diamond",
		"golden": "gold_ingot", "iron": "iron_ingot"
	};
	Object.keys(horse_armor_recipe).forEach(key => {
		e.shaped(`minecraft:${key}_horse_armor`, [
			"111",
			"101",
			"1 1"
		], {
			0: "minecraft:saddle",
			1: horse_armor_recipe[key]
		})
	})

	/* slabs to blocks */
	e.forEachRecipe({ type: "minecraft:crafting_shaped", output: "#minecraft:slabs" }, r => {
		/* credit: Lady Lexxie Black (https://discord.com/channels/303440391124942858/1060221802380546109) */
		const ingredients = r.originalRecipeIngredients;
		const outputId = r.originalRecipeResult.id;
		if (outputId.contains("chiseled")) return;
		e.shapeless(ingredients[0], [`2x ${outputId}`]);
	})

	/* 紫水晶配方添加 Amethyst recipe addition */
	e.shapeless("minecraft:small_amethyst_bud", ["minecraft:amethyst_shard"])
	e.shapeless("minecraft:medium_amethyst_bud", ["2x minecraft:amethyst_shard"])
	e.shapeless("minecraft:large_amethyst_bud", ["3x minecraft:amethyst_shard"])
	e.shapeless("minecraft:amethyst_cluster", ["4x minecraft:amethyst_shard"])

	/* 精致点染的配方拓展 More recipes for fancydyes mod */
	colors.forEach(key => {
		e.shapeless(`fancydyes:shimmer_${key}_dye`, [`fancydyes:solid_${key}_dye`, "#minecraft:glowing_items"]);
		e.shapeless(`fancydyes:shimmer_${key}_dye`, [`minecraft:${key}_dye`, "minecraft:glass_bottle", "#minecraft:glowing_items"])
	})

	/* 更多烧炼配方 More smelting recipes */
	const recycle = {
		"#minecraft:iron_nugget_items": "minecraft:iron_nugget",
		"#minecraft:iron_ingot_items": "minecraft:iron_ingot",
		"minecraft:anvil": "minecraft:iron_block",
		"#minecraft:gold_nugget_items": "minecraft:gold_nugget",
		"#minecraft:gold_ingot_items": "minecraft:gold_ingot"
		/* gold and iron block recipes are in datapack */
	}
	Object.keys(recycle).forEach(key => {
		const data = recycle[key];
		e.smelting(data, key);
		e.blasting(data, key)
	})

	/* 手撕物品 Tear them apart! */
	e.shapeless("minecraft:iron_nugget", ["#minecraft:iron_nugget_items"]);
	e.shapeless("minecraft:gold_nugget", ["#minecraft:gold_nugget_items"]);
	e.shapeless("minecraft:iron_ingot", ["#minecraft:iron_ingot_items"]);
	e.shapeless("minecraft:gold_ingot", ["#minecraft:gold_ingot_items"]);

	const armor_types = [
		"helmet", "chestplate",
		"leggings", "boots"
	]
	armor_types.forEach(key => {
		e.shapeless("minecraft:leather", [`minecraft:leather_${key}`])
	})
	e.shapeless("2x minecraft:leather", ["minecraft:leather_horse_armor"])
	e.shapeless("2x minecraft:leather", ["minecraft:saddle"])
	e.shapeless("2x minecraft:leather", ["minecraft:bundle"])

	/* 发光物品展示框 Glow item frame */
	e.shapeless("minecraft:glow_item_frame", ["minecraft:item_frame", "#minecraft:glowing_items"])

	/* 原版附魔台配方调整 Tweaking vanilla enchanting table recipe */
	e.remove({ output: "minecraft:enchanting_table" })
	e.shaped("minecraft:enchanting_table", [
		"232",
		"333"
	], {
		2: "bosses_of_mass_destruction:soul_star",
		3: "minecraft:obsidian"
	})

	/* 钓竿升级 Fishing rod upgrade */
	e.smithing("gofish:diamond_reinforced_rod", "minecraft:fishing_rod", "minecraft:diamond_block")

	/* 一些随意添加 Some random additions */
	e.shapeless("minecraft:amethyst_shard", ["minecraft:amethyst_cluster"])
	e.shapeless("minecraft:smithing_table", ["minecraft:crafting_table", "2x minecraft:iron_ingot"])
	e.shapeless("minecraft:fletching_table", ["minecraft:crafting_table", "2x minecraft:flint"])
	e.shapeless("minecraft:stone_button", ["minecraft:cobblestone"])
	e.shaped("minecraft:grindstone", [
		"212",
		"0 0"
	],
		{
			0: "#minecraft:planks",
			1: "minecraft:cobblestone",
			2: "minecraft:stick"
		})
	e.shaped("minecraft:stone_pressure_plate", [
		"00"
	], {
		0: "#minecraft:stone_crafting_materials"
	})
	e.smelting("minecraft:iron_nugget", "illagerexp:hatchet")

	/* 畜肉 Meat */
	e.smelting("kubejs:cooked_meat", "kubejs:meat")
	e.smoking("kubejs:cooked_meat", "kubejs:meat")
	e.campfireCooking("kubejs:cooked_meat", "kubejs:meat")

	/* 黏性物品 Sticky stuffs */
	e.shapeless("kubejs:sticky_torch", ["minecraft:slime_ball", "minecraft:coal", "minecraft:stick"])
	e.shapeless("kubejs:sticky_torch", ["minecraft:slime_ball", "#kubejs:torches"])
	e.shapeless("kubejs:sticky_ender_pearl", ["minecraft:slime_ball", "minecraft:ender_pearl"])

	const banned_output = [
		"patchouli:guide_book", "minecraft:recovery_compass", 
		"#minecraft:chestsandkeys", "#minecraft:fancydyes"
	];
	banned_output.forEach(key => e.remove({ output: key }))

	log_types.forEach(key => {
		e.remove({ output: `minecraft:${key}_boat` })
		e.remove({ output: `minecraft:${key}_chest_boat` })
	})

	e.shaped("minecraft:oak_boat", [
		"0 0",
		"000"
	], {
		0: "#minecraft:planks"
	})
	e.shapeless("minecraft:oak_chest_boat", ["minecraft:chest", "minecraft:oak_boat"])
	e.shaped("minecraft:oak_chest_boat", [
		"010",
		"010"
	], {
		0: "#minecraft:planks",
		1: "minecraft:chest"
	})

	const cook = {
		"#betteranimalsplus:eggs_common": "farmersdelight:fried_egg",
		"ecologics:prickly_pear": "ecologics:cooked_prickly_pear"
	};
	Object.keys(cook).forEach(key => {
		const data = cook[key];
		e.smelting(data, key);
		e.smoking(data, key);
		e.campfireCooking(data, key);
	})

	e.shaped("waystones:waystone", [
		"000",
		"010",
		"010"
	], {
		0: "#minecraft:stone_crafting_materials",
		1: "bosses_of_mass_destruction:soul_star"
	})

	e.shapeless("kubejs:soul_remnant", ["bosses_of_mass_destruction:soul_star"])

	/* 矿物鱼 Mineral fishes */
	const mineral_fishes = ["emerald", "diamond"];
	mineral_fishes.forEach(key => {
		e.smelting(`minecraft:${key}`, `kubejs:${key}_fish`)
		e.smoking(`minecraft:${key}`, `kubejs:${key}_fish`)
		e.blasting(`minecraft:${key}`, `kubejs:${key}_fish`)
		e.campfireCooking(`minecraft:${key}`, `kubejs:${key}_fish`)
	})
	e.smelting("8x minecraft:lapis_lazuli", "kubejs:lapis_fish")
	e.smelting("minecraft:gold_ingot", "kubejs:gold_fish")

	e.smoking("8x minecraft:lapis_lazuli", "kubejs:lapis_fish")
	e.smoking("minecraft:gold_ingot", "kubejs:gold_fish")

	e.blasting("8x minecraft:lapis_lazuli", "kubejs:lapis_fish")
	e.blasting("minecraft:gold_ingot", "kubejs:gold_fish")

	e.campfireCooking("8x minecraft:lapis_lazuli", "kubejs:lapis_fish")
	e.campfireCooking("minecraft:gold_ingot", "kubejs:gold_fish")

	/* 羽毛 Feathers */
	const feather_recipe = {
		"golden": "gold_nugget"
	};
	Object.keys(feather_recipe).forEach(key => {
		e.shaped(`kubejs:${key}_feather`, [
			"000",
			"010",
			"000"
		], {
			0: `minecraft:${feather_recipe[key]}`,
			1: "minecraft:feather"
		})
	})
	e.shapeless("kubejs:amethyst_feather", ["minecraft:feather", "3x minecraft:amethyst_shard"])

	/* 追溯珍珠 Recovery pearl */
	e.shapeless("kubejs:recovery_pearl", ["minecraft:recovery_compass", "2x minecraft:ender_pearl"])

	/* 黄金钥匙 Golden key */
	e.shaped("andromeda:lockpick", [
		" 11",
		" 1 ",
		"1  "
	], {
		1: "minecraft:gold_ingot"
	})

	/* 磁铁 Magnet */
	e.shaped("andromeda:magnet", [
		"0 0",
		"1 1",
		" 1 "
	], {
		0: "minecraft:netherite_scrap",
		1: "minecraft:gold_ingot",
	})

	e.shaped("minecraft:debug_stick", [
		"000",
		"010",
		"000"
	], {
		0: "minecraft:diamond",
		1: "minecraft:stick"
	})

	/* Medallion of undying */
	e.shapeless("kubejs:medallion_of_undying", ["9x minecraft:gold_block"])

	/* Dyeable leaves & leaf carpets */
	log_types.forEach(type => {
		e.shaped(`3x kubejs:${type}_leaf_pile`, ["00"], {
			0: `minecraft:${type}_leaves`
		});
		colors.forEach(color => {
			const key = `${color}_${type}`;
			e.shaped(`3x kubejs:${key}_leaf_pile`, ["00"], {
				0: `kubejs:${key}_leaves`
			});
			e.shapeless(`8x kubejs:${key}_leaf_pile`, [`8x #kubejs:${type}_leaf_piles`, `minecraft:${color}_dye`]);
			e.shapeless(`8x kubejs:${key}_leaves`, [`8x #kubejs:${type}_leaves`, `minecraft:${color}_dye`]);
		})
	})


	e.remove({ output: "minecraft:recovery_compass" });

	e.shapeless("4x kubejs:explosive_arrow", ["3x minecraft:arrow", "minecraft:gunpowder"]);
	e.shapeless("4x kubejs:hook_arrow", ["minecraft:arrow", "minecraft:slime_ball"]);

	e.shapeless("2x farmersdelight:cabbage_seeds", ["farmersdelight:cabbage"]);
	e.shapeless("farmersdelight:cabbage_seeds", ["farmersdelight:cabbage_leaf"]);

	e.shapeless("probablychests:mimic_hand_bell", ["probablychests:pet_mimic_key"]);

	e.remove({ output: "windchimes:copper_chime" });

	e.shaped("minecraft:bundle", [
		"000",
		"010",
		"000"
	], {
		0: "minecraft:leather",
		1: "minecraft:diamond"
	})

	e.shapeless("minecraft:deepslate", ["minecraft:cobbled_deepslate"]);

	e.remove({ output: "dummmmmmy:target_dummy_placer" })
	e.shaped("dummmmmmy:target_dummy_placer", [
		"0",
		"0",
		"0"
	], {
		0: "minecraft:hay_block"
	})

	e.remove({ output: "fancydyes:empty_dye_bottle" })
	e.shapeless("fancydyes:empty_dye_bottle", ["minecraft:glass_bottle"]);

	e.remove({ output: "minecraft:lightning_rod" })
	e.shaped("minecraft:lightning_rod", [
		"0",
		"0",
		"0"
	], {
		0: "minecraft:iron_ingot"
	})

	e.shapeless("4x minecraft:slime_ball", ["minecraft:slime_block"]);

	e.remove({ output: "minecraft:spyglass" })
	e.shaped("minecraft:spyglass", [
		"1",
		"0",
		"0"
	], {
		0: "minecraft:iron_ingot",
		1: "minecraft:amethyst_shard"
	})

	e.shapeless("kubejs:tripwire_arrow", ["#minecraft:arrows", "minecraft:stick", "minecraft:iron_ingot", "#minecraft:planks"]);

	e.remove({ output: "minecraft:stonecutter" })
	e.shapeless("minecraft:stonecutter", ["3x #minecraft:stone_crafting_materials", "minecraft:iron_ingot"]);

	log_types.forEach(type => {
		const other_types = log_types.filter(t => t != type);
		other_types.forEach(other_type =>
			e.shapeless(`minecraft:${other_type}_log`, [`#minecraft:${type}_logs`])
		);

		const variants = Ingredient.of(`#minecraft:${type}_logs`).getItemIds();
		variants.forEach(variant => {
			const other_variants = variants.filter(v => v != variant);
			other_variants.forEach(other_variant =>
				e.shapeless(other_variant, [variant])
			)
		})
	})

	/* Unify */
	function unify(items) {
		items.forEach(item => {
			const other_items = items.filter(i => i != item);
			other_items.forEach(other_item =>
				e.shapeless(other_item, [item])
			)
		})
	};

	global.small_flowers = Ingredient.of("#minecraft:small_flowers").getItemIds();
	global.saplings = Ingredient.of("#minecraft:saplings").getItemIds();
	global.leaves = Ingredient.of("#minecraft:leaves").getItemIds();
	global.stones = [
		"minecraft:cobblestone", "minecraft:granite", "minecraft:diorite",
		"minecraft:andesite", "minecraft:tuff", "minecraft:deepslate"
	];
	global.dirts = [
		"minecraft:dirt", "minecraft:podzol", "minecraft:coarse_dirt",
		"minecraft:rooted_dirt", "minecraft:mud"
	];
	const log_tags = [
		"#minecraft:dark_oak_logs",
		"#minecraft:oak_logs",
		"#minecraft:acacia_logs",
		"#minecraft:birch_logs",
		"#minecraft:jungle_logs",
		"#minecraft:spruce_logs",
		"#minecraft:mangrove_logs"
	]
	global.logs = Ingredient.of(log_tags).getItemIds();

	unify(global.dirts);
	unify(global.saplings);
	unify(global.leaves);
	unify(global.stones);
	unify(global.small_flowers);

	const unified_meat = [
		"rabbit", "porkchop",
		"beef", "mutton"
	]
	e.remove({ output: "minecraft:rabbit_stew" });

	unified_meat.forEach(key => {
		e.shapeless("kubejs:meat", [`minecraft:${key}`]);
		e.shapeless("kubejs:cooked_meat", [`minecraft:cooked_${key}`]);
	})

	/* not changing loots of those things since they are less generated */
	const fence_gates = [
		"minecraft:acacia_fence_gate",
		"minecraft:birch_fence_gate",
		"minecraft:dark_oak_fence_gate",
		"minecraft:jungle_fence_gate",
		"minecraft:oak_fence_gate",
		"minecraft:spruce_fence_gate",
		"minecraft:crimson_fence_gate",
		"minecraft:warped_fence_gate",
		"minecraft:mangrove_fence_gate"
	];
	const planks = Ingredient.of("#minecraft:planks").getItemIds();
	const signs = Ingredient.of("#minecraft:signs").getItemIds();
	const wooden_stuffs = [
		"doors", "trapdoors", "fences",
		"pressure_plates", "buttons",
		"slabs", "stairs"
	];

	wooden_stuffs.map(s => `#minecraft:wooden_${s}`);
	wooden_stuffs.forEach(s => unify(Ingredient.of(s).getItemIds()))
	unify(fence_gates);
	unify(planks);
	unify(signs);

	e.shaped("kubejs:iron_golem", [
		" 0 ",
		"111",
		" 1 "
	], {
		0: "minecraft:carved_pumpkin",
		1: "minecraft:iron_block"
	})
	e.shaped("kubejs:snow_golem", [
		" 0 ",
		" 1 ",
		" 1 "
	], {
		0: "minecraft:carved_pumpkin",
		1: "minecraft:snow_block"
	})
})