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
        if (target &&
            target.isLiving() &&
            target.isAlive() &&
            target != player &&
            target.owner != player
        ) return true;

        if (target instanceof Projectile) {
            target.playSound("fmn:destroy_projectile", 0.3, 1);
            target.level.spawnParticles(
                "large_smoke", false,
                target.x, target.y + 0.2, target.z,
                0.1, 0.12, 0.1,
                2, 0.06
            );
            target.discard()
        };

        return false
    }
    const hit_criteria = (center, player, target, range) => (
        target &&
        target != player &&
        target.distanceToEntity(center) <= range &&
        player.hasLineOfSight(target) &&
        attackable(player, target)
    )
    function areaCheck(center, level, player, range, func) {
        const aabb = center.boundingBox.inflate(range, 1, range);
        const entities = level.getEntitiesWithin(aabb)
            .filter(target => hit_criteria(center, player, target, range));

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
    function vortex(center, player, target) {
        const target_pos = target.eyePosition;
        const visible = player.getViewVector(1)
            .dot(target_pos.subtract(player.eyePosition)) > 0;

        if (!visible) return;
        target.setDeltaMovement(
            center.eyePosition.subtract(target_pos)
                .scale(0.3)
                .add(0, 0.2, 0)
        );
        target.hurtMarked = true
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
            potionEffects.add("slowness", cd + 24, 0, false, true)
        }
        else {
            potionEffects.add("slowness", duration, 1, false, true)
        } 
    }
    function lunge(level, player, damage, speed, func1, func2) {
        const { lookAngle } = player, m = lookAngle.scale(speed);
        player.setDeltaMovement(new Vec3(
            m.x(), Math.min(0.2, m.y()), m.z()));
        player.hurtMarked = true;

        let counter = 0;
        player.server.scheduleInTicks(1, c => {
            counter++;
            if (counter > 4) return;

            const target = global.advancedRayTraceEntity(player, 3.5);
            areaCheck(player, level, player, 2, (target) => {
                target.setDeltaMovement(lookAngle.scale(1));
                target.hurtMarked = true;
                func2(target)
            });

            if (attackable(player, target)) {
                attack(player, target, damage);
                func1(target)
            }
            else {
                c.reschedule()
            }
        })
    }

    const swords = {
        "smite": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * 1.5;
            const cd = delay * 1.5;
            const range = 4 * 1;

            const first = global.advancedRayTraceEntity(player, range);
            if (attackable(player, first)) {
                attack(player, first, damage);
                level.spawnParticles(
                    "sweep_attack", true,
                    first.x, first.eyeY - 0.3, first.z,
                    0, 0, 0,
                    1, 0
                )
            }
            else {
                player.server.scheduleInTicks(1, () => {
                    const second = global.advancedRayTraceEntity(player, range);
                    if (attackable(player, second)) {
                        attack(player, second, damage);
                        level.spawnParticles(
                            "sweep_attack", true,
                            second.x, second.eyeY - 0.3, second.z,
                            0, 0, 0,
                            1, 0
                        )
                    }
                    else {
                        const location = global.advancedRayTraceBlock(player, 4)
                            .location.add(player.getViewVector(1).scale(-0.25));
                        level.spawnParticles(
                            "sweep_attack", true,
                            location.x(), location.y(), location.z(),
                            0, 0, 0,
                            1, 0
                        )
                    }
                })
            };

            global.sound(level, player, "fmn:smite", 0.24);

            // player.cooldowns.addCooldown(id, cd)
        },
        "whirlwind": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * 0.8;
            const cd = delay * 1.5;
            const range = 4 * 1.2;

            areaCheck(player, level, player, range, (target) => 
                whirlwind(player, target, damage)
            );

            global.particleRing(level, range * 3, range, player, "sweep_attack", 0, 0.7);
            global.sound(level, player, "fmn:whirlwind", 0.6);

            // player.cooldowns.addCooldown(id, cd)
        },
        "lunge": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * 1;
            const cd = delay * 1;
            const speed = 2;

            lunge(level, player, damage, speed, () => { }, () => { })

            global.sound(level, player, "fmn:lunge", 0.3);

            // player.cooldowns.addCooldown(id, cd)
        },
        "arc": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * 0.5;
            const cd = delay * 1;

            arc(level, player, damage);

            global.sound(level, player, "fmn:arc", 0.3);

            // player.cooldowns.addCooldown(id, cd)
        },
        "vortex": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * 1;
            const cd = delay * 1;
            const range = 3.5;

            const center = global.advancedRayTraceEntity(player, 4);
            if (!center) return;
            areaCheck(center, level, player, range, (target) => {
                vortex(center, player, target)
            })
            
            global.particleRing(level, range * 3, range, center, "poof", -0.1 * range, -0.1);
            global.sound(level, player, "fmn:vortex", 0.3);

            // player.cooldowns.addCooldown(id, cd)
        },
        "inferno": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * 1;
            const cd = delay * 1.2;
            const range = 4 * 2;

            areaCheck(player, level, player, range, (target) => 
                inferno(player, target, cd, damage)
            )

            global.particleRingVertical(level, range * 5, range, player, "lava", 0.2, -0.1);
            global.particleRing(level, range * 2, 0.5, player, "flame", 0.4);
            global.sound(level, player, "fmn:inferno", 0.3);

            // player.cooldowns.addCooldown(id, cd)
        },
        "blizzard": (level, player, id, delay, dmg, lvl) => {
            const duration = dmg * 20 / 2;
            const cd = delay * 1;
            const range = 4 * 3;

            areaCheck(player, level, player, range, (target) => 
                blizzard(target, cd, duration)   
            );

            global.particleRingVertical(level, range * 5, range, player, "snowflake", 0.4, -0.1);
            global.particleRing(level, range * 2, 0.5, player, "cloud", 0.8);
            global.sound(level, player, "fmn:blizzard", 0.3);

            // player.cooldowns.addCooldown(id, cd)
        }
    }

    swords["blizzard"](
        e.level,
        e.player,
        e.player.mainHandItem.id,
        e.player.getCurrentItemAttackStrengthDelay() * 2,
        e.player.getAttribute("minecraft:generic.attack_damage").getValue(), 
        1
    )

})

// ItemEvents.rightClicked(e => {
//     const {player, level} = e;
//     $Enchantments.THORNS.doPostHurt(player, player.rayTrace(4).entity, 2)
// })