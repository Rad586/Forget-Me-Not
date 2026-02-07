ItemEvents.tooltip(e => {
	e.add(["andromeda:magnet"], [
		Text.translate("dialogue.fmn.magnet1"),
		Text.translate("dialogue.fmn.magnet2")
	]);

	const advanced = {
		"chest": [
			"minecraft:chest", "minecraft:barrel", "minecraft:trapped_chest"
		],
		"gold_set": [
			"minecraft:golden_helmet", "minecraft:golden_chestplate",
			"minecraft:golden_leggings", "minecraft:golden_boots"
		],
		"crafting_table": [
			"minecraft:crafting_table", "minecraft:shulker_box"
		],
		"stone": [
			"minecraft:stone"
		],
		"deep": [
			"minecraft:deepslate"
		],
		"anvil": [
			"minecraft:anvil"
		],
		"use_bottle": [
			"minecraft:glass_bottle"
		],
		"boat": [
			"minecraft:oak_boat"
		],
		"obsidian": [
			"minecraft:obsidian"
		],
		"horse": [
			"minecraft:iron_horse_armor", "minecraft:golden_horse_armor", "minecraft:diamond_horse_armor",
			"minecraft:leather_horse_armor", "minecraft:dragon_horse_armor"
		],
		"dirt": [
			"minecraft:dirt"
		],
		"netherrack": [
			"minecraft:netherrack"
		],
		"fish": [
			"minecraft:cod", "minecraft:salmon", "minecraft:tropical_fish"
		],
		"torch": [
			"minecraft:torch", "minecraft:soul_torch"
		],
		"waystone": [
			"waystones:waystone"
		],
		"dismount": [
			"minecraft:ender_pearl"
		],
		"fire": [
			"minecraft:shield"
		],
		"debug_stick": [
			"minecraft:debug_stick"
		],
		"ladder": [
			"minecraft:ladder"
		],
		"drowned": [
			"minecraft:nautilus_shell"
		],
		"flint_and_steel": [
			"minecraft:flint_and_steel"
		],
		"amethyst_feather": [
			"kubejs:amethyst_feather"
		],
		"crying_obsidian": [
			"minecraft:crying_obsidian"
		],
		"furnace": [
			"minecraft:furnace", "minecraft:smoker", "minecraft:blast_furnace"
		],
		"gold_block": [
			"minecraft:gold_block"
		],
		"piglin_trade": [
			"minecraft:gold_nugget"
		],
		"diamond": [
			"minecraft:diamond"
		],
		"glow_berries": [
			"minecraft:glow_berries"
		],
		"normal_chest_mimic": [
			"probablychests:normal_chest"
		],
		"goat_horn": [
			"minecraft:goat_horn"
		],
		"nether_wart": [
			"minecraft:nether_wart"
		],
		"oak_leaves": [
			"minecraft:birch_leaves", "minecraft:dark_oak_leaves",
			"minecraft:acacia_leaves", "minecraft:jungle_leaves", "minecraft:spruce_leaves",
			"minecraft:azalea_leaves", "minecraft:flowering_azalea_leaves", "minecraft:mangrove_leaves"
		],
		"zombie": [
			"minecraft:rotten_flesh"
		],
		"skeleton": [
			"minecraft:bone"
		],
		"creeper1": [
			"minecraft:gunpowder"
		],
		"spider": [
			"minecraft:string"
		],
		"blaze": [
			"minecraft:blaze_rod"
		],
		"magma_cube": [
			"minecraft:magma_cream"
		],
		"skull": [
			"minecraft:wither_skeleton_skull"
		],
		"amethyst": [
			"minecraft:amethyst_shard"
		],
		"fletching_table": [
			"minecraft:fletching_table"
		],
		"sapling": [
			"minecraft:wheat_seeds"
		],
		"coal_ore": [
			"minecraft:coal"
		],
		"campfire": [
			"minecraft:campfire", "minecraft:soul_campfire"
		],
		"oak_door": [
			"minecraft:iron_door", "minecraft:oak_door", "minecraft:birch_door", "minecraft:dark_oak_door",
			"minecraft:acacia_door", "minecraft:jungle_door", "minecraft:spruce_door",
			"minecraft:mangrove_door", "minecraft:warped_door", "minecraft:crimson_door"
		],
		"item_frame": [
			"minecraft:item_frame", "minecraft:glow_item_frame"
		],
		"spyglass": [
			"minecraft:spyglass"
		],
		"bell": [
			"minecraft:bell"
		],
		"shears": [
			"minecraft:shears"
		],
		"carved_pumpkin": [
			"minecraft:carved_pumpkin"
		],
		"dragon_breath2": [
			"minecraft:dragon_breath"
		],
		"minecart": [
			"minecraft:minecart"
		],
		"snowwhisper": [
			"kubejs:snowwhisper"
		],
		"hay_block": [
			"minecraft:hay_block"
		],
		"cauldron": [
			"minecraft:cauldron"
		],
		"stove": [
			"farmersdelight:stove"
		],
		"soap": [
			"fancydyes:solid_red_dye", "fancydyes:solid_orange_dye", "fancydyes:solid_yellow_dye",
			"fancydyes:solid_green_dye", "fancydyes:solid_lime_dye", "fancydyes:solid_cyan_dye",
			"fancydyes:solid_light_blue_dye", "fancydyes:solid_blue_dye", "fancydyes:solid_purple_dye",
			"fancydyes:solid_pink_dye", "fancydyes:solid_magenta_dye", "fancydyes:solid_brown_dye",
			"fancydyes:solid_white_dye", "fancydyes:solid_light_gray_dye", "fancydyes:solid_gray_dye",
			"fancydyes:solid_black_dye"
		],
		"bundle": [
			"minecraft:leather", "minecraft:rabbit_hide"
		],
		"recovery_compass": [
			"minecraft:recovery_compass"
		],
		"soul_star_tip": [
			"bosses_of_mass_destruction:soul_star"
		],
		"saddle": [
			"minecraft:saddle"
		],
		"slime_ball": [
			"minecraft:slime_ball"
		],
		"lockpick": [
			"andromeda:lockpick"
		],
		"bundle2": [
			"minecraft:bundle"
		],
		"hot_biome": [
			"minecraft:sand", "minecraft:cactus"
		],
		"cold_biome": [
			"minecraft:snowball", "minecraft:powder_snow_bucket"
		],
		"grass": [
			"minecraft:wooden_hoe", "minecraft:iron_hoe",
			"minecraft:golden_hoe", "minecraft:diamond_hoe",
			"minecraft:netherite_hoe"
		],
		"deep": [
			"minecraft:raw_gold"
		],
		"redstone": [
			"minecraft:redstone", "minecraft:redstone_torch"
		],
		"wolf": [
			"kubejs:meat", "kubejs:cooked_meat"
		],
		"hoe": [
			"minecraft:wheat"
		],
		"hoe2": [
			"minecraft:grass"
		],
		"tnt": [
			"minecraft:tnt"
		],
		"breeding": [
			"minecraft:carrot"
		],
		"free": [
			"minecraft:lava_bucket"
		]
	};

	const shift = Text.translate("dialogue.fmn.shift");
	Object.keys(advanced).forEach(d => {
		const items = advanced[d];
		const dialogue = Text.translate("dialogue.fmn." + d).darkGray();
		e.addAdvanced(items, (stack, isAdvanced, tooltip) => {
			if (e.isShift()) tooltip.add(dialogue);
			else tooltip.add(shift);
		});
	});

	/*upgrade or reforge amount*/
	const upgrade = Text.translate("dialogue.fmn.upgrade").getString();
	const reforge = Text.translate("dialogue.fmn.reforge").getString();
	const tdmg = Text.translate("dialogue.fmn.dmg").getString();
	const tspd = Text.translate("dialogue.fmn.spd").getString();
	const { upgrade_limit, reforge_limit } = global;
	e.addAdvanced(global.Weapons, (stack, isAdvanced, tooltip) => {
		const { nbt } = stack;
		if (!nbt) return;

		const { Upgrade, Reforge } = nbt;
		const nn1 = (Upgrade != null), nn2 = (Reforge != null);
		if (nn1 || nn2) {
			let { dmg, spd } = nbt;
			tooltip.removeIf(t => {
				const { key } = t.getContents();
				const modifiers = ["attribute.modifier.take.0", "attribute.modifier.plus.0"];
				return modifiers.includes(key);
			});
			tooltip.add(Text.of(" " + dmg + tdmg).darkGreen());
			tooltip.add(Text.of(" " + spd + tspd).darkGreen());
		};
		if (nn1 && Upgrade != 0) tooltip.add(upgrade + Upgrade + "/" + upgrade_limit);
		if (nn2 && Reforge != 0) tooltip.add(reforge + Math.abs(Reforge) + "/" + reforge_limit);
	});
	e.addAdvanced(global.Armors, (stack, isAdvanced, tooltip) => {
		const { nbt } = stack;
		if (!nbt) return;

		const { Upgrade } = nbt;
		if (Upgrade == null || Upgrade == 0) return;

		tooltip.add(upgrade + Upgrade + "/" + upgrade_limit);
	});

	/*tooltips for runics*/
	const runics = [
		"kubejs:upgrade_runic", "kubejs:reforge_runic_dmg",
		"kubejs:reforge_runic_spd", "kubejs:reveal_runic",
	];
	const runic_usage = Text.translate("dialogue.fmn.runic_usage");
	runics.forEach(runic => {
		const name = runic.split(":")[1];
		const info = Text.translate("dialogue.fmn." + name);
		e.addAdvanced(runic, (stack, isAdvanced, tooltip) => {
			if (e.isShift()) {
				tooltip.add(info);
				tooltip.add(runic_usage);
			}
			else tooltip.add(shift)
		})
	})

	/*hide enchantment tooltips when not revealed*/
	const reveal_warn = Text.translate("dialogue.fmn.reveal_warn");
	const not_revealed = Text.translate("dialogue.fmn.not_revealed");
	global.Upgradeables.forEach(id => {
		e.addAdvanced(id, (stack, isAdvanced, tooltip) => {
			if (!stack.isEnchanted()) return;
			const { nbt: { revealed } } = stack;
			if (revealed != false) return;

			tooltip.removeIf(t => {
				const { key } = t.getContents();
				return key ? key.includes("enchantment.") : false;
			});
			tooltip[0] = tooltip[0].append(not_revealed).darkPurple();

			if (e.isShift()) tooltip.add(reveal_warn)
			else tooltip.add(shift)
		})
	})

	const goat_horn2 = Text.translate("dialogue.fmn.goat_horn2").getString();
	e.addAdvanced("minecraft:goat_horn", (stack, isAdvanced, tooltip) => {
		const { Name } = stack.nbt;
		if (!Name) return;
		tooltip[0] = tooltip[0].append("[" + goat_horn2 + Name + "]")
	})

	e.addAdvanced("minecraft:filled_map", (stack, isAdvanced, tooltip) => {
		tooltip.removeIf(t => {
			const { key } = t.getContents();
			return key ? key.includes("crowmap") : false;
		});
		if (!e.isShift()) tooltip.add(shift)
	})

	/* auto path */
	const start_msg = Text.translate("dialogue.fmn.start").getString();
	const auto_path_msg = Text.translate("dialogue.fmn.auto_path").darkGray();
	const cancel_msg = Text.translate("dialogue.fmn.auto_path_cancel").darkGray();
	global.Shovels.forEach(shovel => {
		e.addAdvanced(shovel.id, (stack, isAdvanced, tooltip) => {
			const { nbt } = stack;
			if (nbt && nbt.Start) {
				const { Start: s } = nbt;
				tooltip.add(Text.of(`${start_msg}(${s[0]}, ${s[1]}, ${s[2]})`).gold());
				tooltip.add(cancel_msg)
			}
			else {
				if (!e.isShift()) tooltip.add(shift)
				else tooltip.add(auto_path_msg)
			}
		})
	})
})