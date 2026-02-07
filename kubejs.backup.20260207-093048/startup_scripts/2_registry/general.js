//priority: 6
ItemEvents.toolTierRegistry(e => {
	e.add("netherite_iron", tier => {
		tier.uses = 2281;
		tier.speed = 10.0;
		tier.attackDamageBonus = 4.0;
		tier.level = 4;
		tier.enchantmentValue = 15;
		tier.repairIngredient = "advancednetherite:netherite_iron_ingot";
	})
	e.add("netherite_gold", tier => {
		tier.uses = 2313;
		tier.speed = 11.0;
		tier.attackDamageBonus = 4.0;
		tier.level = 4;
		tier.enchantmentValue = 15;
		tier.repairIngredient = "advancednetherite:netherite_gold_ingot";
	})
	e.add("netherite_emerald", tier => {
		tier.uses = 2651;
		tier.speed = 12.0;
		tier.attackDamageBonus = 5.0;
		tier.level = 4;
		tier.enchantmentValue = 18;
		tier.repairIngredient = "advancednetherite:netherite_emerald_ingot";
	})
	e.add("netherite_diamond", tier => {
		tier.uses = 3092;
		tier.speed = 12.0;
		tier.attackDamageBonus = 5.0;
		tier.level = 4;
		tier.enchantmentValue = 18;
		tier.repairIngredient = "advancednetherite:netherite_diamond_ingot";
	})
	e.add("dragon", tier => {
		tier.uses = 2479;
		tier.speed = 12.0;
		tier.attackDamageBonus = 5.0;
		tier.level = 4;
		tier.enchantmentValue = 20;
		tier.repairIngredient = "dragonloot:dragon_scale";
	})
	e.add("breaker", tier => {
		tier.uses = 64;
		tier.speed = 0.875;
		tier.attackDamageBonus = -2.0;
		tier.level = 3;
	})
	e.add("villager", tier => {
		tier.uses = 1200;
		tier.enchantmentValue = 20;
	})
	e.add("unique_weapon", tier => {
		tier.uses = 0;
		tier.enchantmentValue = 0;
	})
	for(let i = 0; i <= 15; i += 3) {
		e.add(`caving${i}`, tier => {
			tier.uses = 0
			tier.speed = 1 + i
			tier.level = 4
		})
	}
})

ItemEvents.armorTierRegistry(e => {
	e.add("v", tier => {
		tier.durabilityMultiplier = 36
		tier.slotProtections = [2, 5, 6, 2]
		tier.enchantmentValue = 10
		tier.equipSound = "minecraft:item.armor.equip_iron"
		tier.toughness = 1.0
	})
	e.add("s", tier => {
		tier.durabilityMultiplier = 100
		tier.slotProtections = [0, 5, 6, 2]
		tier.enchantmentValue = 0
		tier.toughness = 0.0
	})
})

function foodRegistry(e, foodId, hunger, saturation) {
	e.create(foodId).food(food => food.hunger(hunger).saturation(saturation).meat())
};

