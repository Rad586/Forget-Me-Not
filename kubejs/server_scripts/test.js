/* priority: 20 */

// ItemEvents.rightClicked("gold_ingot", e=> {
// 	function blockHitBehavior(e, block) {
// 		const explosion = block.createExplosion();
// 		explosion.strength(0.4)
// 		explosion.damagesTerrain(false)
// 		explosion.explode()
// 	};
// 	function entityHitBehavior(e, entity) {
// 		if(global.throttle(2)) return;
// 		const explosion = entity.block.createExplosion();
// 		explosion.strength(0.6)
// 		explosion.damagesTerrain(false)
// 		explosion.explode()
// 	};

// 	shootParticle(e, 20, 1, 0.6, -0.02, 32, 1, 255, 154, 52, 0.8, 2, "minecraft:item.firecharge.use", 0.4, Math.random().toFixed(0) * 0.1 + 1.8, entityHitBehavior, blockHitBehavior);
// });

// ItemEvents.rightClicked("lapis_lazuli", e=> {
// 	function blockHitBehavior() {};
// 	function entityHitBehavior(e, entity) {
// 		if(global.throttle(7)) return;
// 		entity.attack(e.player, 1);
// 		entity.knockback(0.00000001, e.player.getViewVector(1).x(), e.player.getViewVector(1).z());
// 		entity.invulnerableTime = 7;
// 	};
// 	shootParticle(e, 0, 1, 1.2, -0.001, 32, 0.3, 76, 130, 255, 0.7, 1, "minecraft:block.end_portal_frame.fill", 0.6, Math.random().toFixed(0) * 0.1 + 0.5, entityHitBehavior, blockHitBehavior);
// });


// ItemEvents.rightClicked("stick", e => {
// 	const {player, server, level} = e;
// 	const {potionEffects} = player;
// 	const dist = server.playerList.getSimulationDistance() * 16;
// 	if(!player.hasEffect("kubejs:timer")) {
// 		potionEffects.add("kubejs:timer", 2, 0, true, false);
// 		server.scheduleInTicks(1, callback => {
// 			if(!player.hasEffect("kubejs:timer")) return;
// 			player.potionEffects.add("kubejs:timer", 2, 0, true, false);
// 			const {block} = player.rayTrace(dist);
// 			if(block) {
// 				let {x, y, z} = block;
// 				global.particleBurstBlock(level, x, y, z, "end_rod", 1, 0.08, 0.4);
// 			}
// 			callback.reschedule();
// 		});
// 	}
// 	else {
// 		player.removeEffect("kubejs:timer");
// 		if(player.isCrouching()) {
// 			let {x, y, z} = player.rayTrace(dist).block;
// 			player.teleportTo(player.level.dimension, x+0.5, y+0.5, z+0.5, player.yaw, player.pitch);
// 			potionEffects.add("kubejs:invincible", 10, 0, true, false);
// 			level.spawnParticles("flash", true, player.x, player.y+player.eyeHeight/3*2, player.z, 0, 0, 0, 1, 0);

// 			server.scheduleInTicks(1, () => {
// 				global.sound(player, "entity.enderman.teleport", 1.2, 1.2);
// 				global.particleBurst(player, "dragon_breath", 24, 0.08);
// 				potionEffects.add("kubejs:soft_landing", 160, 0, true, false);
// 			})
// 		}
// 	}
// })

//


// const caving_dim_values = {
// 	"diamond": 1, "ruby": 1, "sapphire": 1, "emerald": 1,
// 	"alexandrite": 0.8, "aquamarine": 0.8, "opal": 0.8, "turquoise": 0.8,
// 	"topaz": 0.7, "zircon": 0.7, "lapis_lazuli": 0.6, "malachite": 0.6,
// 	"moonstone": 0.5, "schorl": 0.5, "charoite": 0.5, "rhodochrosite": 0.5,
// 	"chalcedony": 0.4, "kunzite": 0.4, "morganite": 0.4, "citrine": 0.4,
// 	"labradorite": 0.3, "grossular": 0.3, "kyanite": 0.3, "agate": 0.3,
// 	"jade": 0.3, "stone": 0.01
// };
// for(let i = 0; i <= 15; i += 3) {
// 	ItemEvents.rightClicked(`kubejs:level_${i}_pickaxe`, e => {
// 		const {player, item} = e;
// 		if(player.isCrouching()) {
// 			let score = 0;
// 			player.inventory.allItems.forEach(item => {
// 				const id = item.id.split(":");
// 				const value = caving_dim_values[id]
// 				if(value) score += value;
// 			});
// 			//effect and sound
// 			player.statusMessage = Text.translate("dialogue.fmn.sell_ores").append(score);
// 			player.addXPLevels(score);
// 		}
// 		else {
// 			let cost = (i**2)*10;
// 			if(player.xpLevel < cost) return;
// 			player.potionEffects.add("kubejs:timer2", 40, 0, true, false);
// 			player.statusMessage = Text.translate("dialogue.fmn.pickaxe_level").append(cost);
// 			if(player.hasEffect("kubejs:timer2")) {
// 				player.addXPLevels(-cost);
// 				item.count--;
// 				player.give(`kubejs:level_${i+1}_pickaxe`);
// 				//effect and sound
// 			}
// 		}
// 	})
// }
// e.server.scoreboard.addPlayerTeam()


