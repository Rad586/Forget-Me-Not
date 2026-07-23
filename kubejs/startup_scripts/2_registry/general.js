//priority: 6
ItemEvents.toolTierRegistry(e => {
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
	for (let i = 0; i <= 15; i += 3) {
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

	//Medallion of Undying
	e.create("medallion_of_undying").rarity("rare").tooltip(Text.translate("dialogue.fmn.medallion")).fireResistant(true);
	e.create("medallion_of_undying_activated");

	//Heart of demon
	e.create("heart_of_demon").rarity("epic").tooltip(Text.translate("dialogue.fmn.heart_of_demon")).fireResistant(true);

	//Caving dimension
	caving_dim.filter(i => i != "random").forEach(key => e.create(key));
	for (let i = 0; i <= 15; i += 3) e.create(`level_${i}_pickaxe`, "pickaxe").tier(`caving${i}`);

	//soul remnant
	e.create("soul_remnant")
		.food(food =>
			food
				.hunger(0)
				.saturation(0)
				.alwaysEdible()
				.fastToEat()
				.eaten(ctx => {
					const { player } = ctx, { level } = player;
					if (level.isClientSide()) return;

					global.updateMaxHealth(player, 1);
					doSimpleTip(player, "soul_remnant_tip", "s2");

					global.particleBurst(level, player, "sculk_soul", 3, 0.06, 0.08);
					global.particleBurst(level, player, "soul_fire_flame", 4, 0.08, 0);
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
			.use((level, player, hand) => level.isOverworld() &&
				global.advancedRayTraceBlock(player, 4).type != "MISS")

			.finishUsing((item, level, entity) => {
				if (level.isClientSide()) return item;

				const golem = level.createEntity(id);
				let block, nohit;
				if (entity.isCrouching()) {
					let result = entity.rayTrace(4);
					let hit_block = result.block;
					if (!hit_block) nohit = true;
					else block = hit_block[result.facing]
				}
				else {
					let result = global.advancedRayTraceBlock(entity, 4);
					let hit_block = level.getBlock(result.blockPos);
					if (result.type == "MISS") nohit = true;
					else block = hit_block[result.direction]
				};
				if (nohit == true) return item;

				const { x, y, z } = block, { eyeHeight } = golem;
				if (id == "minecraft:iron_golem") {
					golem.mergeNbt({ PlayerCreated: true })
				};
				golem.setPosition(x + 0.5, y, z + 0.5);
				golem.spawn();

				level.spawnParticles(
					global.itemParticle(key), true,
					x + 0.5, y + eyeHeight + 0.5, z + 0.5,
					0.3, 0.3, 0.3,
					4, 0
				);
				level.playSound(null,
					x + 0.5, y + eyeHeight + 0.5, z + 0.5,
					id.replace(":", ":entity.") + ".hurt",
					"master", 0.4, 1.2
				);
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
			if (level.isClientSide()) return item;

			Utils.server.tell("finish")
			return item
		})

	function createTrinket(name) {
		const rarity = {
			1: "rare",
			2: "epic",
			3: "uncommon"
		};

		const { step, percent } = global.trinkets[name];
		const unit = percent ? 100 : 1;

		for (let i = 1; i <= (3/* || global.trinkets[n].maxLvl*/); i++) {
			let value = +(i * step * unit).toFixed(2);

			e.create(`${name}_rune_${i}`)
				.maxStackSize(1)
				.tag("trinkets:chest/necklace")
				.tag("kubejs:runes")
				.rarity(rarity[i])
				.tooltip(Text.of("+" + value)
					.append(Text.translate(`dialogue.fmn.${name}_rune`))
					.darkGray()
				)
		}
	}

	Object.keys(global.trinkets).forEach(n => 
		createTrinket(n/*, global.trinkets[n].maxLvl*/))

	Object.keys(global.skills).forEach(name => {
		const rarity = {
			1: "rare",
			2: "epic",
			3: "uncommon"
		};

		if (name.includes("_")) return;
		for (let i = 1; i <= 3; i++) {
			e.create(`${name}_fragment_${i}`)
				.maxStackSize(1)
				.tag("trinkets:head/face")
				.tag("kubejs:fragments")
				.rarity(rarity[i])
				.tooltip(Text.translate(`dialogue.fmn.${name}_fragment`)
					.darkGray()
				)
		}
	})
})

/* 

符文设计原则：

1. 类数值
解释：可用“+x单位”（类似数值）简单描述；成长线性（没有边际收益递减，也不会指数型提升）
正面例子：+1吸血、+1%攻击速度、+1反伤
反面例子：
① 是机制不是数值：清除自身减益
② 非线性：满级质变
③ 描述复杂：受到致命伤害时保留1点生命值概率

2. 无条件
解释：没有要详细说明的判断条件
正面例子：吸血（总能吸血，但不会超过生命值上限，这是常识/一般共识）
反面例子：
① 特定外部条件：夜晚增伤（详细说明了时间条件）、平原群系增伤（详细说明了地点条件）
② 特定自身条件：持盾时xx、移动/潜行/静止/下落时xx

3. 普适
解释：只考虑一般原版怪物（如僵尸、骷髅）
正面例子：+1攻击伤害、+1%移动速度
反面例子：
① 不符合原版怪物：护甲/护盾穿透（几乎没有带护盾或高护甲的怪物）、真实伤害、命中率、治疗减效
② 针对部分生物：击中失明（主要针对玩家）
③ 针对部分伤害类型：弹射物抗性/增伤（针对特定类型）
④ 针对部分场景：游泳速度增加（针对水下场景）
⑤ 打怪用不着：方块破坏范围、方块破坏速度、负面效果抗性（大部分情况用不到）

4. 兼容
解释：符文间不存在取代/冲突/重复
正面例子：
① 相互搭配：反伤与点燃搭配（点燃攻击者）
② 不同区间：护甲值与固定减伤（对不同伤害区间，效果不同）
③ 同一项目的不同构成：攻击伤害与攻击速度（攻击项目的两个构成）、暴击伤害与暴击率（暴击项目的两个构成）
反面例子：
① 取代：凋零取代中毒、幸运取代增加方块/实体爆率
② 只有单位不同：+x护甲值与+x%护甲值重复（项目都是护甲值，只是单位不同）、攻击增伤与攻击百分比增伤
③ 大致重复/换个叫法：闪避率/格挡率约等于固定百分比免伤（与固定减伤重复）、生命恢复量与治疗效果、伤害转化生命与固定减伤
④ 细分项目：自然回血与主动回血（这是“治疗效果”的细分项，只应保留“治疗效果”，而非其细分项）
⑤ 同项目不同触发：攻击点燃目标与受击点燃攻击者（只应保留攻击点燃目标），攻击护盾与受击护盾

5. 即时收益
解释：戴上马上提升战力，不存在“还用不了”或“这个最弱”
正面例子：+1%恢复量、+1幸运
反面例子：
① 条件限制：提升火焰伤害倍率（没点燃用不了）
② 作用相对不够大：增加/减少击退（太弱）、自动进食

6. 符合机制
解释：这个整合包里，耐久、经验、附魔、饥饿值机制均被移除
正面例子：-
反面例子：降低饥饿值消耗、降低耐久消耗、提升经验获取

7. 黑名单
设计的符文的项目（无论增减）不应出现在这个名单里：
针对性伤害防护/攻击增强（摔落/暴击/元素/魔法/中毒/火焰/近战/远程…），
弹射物相关（伤害/距离/速度），
挖掘相关（范围、速度、连锁数量），
掉落相关（方块/实体掉落量，物品拾取…），
爆炸相关（任何形式触发或修改爆炸），
水中相关（水下视野、游泳速度、最大氧气值…），
移动相关（击退，霸体，缓慢，跳跃高度，最大行走高度，潜行，引力/重力），
连击相关（连击增伤/减伤，重复伤害），移动惩罚，攻击前/后摇，
经验获取率，连击伤害，弱点伤害，最大吸收量，
攻击后增益（增益任何东西，移速、伤害…），
受击伤害转化（转化为任何东西，护盾、生命…）护盾，
击杀条件（击杀回血、击杀增加护盾…），
溅射/范围/横扫伤害，命中率，百分比减伤/免伤率，
冷却，生命回复间隔/回血/受伤恢复速度，
修改效果（正/负面效果强度/时长改变），
怪物感知距离，受击自动反击概率，雷击，
攻击穿透实体，碰撞箱，攻击距离，实体大小/尺寸，
斩杀线，秒杀率，无敌帧，闪避率/格挡率，真实伤害，
受击/攻击/击杀给予自身/目标药水效果（力量、速度、急迫…），
受击/攻击控制目标（击退/缓慢/清除仇恨/晕眩/位移/转身/冰冻/打断/吸引/拉扯），

8. 非已有设计
设计的符文的项目（无论增减）不应出现在这个名单里：
攻击伤害，最大生命，护甲值，盔甲韧性/护甲韧性，
击中着火，吸血，反伤，固定减伤，攻击速度，
生命恢复量/治疗效果，幸运，移动速度，暴击率，暴击伤害



要求：
帮我设计尽可能多符文。无需提供代码。

流程：
①按照格式，输出设计的符文 → ②检查是否符合全部条件 → ③按推荐等级分类 → ④按指定功能分类

说明：
① 条目格式：每级+x单位x；例：每级+1%移动速度。
② 严格确定所有符文符合所有要求，最终结果不应被反面例子/正面例子包括。
③ 将设计的符文按推荐等级分类，如S、A、B、C。
④ 将设计的符文按这些功能分类：常态生效、攻击生效、受击生效。

*/