StartupEvents.registry("item", e => {
	//畜肉 Meat
	foodRegistry(e, "meat", 3, 1.8);
	foodRegistry(e, "cooked_meat", 7, 10);
	foodRegistry(e, "meat_sliced", 1.5, 0.9);
	foodRegistry(e, "cooked_meat_sliced", 3.5, 5);

	//矿物鱼 Mineral fishes
	e.create("lapis_fish")
	e.create("gold_fish")
	e.create("emerald_fish")
	e.create("diamond_fish")

	//怪物用的镐子 Pickaxe for mobs
	e.create("breaker", "pickaxe").tier("breaker")

	//黄金羽毛 Golden feather
	e.create("golden_feather").tooltip(Text.translate("dialogue.fmn.golden_feather")).rarity("uncommon")
	e.create("enchanted_golden_feather").tooltip(Text.translate("dialogue.fmn.enchanted_golden_feather")).rarity("rare").glow(true).texture("kubejs:item/golden_feather")
	e.create("amethyst_feather").rarity("rare")

	//村民武器 Villagers" weapons
	e.create("villagers_oak_door", "axe").tier("villager").attackDamageBaseline(6).speedBaseline(-2.3).rarity("uncommon").glow(true).texture("minecraft:item/oak_door").tooltip(Text.translate("dialogue.fmn.villagers_weapon"))
	e.create("villagers_cauldron", "axe").tier("villager").attackDamageBaseline(6).speedBaseline(-3.6).rarity("uncommon").glow(true).texture("minecraft:item/cauldron").tooltip(Text.translate("dialogue.fmn.villagers_weapon"))
	e.create("villagers_iron_sword", "sword").tier("villager").attackDamageBaseline(3).speedBaseline(-2.4).rarity("uncommon").texture("minecraft:item/iron_sword").tooltip(Text.translate("dialogue.fmn.villagers_weapon"))
	e.create("villagers_iron_axe", "axe").tier("villager").attackDamageBaseline(6).speedBaseline(-3.1).rarity("uncommon").texture("minecraft:item/iron_axe").tooltip(Text.translate("dialogue.fmn.villagers_weapon"))
	e.create("villagers_diamond_sword", "sword").tier("villager").attackDamageBaseline(4).speedBaseline(-2.4).rarity("uncommon").texture("minecraft:item/diamond_sword").tooltip(Text.translate("dialogue.fmn.villagers_weapon"))
	e.create("villagers_diamond_axe", "axe").tier("villager").attackDamageBaseline(6).speedBaseline(-3.0).rarity("uncommon").texture("minecraft:item/diamond_axe").tooltip(Text.translate("dialogue.fmn.villagers_weapon"))

	e.create("villagers_helmet", "helmet").tier("v").texture("minecraft:item/chainmail_helmet").rarity("uncommon").tooltip(Text.translate("dialogue.fmn.villagers_armor"))
	e.create("villagers_chestplate", "chestplate").tier("v").texture("minecraft:item/golden_chestplate").rarity("uncommon").tooltip(Text.translate("dialogue.fmn.villagers_armor"))
	e.create("villagers_leggings", "leggings").tier("v").texture("minecraft:item/golden_leggings").rarity("uncommon").tooltip(Text.translate("dialogue.fmn.villagers_armor"))
	e.create("villagers_boots", "boots").tier("v").texture("minecraft:item/golden_boots").rarity("uncommon").tooltip(Text.translate("dialogue.fmn.villagers_armor"))

	//Unique equipment
	e.create("crown_of_scarlet", "helmet").tier("s").tooltip(Text.translate("dialogue.fmn.crown_of_scarlet")).fireResistant(true);
	e.create("greatsword_of_blood", "sword").tier("unique_weapon").attackDamageBaseline(5).speedBaseline(-2.4).fireResistant(true);
	e.create("snowwhisper", "sword").tier("unique_weapon").attackDamageBaseline(2).speedBaseline(-2.4).fireResistant(true);
	e.create("inferno", "sword").tier("unique_weapon").attackDamageBaseline(5).speedBaseline(-2.4).fireResistant(true);
	e.create("golden_cudgel", "sword").tier("unique_weapon").attackDamageBaseline(4).speedBaseline(-2.4).fireResistant(true);
	e.create("golden_cudgel_large", "sword").tier("unique_weapon").attackDamageBaseline(6).speedBaseline(-3).fireResistant(true);
	e.create("golden_cudgel_small", "sword").tier("unique_weapon").attackDamageBaseline(0).speedBaseline(-1.1).fireResistant(true);

	//Medallion of Undying
	e.create("medallion_of_undying").rarity("rare").tooltip(Text.translate("dialogue.fmn.medallion")).fireResistant(true);
	e.create("medallion_of_undying_activated");

	//Heart of demon
	e.create("heart_of_demon").rarity("epic").tooltip(Text.translate("dialogue.fmn.heart_of_demon")).fireResistant(true);

	//Caving dimension
	caving_dim.filter(i => i != "random").forEach(key => e.create(key));
	for(let i = 0; i <= 15; i += 3) e.create(`level_${i}_pickaxe`, "pickaxe").tier(`caving${i}`);

	//soul remnant
	e.create("soul_remnant")
		.food(food => 
			food
			.hunger(0)
			.saturation(0)
			.alwaysEdible()
			.fastToEat()
			.eaten(ctx => {
				const {player} = ctx;
				if(ctx.player.level.isClientSide()) return;

				global.updateMaxHealth(player, 1);
				doSimpleTip(player, "soul_remnant_tip", "s2");

				global.particleBurst(player, "sculk_soul", 3, 0.06, 0.08);
				global.particleBurst(player, "soul_fire_flame", 4, 0.08, 0);
			})
		)
		.tooltip(Text.translate("dialogue.fmn.soul_remnant"))

	e.create("upgrade_runic").rarity("uncommon").fireResistant(true)
	e.create("reforge_runic_dmg").rarity("uncommon").fireResistant(true)
	e.create("reforge_runic_spd").rarity("uncommon").fireResistant(true)
	e.create("reveal_runic").rarity("uncommon").fireResistant(true)
	e.create("purification_runic").rarity("uncommon").fireResistant(true)

	e.create("tripwire_arrow").maxStackSize(4)
	e.create("fire_extinguisher").fireResistant(true).maxStackSize(1).rarity("epic")

	const golems = {
		"kubejs:iron_golem": "minecraft:iron_golem", 
		"kubejs:snow_golem": "minecraft:snow_golem"
	}
	Object.keys(golems).forEach(key => {
		const id = golems[key];
		e.create(key)
			.unstackable()
			.useAnimation("none")
			.useDuration(item => 1)
			.use((level, player, hand) => 
				level.isOverworld() &&
				!level.getBlock(
					global.advancedRayTraceBlock(player, 4).blockPos
				).blockState.isAir()
			)
			.finishUsing((item, level, entity) => {
				if (level.isClientSide()) return item;

				const golem = level.createEntity(id);
				const result = global.advancedRayTraceBlock(entity, 4);
				const { x, y, z } = level.getBlock(result.blockPos)[result.direction];

				if (id == "minecraft:iron_golem") {
					golem.mergeNbt({ PlayerCreated: true })
				};				
				golem.setPosition(x + 0.5, y, z + 0.5);
				golem.spawn();

				global.particleBurst(golem, global.itemParticle(key), 4, 0.3);
				golem.playSound(id.replace(":", ":entity.") + ".hurt", 0.4, 1.2);

				if (entity.isPlayer()) {
					entity.addItemCooldown(key, 30);
					entity.swing();
				};
				item.shrink(1);
				return item
			})
	})

	e.create("test_sword", "sword")
		.texture("minecraft:item/wooden_sword")
		.glow(true)
		.useAnimation("spear")
		.use((level, player, hand) => {
			/* criteria and sound effect */

			return true
		})
		.useDuration(item => 8) /* cooldown */
		.finishUsing((item, level, entity) => {
			if(level.isClientSide()) return item;

			Utils.server.tell("finish")
			return item
		})


})