// const SMP = Java.loadClass("net.minecraft.world.SimpleMenuProvider");
// const MerchantMenu = Java.loadClass("net.minecraft.world.inventory.MerchantMenu");
// const MerchantOffers = Java.loadClass("net.minecraft.world.item.trading.MerchantOffers");
// const MerchantOffer = Java.loadClass("net.minecraft.world.item.trading.MerchantOffer");

// ItemEvents.entityInteracted(e => {
// 	if(e.hand == "off_hand") return;
// 	const offers = new MerchantOffers();
// 	const offer = new MerchantOffer(
// 		"minecraft:acacia_boat", //costA
// 		"minecraft:air", //costB
// 		"minecraft:emerald", //result
// 		0, //number of trades before requiring restock
// 		20, //maxuses
// 		10, //xp
// 		0.05, //price multiplier
// 		-24 //demand
// 	)
// 	offers.add(offer);
// 	e.server.tell("1 " + offers.getFirst().demand)

// 	const menu = new SMP((i, inv, items) => {
// 		const merchantMenu = new MerchantMenu(i, inv);
// 		merchantMenu.setOffers(offers);
// 		e.server.tell("2 " + merchantMenu.getOffers().getFirst().demand)
// 		return merchantMenu;
// 	}, "guiname2");

// 	e.player.openMenu(menu);
// })


// EntityEvents.spawned("lightning_bolt", e => {
// 	const {block} = e.entity;
// 	if(block.down.id != "minecraft:bedrock") return;

// 	e.server.scheduleInTicks(5, () => {
// 		const c = e.level.createEntity("end_crystal")
// 		c.setPosition(block.x+0.5, block.y, block.z+0.5)
// 		c.spawn()
// 	})
// })




// const attribute = Item.of("minecraft:diamond_sword").getAttributes("generic.attack_damage")
// item.removeAttribute("generic.attack_damage", attribute.id);
// item.addAttribute("generic.attack_damage", attribute.id, attribute.name, attribute.amount + 10, attribute.operation)



// ItemEvents.entityInteracted(e => {
// 	e.server.tell(e.target.displayName)
// })





// EntityEvents.hurt("pig", e => {
// 	const {entity, level} = e;
// 	const {persistentData: pData} = entity;
// 	entity.potionEffects.add("resistance", 99999, 255)
// 	entity.potionEffects.add("slowness", 99999, 255)
// 	if(pData.t == null) pData.t = level.getTime();
// 	else {
// 		// e.server.tell(level.getTime() - pData.t)
// 		pData.t = level.getTime()
// 	}
// })

// ItemEvents.rightClicked(e => {
// 	const Raider = Java.loadClass("net.minecraft.world.entity.raid.Raider");
// 	const { target, player, level } = e, { entity } = target;
// 	// if(!(entity instanceof Raider)) return
// 	const Path = Java.loadClass("net.minecraft.world.entity.ai.navigation.GroundPathNavigation")
// 	const {x, y, z} = player


// 	// e.server.tell(entity.nbt.RaidId)
// 	// e.server.tell(e.level.canSeeSky(player.block.pos))
// 	// e.server.tell(e.level.getHeight("motion_blocking", x, z))

// 	const ENTITY_TYPE_REGISTRY = Java.loadClass("net.minecraft.core.Registry").ENTITY_TYPE_REGISTRY
// 	// e.server.tell(ENTITY_TYPE.byLocation)
// 	// ENTITY_TYPE..forEach(type => {
// 	// 	if (type instanceof Raider) {
// 	// 		e.server.tell(type)
// 	// 	}
// 	// })
// 	const types = Utils.getRegistry("entity_type").getIds()
// 	types.forEach(a => {
// 		if(a instanceof Raider) {
// 			e.server.tell(a)
// 		}
// 	})
// })



//准备移除kjs additions
//排查satin api
//排查elytra
//移除一些动物模组？
//击败宝箱怪概率使之成为伙伴
//unique_item 独特物品掉落修改（vsc搜索）
//移除末地相关：要塞X better stronghold，末影龙X enderdragon,true ending/，鞘翅X，潜影盒（流星），末影之眼，烈焰粉，龙蛋，音乐，开局提示，末地相关修复（kjs），相关配方（鞘翅，末影水晶，末影箱），末地相关改动（末影龙火球），龙息，龙蛋龙头，末影水晶相关修改（kjs），紫颂果，爆裂紫颂果
//坐下的提示
//宝箱无法破坏改为“开启宝箱吸引仇恨，宝箱内物资等待出现结果”

ItemEvents.rightClicked(e => {
    // global.particleRing2("spread", 8, 1, e.player, "smoke", 0.05)
    // e.server.tell(e.level.getHeight("motion_blocking", e.player.x, e.player.z))
})
//测试globalring2
// LevelEvents.tick(e => {
//     Client.player.interactAt()
// })