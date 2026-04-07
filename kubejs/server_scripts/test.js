/* priority: 20 */

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



//准备移除kjs additions
//排查satin api
//移除一些动物模组？
//击败宝箱怪概率使之成为伙伴
//unique_item 独特物品掉落修改（vsc搜索）
//移除末地相关：要塞X better stronghold，末影龙X enderdragon,true ending/，鞘翅X，潜影盒（流星），末影之眼，烈焰粉，龙蛋，音乐，开局提示，末地相关修复（kjs），相关配方（鞘翅，末影水晶，末影箱），末地相关改动（末影龙火球），龙息，龙蛋龙头，末影水晶相关修改（kjs），紫颂果，爆裂紫颂果
//坐下的提示
//宝箱无法破坏改为“开启宝箱吸引仇恨，宝箱内物资等待出现结果”



ItemEvents.rightClicked(e => {
    function attack(player, target, damage) {
        target.invulnerableTime = 0;
        target.attack(player, damage);
    }
    function attackable(player, target) {
        if (target.isLiving() &&
            target.isAlive() &&
            target.owner != player
        ) return true;

        if (target instanceof Projectile) {
            target.discard()
        };

        return false;
    }
    const hit_criteria = (player, target, range) => (
        target != player &&
        target.distanceToEntity(player) <= range &&
        player.hasLineOfSight(target) &&
        attackable(player, target)
    )
    function areaCheck(level, player, range, func) {
        const aabb = player.boundingBox.inflate(range, 0.5, range);
        const entities = level.getEntitiesWithin(aabb)
            .filter(target => hit_criteria(player, target, range));
        if (entities.isEmpty()) return;
        entities.forEach(target => func(target))
    }
    
    function whirlwind(player, target, damage) {
        attack(player, target, damage)
    }
    function arc(level, player, damage, type) {
        const arc = level.createEntity("kubejs:arc");

        arc.setDeltaMovement(player.lookAngle.scale(2));
        arc.copyPosition(player);
        arc.setY(player.eyeY);
        arc.setOwner(player);
        arc.setNoGravity(true);
        arc.persistentData.dmg = damage;
        arc.persistentData.type = type || "default";
        arc.spawn();
    }
    function inferno(player, target, cd, damage) {
        if (!target.isOnFire()) {
            if (target.block.hasTag("minecraft:soul_fire_base_blocks")) {
                target.fireType = "minecraft:soul"
            };
            target.setSecondsOnFire(cd / 20 + 1.2)
        }
        else {
            attack(player, target, damage);
            target.extinguish()
        }
    }
    function blizzard(target, cd, duration) {
        const { potionEffects } = target;
        if (!target.hasEffect("slowness")) {
            potionEffects.add("slowness", cd / 20 + 1.2, 0, false, true)
        }
        else {
            potionEffects.add("slowness", duration, 1, false, true)
        } 
    }

    const swords = {
        "smite": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * 1.5;
            const cd = delay * 1.5;
            const range = 4 * 1;

            const first = global.advancedRayTraceEntity(player, range);
            if (!first) return;

            if (attackable(player, first)) attack(player, first, damage)
            else {
                player.server.scheduleInTicks(1, () => {
                    const second = global.advancedRayTraceEntity(player, range);
                    if (attackable(player, second)) attack(player, second, damage)
                })
            };

            player.cooldowns.addCooldown(id, cd)
        },
        "whirlwind": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * 0.8;
            const cd = delay * 1.5;
            const range = 4 * 1.2;

            areaCheck(level, player, range, (target) => 
                whirlwind(player, target, damage)
            );

            global.particleRing(level, "spread", range * 3, range, player, "sweep_attack", 0, 0.7);
            global.sound(level, player, "block.candle.extinguish", 2, 1.4);
            global.sound(level, player, "entity.bat.takeoff", 0.4, 1.2);
            global.sound(level, player, "block.beacon.power_select", 0.4, 2);

            // player.cooldowns.addCooldown(id, cd)
        },
        "lunge": () => {

        },
        "arc": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * 0.5;
            const cd = delay * 1;

            arc(level, player, damage);

            player.cooldowns.addCooldown(id, cd)
        },
        "vortex": (level, player, id, delay, dmg, lvl) => {

        },
        "inferno": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * 1;
            const cd = delay * 1.2;
            const range = 4 * 2;

            areaCheck(level, player, range, (target) => 
                inferno(player, target, cd, damage)
            )

            player.cooldowns.addCooldown(id, cd)
        },
        "blizzard": (level, player, id, delay, dmg, lvl) => {
            const duration = dmg * 20 / 2;
            const cd = delay * 1;
            const range = 4 * 3;

            areaCheck(level, player, range, (target) => 
                blizzard(target, cd, duration)   
            );

            player.cooldowns.addCooldown(id, cd)
        }
    }

    swords["whirlwind"](
        e.level,
        e.player,
        e.player.mainHandItem.id,
        e.player.getCurrentItemAttackStrengthDelay() * 2,
        e.player.getAttribute("minecraft:generic.attack_damage").getValue(), 
        1
    )

})


// ItemEvents.rightClicked(e => {
//     Utils.getRegistry("mob_effect").forEach(effect => {
//         const [prefix, path, name] = String(effect.descriptionId).split(".");
//         e.server.tell(path)
//     })
// })