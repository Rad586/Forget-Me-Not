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
    function findCenter(level, player) {
        let center = global.advancedRayTraceEntity(player, 4);
        if (!center) {
            let dummy = level.createEntity("kubejs:dummy");
            let dist = Math.min(5, 4 + Math.abs(player.pitch) * 0.1);
            let l = global.advancedRayTraceBlock(player, dist)
                .location.add(player.getViewVector(1).scale(-0.25));

            dummy.setPosition(l.x(), l.y(), l.z());
            dummy.spawn();

            center = dummy
        };
        return center
    }


    function smite(level, player, damage, cd, func) {
        function temp(target) {
            attack(player, target, damage);
            func(player, target, damage, cd);

            level.spawnParticles(
                "sweep_attack", true,
                target.x, target.eyeY - 0.3, target.z,
                0, 0, 0,
                1, 0
            )
        };

        const first_try = global.advancedRayTraceEntity(player, 4);
        if (attackable(player, first_try)) {
            temp(first_try)
        }
        else {
            player.server.scheduleInTicks(1, () => {
                temp(findCenter(level, player))
            })
        }
    }
    function whirlwind(player, target, damage) {
        attack(player, target, damage)
    }
    function arc(level, player, damage, cd, speed, type) {
        const arc = level.createEntity("kubejs:arc");

        arc.setDeltaMovement(player.lookAngle.scale(speed));
        arc.copyPosition(player);
        arc.setY(player.eyeY);
        arc.setOwner(player);
        arc.setNoGravity(true);
        arc.persistentData.damage = damage;
        arc.persistentData.cd = cd;
        arc.persistentData.type = type;
        arc.spawn();
    }
    function vortex(center, player, target, str) {
        str = str || 0.3;
        const target_pos = target.eyePosition;
        const visible = player.getViewVector(1)
            .dot(target_pos.subtract(player.eyePosition)) > 0;

        if (!visible) return;
        target.setDeltaMovement(
            center.eyePosition.subtract(target_pos)
                .scale(str)
                .add(0, 0.2, 0)
        );
        target.hurtMarked = true
    }
    function inferno(player, target, damage, cd) {
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
    function blizzard(target, duration, cd) {
        const { potionEffects } = target;

        if (!target.hasEffect("slowness")) {
            potionEffects.add("slowness", cd + 24, 0, false, true);
            potionEffects.add("slow_falling", 8, 0, false, false)
        }
        else {
            potionEffects.add("slowness", duration, 1, false, true);
            potionEffects.add("slow_falling", 20, 0, false, false)
        } 
    }
    function lunge(level, player, damage, speed, range, func1, func2) {
        const { lookAngle } = player, m = lookAngle.scale(speed);
        const movement = new Vec3(m.x(), Math.min(0.2, m.y()), m.z());

        player.setDeltaMovement(movement);
        player.hurtMarked = true;

        let counter = 0, hit = [];
        player.server.scheduleInTicks(1, c => {
            counter++;
            if (counter > 1 + speed * 2) return;

            const target = global.advancedRayTraceEntity(player, 3.5);
            player.potionEffects.add("kubejs:invincible", 8, 0, false, false);

            if (attackable(player, target)) {
                if (target && !hit.includes(target.stringUuid)) {
                    attack(player, target, damage);
                    func1(target);
                    hit.push(target.stringUuid)
                }
            };

            areaCheck(player, level, player, range, (target) => {
                if (target && !hit.includes(target.stringUuid)) {
                    target.setDeltaMovement(movement);
                    target.hurtMarked = true;
                    func2(target);
                    hit.push(target.stringUuid);
                }
            });

            c.reschedule()
        })
    }

    const swords = {
        "smite": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * (1.5 + (lvl - 1) * 0.25);
            const cd = delay * 1.5;

            smite(level, player, damage, cd, () => { });

            global.sound(level, player, "fmn:smite", 0.24);

            // player.cooldowns.addCooldown(id, cd)
        },
        "whirlwind": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * 0.8;
            const cd = delay * 1.5;
            const range = 4 * (1 + (lvl - 1) * 0.25);

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
            const speed = 1.5 + ((lvl - 1) * 0.5);
            const range = 1.5;

            lunge(level, player, damage, speed, range, () => { }, () => { })

            global.particleBurst(level, player, "cloud", 4, 0.2, 0, 0.2);
            global.sound(level, player, "fmn:lunge", 0.3);

            // player.cooldowns.addCooldown(id, cd)
        },
        "arc": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * 0.5;
            const cd = delay * 1;
            const speed = 1 + ((lvl - 1) * 1);

            arc(level, player, damage, cd, speed, "nope");

            global.sound(level, player, "fmn:arc", 0.3);

            // player.cooldowns.addCooldown(id, cd)
        },
        "vortex": (level, player, id, delay, dmg, lvl) => {
            const cd = delay * 1;
            const range = 3.5 + ((lvl - 1) * 0.75);

            const center = findCenter(level, player);

            areaCheck(center, level, player, range, (target) => {
                vortex(center, player, target)
            })
            
            global.particleRing(level, range * 3, range, center, "poof", -0.1 * range, -0.1);
            global.sound(level, player, "fmn:vortex", 0.3);

            // player.cooldowns.addCooldown(id, cd)
        },
        "inferno": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * 1;
            const cd = delay * 1.25;
            const range = 4 * (2 + (lvl - 1) * 0.25);

            areaCheck(player, level, player, range, (target) => 
                inferno(player, target, damage, cd)
            )

            global.particleRingVertical(level, range * 5, range, player, "lava", 0.2, -0.1);
            global.particleRing(level, range * 2, 0.5, player, "flame", 0.4);
            global.sound(level, player, "fmn:inferno", 0.3);

            // player.cooldowns.addCooldown(id, cd)
        },
        "blizzard": (level, player, id, delay, dmg, lvl) => {
            const duration = dmg * 20 / 2;
            const cd = delay * 1.25;
            const range = 4 * (3 + (lvl - 1) * 0.5);

            areaCheck(player, level, player, range, (target) => 
                blizzard(target, duration, cd)
            );

            global.particleRingVertical(level, range * 5, range, player, "snowflake", 0.4, -0.1);
            global.particleRing(level, range * 2, 0.5, player, "cloud", 0.8);
            global.sound(level, player, "fmn:blizzard", 0.3);

            // player.cooldowns.addCooldown(id, cd)
        },

        "smite_arc": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * 1;
            const cd = delay * 1;
            const speed = 1 + ((lvl - 1) * 1);

            arc(level, player, damage, cd, speed, "nope");

            global.sound(level, player, "fmn:arc", 0.3);

            // player.cooldowns.addCooldown(id, cd)
        },
        "whirlwind_arc": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * 0.3;
            const cd = delay * 1;
            const speed = 1 + ((lvl - 1) * 1);

            arc(level, player, damage, cd, speed, "whirlwind");

            global.sound(level, player, "fmn:arc", 0.3);

            // player.cooldowns.addCooldown(id, cd)
        },
        "vortex_arc": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * 0.5;
            const cd = delay * 1;
            const speed = 1 + ((lvl - 1) * 1);

            arc(level, player, damage, cd, speed, "vortex");

            global.sound(level, player, "fmn:arc", 0.3);

            // player.cooldowns.addCooldown(id, cd)
        },
        "inferno_arc": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * 0.5;
            const cd = delay * 1;
            const speed = 1 + ((lvl - 1) * 1);

            arc(level, player, damage, cd, speed, "inferno");

            global.sound(level, player, "fmn:arc", 0.3);

            // player.cooldowns.addCooldown(id, cd)
        },
        "blizzard_arc": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * 0.5;
            const cd = delay * 1;
            const speed = 1 + ((lvl - 1) * 1);

            arc(level, player, damage, cd, speed, "blizzard");

            global.sound(level, player, "fmn:arc", 0.3);

            // player.cooldowns.addCooldown(id, cd)
        },
        "lunge_arc": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * 0.5;
            const cd = delay * 1;
            const speed = 1 + ((lvl - 1) * 1);

            arc(level, player, damage, cd, speed, "lunge");

            global.sound(level, player, "fmn:arc", 0.3);

            // player.cooldowns.addCooldown(id, cd)
        },
        "smite_whirlwind": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * 1.5;
            const cd = delay * 1.5;
            const range = 4 * (1 + (lvl - 1) * 0.25);

            areaCheck(player, level, player, range, (target) => {
                whirlwind(player, target, damage)
            });

            global.particleRing(level, range * 3, range, player, "sweep_attack", 0, 0.7);
            global.sound(level, player, "fmn:whirlwind", 0.6);

            // player.cooldowns.addCooldown(id, cd)
        },
        "inferno_whirlwind": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * 0.8;
            const cd = delay * 1.5;
            const range = 4 * (1 + (lvl - 1) * 0.25);

            areaCheck(player, level, player, range, (target) => {
                whirlwind(player, target, damage);
                inferno(player, target, damage, cd)
            });

            global.particleRing(level, range * 3, range, player, "sweep_attack", 0, 0.7);
            global.sound(level, player, "fmn:whirlwind", 0.6);

            // player.cooldowns.addCooldown(id, cd)
        },
        "blizzard_whirlwind": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * 0.8;
            const cd = delay * 1.5;
            const range = 4 * (1 + (lvl - 1) * 0.25);
            const duration = damage * 20 / 2

            areaCheck(player, level, player, range, (target) => {
                whirlwind(player, target, damage);
                blizzard(target, duration, cd)
            });

            global.particleRing(level, range * 3, range, player, "sweep_attack", 0, 0.7);
            global.sound(level, player, "fmn:whirlwind", 0.6);

            // player.cooldowns.addCooldown(id, cd)
        },
        "vortex_whirlwind": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * 0.8;
            const cd = delay * 1.5;
            const range = 4 * (1 + (lvl - 1) * 0.25);

            areaCheck(player, level, player, range * 1.5, (target) => {
                if (target.distanceToEntity(player) <= range) {
                    whirlwind(player, target, damage)
                }
                else {
                    vortex(player, player, target, 0.075)
                }
            });

            global.particleRing(level, range * 3, range, player, "sweep_attack", 0, 0.7);
            global.sound(level, player, "fmn:whirlwind", 0.6);

            // player.cooldowns.addCooldown(id, cd)
        },
        "vortex_smite": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * (1 + (lvl - 1) * 0.25);
            const cd = delay * 1.5;
            const range = 3 * 1;

            const center = findCenter(level, player);

            areaCheck(center, level, player, range, (target) => {
                attack(player, target, damage);
                vortex(center, player, target)
            });

            level.spawnParticles(
                "sweep_attack", true,
                center.x, center.eyeY - 0.3, center.z,
                0, 0, 0,
                1, 0
            )
            // player.cooldowns.addCooldown(id, cd)
        },
        "inferno_smite": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * (1 + (lvl - 1) * 0.25);
            const cd = delay * 1.5;

            smite(level, player, damage, cd, (player, target, damage, cd) => { 
                inferno(player, target, damage, cd)
            })

            global.sound(level, player, "fmn:smite", 0.24);

            // player.cooldowns.addCooldown(id, cd)
        },
        "blizzard_smite": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * (1.5 + (lvl - 1) * 0.25);
            const cd = delay * 1.5;
            const duration = damage * 20 / 2

            smite(level, player, damage, cd, (player, target, damage, cd) => {
                blizzard(target, duration, cd)
            })

            global.sound(level, player, "fmn:smite", 0.24);

            // player.cooldowns.addCooldown(id, cd)
        },
        "blizzard_inferno": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * 1;
            const cd = delay * 1.25;
            const range = 4 * (2 + (lvl - 1) * 0.25);
            const duration = damage * 20 / 2

            areaCheck(player, level, player, range, (target) => {
                inferno(player, target, damage, cd);
                blizzard(target, duration, cd)
            })

            global.particleRingVertical(level, range * 5, range, player, "lava", 0.2, -0.1);
            global.particleRing(level, range * 2, 0.5, player, "flame", 0.4);
            global.sound(level, player, "fmn:inferno", 0.3);

            // player.cooldowns.addCooldown(id, cd)
        },
        "smite_lunge": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * (1 + 0.25);
            const cd = delay * 1;
            const speed = 1.5 + ((lvl - 1) * 0.5);
            const range = 2.5;

            lunge(level, player, damage, speed, range, () => { }, () => { })

            global.particleBurst(level, player, "cloud", 4, 0.5, 0, 0.2);
            global.sound(level, player, "fmn:lunge", 0.3);

            // player.cooldowns.addCooldown(id, cd)
        },
        "whirlwind_lunge": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * 0.5;
            const cd = delay * 1;
            const speed = 1.5 + ((lvl - 1) * 0.5);
            const range = 2.5;

            lunge(level, player, damage, speed, range, () => { }, (target) => {
                whirlwind(player, target, damage);
            })

            global.particleBurst(level, player, "sweep_attack", 1, 0.2, 0, 0.2);
            global.sound(level, player, "fmn:lunge", 0.3);

            // player.cooldowns.addCooldown(id, cd)
        },
        "vortex_lunge": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * 1;
            const cd = delay * 1;
            const speed = 1.5 + ((lvl - 1) * 0.5);
            const range = 2.5;

            lunge(level, player, damage, speed, range, (target) => { 
                areaCheck(target, level, player, 3.5, (target2) => {
                    vortex(target, player, target2)
                })
            }, () => { })

            global.particleBurst(level, player, "poof", 3, 0.2, 0, 0.2);
            global.sound(level, player, "fmn:lunge", 0.3);

            // player.cooldowns.addCooldown(id, cd)
        },
        "inferno_lunge": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * 1;
            const cd = delay * 1;
            const speed = 1.5 + ((lvl - 1) * 0.5);
            const range = 2.5;

            lunge(level, player, damage, speed, range, () => { }, (target) => {
                inferno(player, target, damage, cd)
            })

            global.particleBurst(level, player, "flame", 6, 0.15, 0, 0.2);
            global.sound(level, player, "fmn:lunge", 0.3);

            // player.cooldowns.addCooldown(id, cd)
        },
        "blizzard_lunge": (level, player, id, delay, dmg, lvl) => {
            const damage = dmg * 1;
            const cd = delay * 1;
            const speed = 1.5 + ((lvl - 1) * 0.5);
            const range = 3.5;
            const duration = damage * 20 / 2

            lunge(level, player, damage, speed, range, () => { }, (target) => {
                blizzard(target, duration, cd)
            })

            global.particleBurst(level, player, "snowflake", 6, 0.1, 0, 0.2);
            global.sound(level, player, "fmn:lunge", 0.3);

            // player.cooldowns.addCooldown(id, cd)
        },
        "inferno_vortex": (level, player, id, delay, dmg, lvl) => {
            const cd = delay * 1;
            const range = 4 + ((lvl - 1) * 0.75);
            const damage = dmg * 1;

            const center = findCenter(level, player);

            areaCheck(center, level, player, range, (target) => {
                vortex(center, player, target);
                inferno(player, target, damage, cd)
            })

            global.particleRing(level, range * 3, range, center, "poof", -0.1 * range, -0.1);
            global.sound(level, player, "fmn:vortex", 0.3);

            // player.cooldowns.addCooldown(id, cd)
        },
        "blizzard_vortex": (level, player, id, delay, dmg, lvl) => {
            const cd = delay * 1;
            const range = 4 + ((lvl - 1) * 0.75);
            const duration = dmg * 20 / 2

            const center = findCenter(level, player);

            areaCheck(center, level, player, range, (target) => {
                vortex(center, player, target);
                blizzard(target, duration, cd)
            })

            global.particleRing(level, range * 3, range, center, "poof", -0.1 * range, -0.1);
            global.sound(level, player, "fmn:vortex", 0.3);

            // player.cooldowns.addCooldown(id, cd)
        }

    }

    swords["vortex"](
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

//战利品：对于所有武器，替换为原ID的附魔主动技能后物品
//合成：如果有合成选项就合并，else升级（最高3，不然告诉玩家不能）
//做了lunge的特效，还差各种音效和此外的特效