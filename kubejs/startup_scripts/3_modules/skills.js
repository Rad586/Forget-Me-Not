global.skill_formulas = {
    "smite": {
        damage: (dmg, lvl) => dmg * (1.5 + (lvl - 1) * 0.5),
        cd: (delay) => delay * 1.75
    },
    "whirlwind": {
        range: (lvl) => 4 + ((lvl - 1) * 1),
        cd: (delay) => delay * 1,
        damage: (dmg) => dmg * 0.75
    },
    "lunge": {
        speed: (lvl) => 1.5 + ((lvl - 1) * 0.5),
        cd: (delay) => delay * 1,
        damage: (dmg) => dmg * 1,
        range: () => 1.5
    },
    "slash": {
        damage: (dmg, lvl) => dmg * (Math.max(0.75, 0.5 + (lvl - 1) * 0.5)),
        cd: (delay) => delay * 0.75,
        speed: (dmg) => 0.5 * dmg - 1
    },
    "vortex": {
        range: (lvl) => 2.5 * (1 + (lvl - 1) * 0.5),
        cd: (delay) => delay * 1
    },
    "parry": {
        damage: (dmg, lvl) => dmg * (1 + (lvl - 1) * 0.75),
        cd: (delay) => delay * 1
    },
    "inferno": {
        range: (lvl) => 6 + ((lvl - 1) * 2),
        damage: (dmg) => dmg * 1
    },
    "blizzard": {
        range: (lvl) => 8 + ((lvl - 1) * 2),
        duration: (dmg) => dmg * 20 / 2
    },
    "sacrifice": {
        cost: (lvl) => 0.2 + ((lvl - 1) * 0.15),
        amp: (lvl) => 2.5 + (3 * lvl * (lvl - 1)) / 4,
        cd: (cd) => cd * 1.25
    },
    "generic_cd": (delay) => delay * 1.25
}

global.s_attack = (player, target, damage) => {
    if (!target) return;
    target.invulnerableTime = 0;
    target.attack(player, damage);
    EnchantmentHelper.doPostDamageEffects(player, target)
}
global.s_attackable = (player, target) => {
    if (target &&
        target.isLiving() &&
        target.isAlive() &&
        target != player &&
        String(target.ownerUUID) != player.uuid &&
        !player.isOnSameTeam(target)
    ) return true;

    if (target instanceof Projectile && !target.inGround) {
        target.discard();

        global.particleBurst(player.level, target, "large_smoke", 2, 0.06, 0.1);
        target.playSound("fmn:destroy_projectile", 0.3, 1)
    };

    return false
}
global.s_hit_criteria = (center, player, target, range) => (
    (target && player) &&
    target != player &&
    target.distanceToEntity(center) <= range &&
    player.hasLineOfSight(target) &&
    s_attackable(player, target)
)
global.s_areaCheck = (center, level, player, range, func) => {
    const aabb = center.boundingBox.inflate(range, 1, range);
    const entities = level.getEntitiesWithin(aabb)
        .filter(target => s_hit_criteria(center, player, target, range));

    if (entities.isEmpty()) return;
    entities.forEach(target => func(target))
}
global.s_findCenter = (level, player) => {
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


global.s_smite = (level, player, damage, cd, func) => {
    function temp(target) {
        s_attack(player, target, damage);
        func(player, target, damage, cd);

        global.particleBurst(level, target, "sweep_attack", 1)
    };

    const first_try = global.advancedRayTraceEntity(player, 4);
    if (s_attackable(player, first_try)) {
        temp(first_try)
    }
    else {
        Utils.server.scheduleInTicks(1, () => {
            temp(s_findCenter(level, player))
        })
    }
}
global.s_whirlwind = (player, target, damage) => {
    s_attack(player, target, damage)
}
global.s_slash = (level, player, damage, cd, speed, type, lvl, override) => {
    const slash = level.createEntity("kubejs:slash");

    slash.setDeltaMovement(override || player.lookAngle.scale(speed));
    slash.copyPosition(player);
    slash.setY(player.eyeY - 0.2);
    slash.setOwner(player);
    slash.setNoGravity(true);

    slash.persistentData.slash = {
        "damage": damage,
        "cd": cd,
        "type": type,
        "lvl": lvl
    };
    slash.spawn()
}
global.s_vortex = (center, player, target, str, override) => {
    str = str || 0.3;
    const target_pos = target.eyePosition;
    const visible = player.getViewVector(1)
        .dot(target_pos.subtract(player.eyePosition)) > 0;

    if (!visible) return;
    target.setDeltaMovement(
        center.eyePosition.subtract(target_pos)
            .scale(str)
            .add(0, override || 0.4, 0)
    );
    target.potionEffects.add("slow_falling", 40, 0, true, false);
    if (!override) player.potionEffects.add("kubejs:invincible", 8, 0, false, false);
    target.hurtMarked = true
}
global.s_lunge = (level, player, damage, speed, range, func1, func2) => {
    const { lookAngle: l } = player, m = l.scale(speed);
    const movement = new Vec3(
        m.x(),
        Math.min(0.45, l.y()) * speed,
        m.z()
    );

    player.setDeltaMovement(movement);
    player.hurtMarked = true;

    let counter = 0, hit = [];
    player.server.scheduleInTicks(1, c => {
        counter++;
        if (counter > 1 + speed * 2) return;

        const target = global.advancedRayTraceEntity(player, 3.5);
        player.potionEffects.add("kubejs:invincible", 8, 0, false, false);

        if (s_attackable(player, target)) {
            if (target && hit.length == 0) {
                s_attack(player, target, damage);
                func1(target);
                hit.push(target.stringUuid)
            }
        };

        s_areaCheck(player, level, player, range, (target) => {
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
global.s_parry1 = (type, player, lvl, cd, range, speed, duration) => {
    player.persistentData.parry = {
        type: type,
        lvl: lvl,
        cd: cd,
        range: range,
        speed: speed,
        duration: duration
    };
    player.potionEffects.add("kubejs:parry", 7, 0, true, true);
}
global.s_inferno = (player, target, damage, cd) => {
    if (!target.isOnFire()) {
        global.setSecondsOnFire(target.level, target, cd / 20 + 1.2)
    }
    else {
        s_attack(player, target, damage);
        target.extinguish()
    }
}
global.s_blizzard = (target, duration, cd) => {
    const { potionEffects } = target;

    if (!target.hasEffect("slowness")) {
        potionEffects.add("slowness", cd + 24, 0, false, true);
        potionEffects.add("slow_falling", 20, 0, false, false)
    }
    else {
        potionEffects.add("slowness", duration, 1, false, true);
        potionEffects.add("slow_falling", 20, 0, false, false)
    }
}
global.s_sacrifice = (player, cost) => {
    player.attack("magic", player.maxHealth * cost)
}

const {
    s_attack, s_attackable, s_hit_criteria,
    s_areaCheck, s_findCenter, s_smite,
    s_whirlwind, s_lunge, s_slash, s_vortex,
    s_parry1, s_inferno, s_blizzard, s_sacrifice
} = global

global.skills = {
    "smite": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage(dmg, lvl);
        const cd = info.cd(delay);

        s_smite(level, player, damage, cd, () => { });

        global.sound(level, player, "fmn:skill/smite", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "whirlwind": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage(dmg);
        const cd = info.cd(delay);
        const range = info.range(lvl);

        s_areaCheck(player, level, player, range, (target) =>
            s_whirlwind(player, target, damage)
        );

        global.particleRing(level, range * 3, range, player, "sweep_attack", 0, 0.7);
        global.sound(level, player, "fmn:skill/whirlwind", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "lunge": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage(dmg);
        const cd = info.cd(delay);
        const speed = info.speed(lvl);
        const range = info.range();

        s_lunge(level, player, damage, speed, range, () => { }, () => { })

        global.particleWind(level, 4, player, "cloud", 0.8, 1);
        global.sound(level, player, "fmn:skill/lunge", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "slash": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage(dmg, lvl);
        const cd = info.cd(delay);
        const speed = info.speed(dmg);

        s_slash(level, player, damage, cd, speed, "nope", lvl);

        global.sound(level, player, "fmn:skill/slash", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "vortex": (level, player, info, delay, dmg, lvl, id) => {
        const cd = info.cd(delay);
        const range = info.range(lvl);

        const center = s_findCenter(level, player);

        s_areaCheck(center, level, player, range, (target) => {
            s_vortex(center, player, target)
        });

        global.particleRing(level, range * 3, range, center, "poof", -0.1 * range, -0.1);
        global.sound(level, player, "fmn:skill/vortex", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "parry": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage(dmg, lvl);
        const cd = info.cd(delay);

        s_parry1("nope", player, lvl, cd, null, null, null);

        player.cooldowns.addCooldown(id, cd)
    },

    "inferno": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage(dmg);
        const cd = skill_formulas["generic_cd"](delay);
        const range = info.range(lvl);

        s_areaCheck(player, level, player, range, (target) =>
            s_inferno(player, target, damage, cd)
        );

        global.particleRingVertical(level, range * 5, range, player, "lava", 0.2, -0.1);
        global.particleRing(level, range * 2, 0.5, player, "flame", 0.4);
        global.sound(level, player, "fmn:skill/inferno", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "blizzard": (level, player, info, delay, dmg, lvl, id) => {
        const duration = info.duration(dmg);
        const cd = skill_formulas["generic_cd"](delay);
        const range = info.range(lvl);

        s_areaCheck(player, level, player, range, (target) =>
            s_blizzard(target, duration, cd)
        );

        global.particleRingVertical(level, range * 5, range, player, "snowflake", 0.4, -0.1);
        global.particleRing(level, range * 2, 0.5, player, "cloud", 0.8);
        global.sound(level, player, "fmn:skill/blizzard", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "sacrifice": (level, player, info, delay, dmg, lvl, id) => {
        const cost = info.cost(lvl);
        const amp = info.amp(lvl);
        const cd = info.cd(delay);

        s_sacrifice(player, cost);
        dmg *= 2 + ((lvl - 1) * 0.5);

        s_smite(level, player, dmg, cd, () => { });
        s_sacrifice(player, cost);

        global.particleBurst(level, player,
            global.itemParticle("minecraft:redstone_block"), 8, 0.1);
        global.sound(level, player, "fmn:skill/sacrifice", 0.6);

        player.cooldowns.addCooldown(id, cd)
    },

    "smite_slash": (level, player, info, delay, dmg, lvl, id) => {
        const damage = (skill_formulas["smite"].damage(dmg, lvl) + info.damage(dmg, lvl)) / 2;
        const cd = info.cd(delay);
        const speed = info.speed(dmg);

        s_slash(level, player, damage, cd, speed, "nope", lvl);

        global.sound(level, player, "fmn:skill/slash", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "whirlwind_slash": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage(dmg, lvl) - 1;
        const cd = info.cd(delay);
        const speed = info.speed(dmg);

        s_slash(level, player, damage, cd, speed, "whirlwind", lvl);

        global.sound(level, player, "fmn:skill/slash", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "vortex_slash": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage(dmg, lvl);
        const cd = info.cd(delay);
        const speed = info.speed(dmg);

        s_slash(level, player, damage, cd, speed, "vortex", lvl);

        global.sound(level, player, "fmn:skill/slash", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "inferno_slash": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage(dmg, lvl);
        const cd = info.cd(delay);
        const speed = info.speed(dmg);

        s_slash(level, player, damage, cd, speed, "inferno", lvl);

        global.sound(level, player, "fmn:skill/slash", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "blizzard_slash": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage(dmg, lvl);
        const cd = info.cd(delay);
        const speed = info.speed(dmg);

        s_slash(level, player, damage, cd, speed, "blizzard", lvl);

        global.sound(level, player, "fmn:skill/slash", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "lunge_slash": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage(dmg, lvl);
        const cd = info.cd(delay);
        const speed = info.speed(dmg) * 1.25;

        s_slash(level, player, damage, cd, speed, "lunge", lvl);

        global.sound(level, player, "fmn:skill/slash", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "smite_whirlwind": (level, player, info, delay, dmg, lvl, id) => {
        const damage = (info.damage(dmg) + skill_formulas["smite"].damage(dmg, lvl)) / 2.25;
        const cd = info.cd(delay);
        const range = info.range(lvl);

        s_areaCheck(player, level, player, range, (target) => {
            s_whirlwind(player, target, damage)
        });

        global.particleRing(level, range * 3, range, player, "sweep_attack", 0, 0.7);
        global.sound(level, player, "fmn:skill/whirlwind", 0.4);

        player.cooldowns.addCooldown(id, cd)
    },
    "inferno_whirlwind": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage(dmg);
        const cd = info.cd(delay);
        const range = info.range(lvl);
        const range2 = skill_formulas["inferno"].range(lvl);

        s_areaCheck(player, level, player, range2, (target) => {
            if (target.distanceToEntity(player) <= range) {
                s_whirlwind(player, target, damage)
            };
            s_inferno(player, target, damage, cd)
        });

        global.particleRing(level, range * 3, range, player, "sweep_attack", 0, 0.7);
        global.particleRingVertical(level, range * 5, range2, player, "lava", 0.2, -0.1);
        global.sound(level, player, "fmn:skill/whirlwind", 0.3);
        global.sound(level, player, "fmn:skill/inferno", 0.1);

        player.cooldowns.addCooldown(id, cd)
    },
    "blizzard_whirlwind": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage(dmg);
        const cd = info.cd(delay);
        const range = info.range(lvl);
        const range2 = skill_formulas["blizzard"].range(lvl);
        const duration = skill_formulas["blizzard"].duration(damage);

        s_areaCheck(player, level, player, range2, (target) => {
            if (target.distanceToEntity(player) <= range) {
                s_whirlwind(player, target, damage)
            };
            s_blizzard(target, duration, cd)
        });

        global.particleRing(level, range * 3, range, player, "sweep_attack", 0, 0.7);
        global.particleRingVertical(level, range * 5, range2, player, "snowflake", 0.4, -0.1);
        global.sound(level, player, "fmn:skill/whirlwind", 0.3);
        global.sound(level, player, "fmn:skill/blizzard", 0.08);

        player.cooldowns.addCooldown(id, cd)
    },
    "vortex_whirlwind": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage(dmg);
        const cd = info.cd(delay);
        const range = info.range(lvl);
        const range2 = skill_formulas["vortex"].range(lvl);

        s_areaCheck(player, level, player, range + range2, (target) => {
            if (target.distanceToEntity(player) <= range) {
                s_whirlwind(player, target, damage)
            }
            else {
                s_vortex(player, player, target, 0.075)
            }
        });

        global.particleRing(level, range * 3, range, player, "sweep_attack", 0, 0.7);
        global.particleRing(level, range * 4, range + range2, player, "poof", -0.1 * range, -0.1);
        global.sound(level, player, "fmn:skill/whirlwind", 0.3);
        global.sound(level, player, "fmn:skill/vortex", 0.1);

        player.cooldowns.addCooldown(id, cd)
    },
    "vortex_smite": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage(dmg, lvl) / 3;
        const cd = info.cd(delay);
        const range = skill_formulas["vortex"].range(lvl);

        const center = s_findCenter(level, player);

        s_areaCheck(center, level, player, range, (target) => {
            s_attack(player, target, damage);
            s_vortex(center, player, target)
        });

        global.particleRing(level, range * 4, range, center, "poof", -0.1 * range, -0.1);
        global.particleBurst(level, center, "sweep_attack", 1);
        global.sound(level, player, "fmn:skill/smite", 0.3);
        global.sound(level, player, "fmn:skill/vortex", 0.1);

        player.cooldowns.addCooldown(id, cd)
    },
    "smite_parry": (level, player, info, delay, dmg, lvl, id) => {
        const cd = info.cd(delay);

        s_parry1("smite", player, lvl, cd, null, null, null);

        player.cooldowns.addCooldown(id, cd)
    },
    "whirlwind_parry": (level, player, info, delay, dmg, lvl, id) => {
        const cd = info.cd(delay);
        const range = skill_formulas["whirlwind"].range(lvl);

        s_parry1("whirlwind", player, lvl, cd, range, null, null);

        player.cooldowns.addCooldown(id, cd)
    },
    "lunge_parry": (level, player, info, delay, dmg, lvl, id) => {
        const cd = info.cd(delay);
        const speed = skill_formulas["lunge"].speed(lvl);
        const range = skill_formulas["lunge"].range();

        s_lunge(level, player, 0.01, speed, range, () => { }, () => { });
        s_parry1("nope", player, lvl, cd, range, speed, null);

        global.particleWind(level, 4, player, "cloud", 0.8, 1);
        global.sound(level, player, "fmn:skill/lunge", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "slash_parry": (level, player, info, delay, dmg, lvl, id) => {
        const cd = info.cd(delay);
        const speed = skill_formulas["slash"].speed(dmg);

        s_parry1("slash", player, lvl, cd, null, speed, null);

        player.cooldowns.addCooldown(id, cd)
    },
    "vortex_parry": (level, player, info, delay, dmg, lvl, id) => {
        const cd = info.cd(delay);
        const range = skill_formulas["vortex"].range(lvl);

        s_parry1("vortex", player, lvl, cd, range, null, null);

        player.cooldowns.addCooldown(id, cd)
    },
    "inferno_parry": (level, player, info, delay, dmg, lvl, id) => {
        const cd = info.cd(delay);
        const range = skill_formulas["inferno"].range(lvl);

        s_parry1("inferno", player, lvl, cd, range, null, null);

        player.cooldowns.addCooldown(id, cd)
    },
    "blizzard_parry": (level, player, info, delay, dmg, lvl, id) => {
        const duration = skill_formulas["blizzard"].duration(dmg);
        const cd = info.cd(delay);
        const range = skill_formulas["blizzard"].range(lvl);

        s_parry1("blizzard", player, lvl, cd, range, null, duration);

        player.cooldowns.addCooldown(id, cd)
    },
    "inferno_smite": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage(dmg, lvl);
        const damage2 = skill_formulas["inferno"].damage(dmg)
        const range = skill_formulas["inferno"].range(lvl);
        const cd = info.cd(delay);

        s_smite(level, player, damage, cd, (player, target, damage, cd) => {
            s_areaCheck(target, level, player, range, (target) => {
                s_inferno(player, target, damage2, cd);
            });

            if (target.block.down.hasTag("minecraft:soul_fire_base_blocks")) {
                global.particleBurst(level, target, "soul_fire_flame", 4, 0.1)
            }
            else {
                global.particleBurst(level, target, "flame", 4, 0.1)
            };
            global.particleBurst(level, target, "sweep_attack", 1);
            global.particleRingVertical(level, range * 5, range, target, "lava", 0.2, -0.1);
        });

        global.sound(level, player, "fmn:skill/smite", 0.3);
        global.sound(level, player, "fmn:skill/inferno", 0.1);

        player.cooldowns.addCooldown(id, cd)
    },
    "blizzard_smite": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage(dmg, lvl);
        const cd = info.cd(delay);
        const range = skill_formulas["blizzard"].range(lvl);
        const duration = skill_formulas["blizzard"].duration(damage);

        s_smite(level, player, damage, cd, (player, target, damage, cd) => {
            s_areaCheck(target, level, player, range, (target) => {
                s_blizzard(target, duration, cd);
            });

            global.particleBurst(level, target, "snowflake", 4, 0.1);
            global.particleBurst(level, target, "sweep_attack", 1);
            global.particleRingVertical(level, range * 5, range, target, "snowflake", 0.4, -0.1)
        })

        global.sound(level, player, "fmn:skill/smite", 0.3);
        global.sound(level, player, "fmn:skill/blizzard", 0.08);

        player.cooldowns.addCooldown(id, cd)
    },
    "blizzard_inferno": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage();
        const cd = skill_formulas["generic_cd"](delay);
        const range = (info.range(lvl) + skill_formulas["blizzard"].range(lvl)) / 2;
        const duration = skill_formulas["blizzard"].duration(damage);

        s_areaCheck(player, level, player, range, (target) => {
            s_inferno(player, target, damage, cd);
            s_blizzard(target, duration, cd)
        })

        global.particleRingVertical(level, range * 5, range, player, "snowflake", 0.2, -0.1);
        global.particleRing(level, range * 2, 0.5, player, "flame", 0.4);
        global.sound(level, player, "fmn:skill/inferno", 0.15);
        global.sound(level, player, "fmn:skill/blizzard", 0.12);

        player.cooldowns.addCooldown(id, cd)
    },
    "smite_lunge": (level, player, info, delay, dmg, lvl, id) => {
        const damage = (info.damage(dmg) + skill_formulas["smite"].damage(dmg, lvl)) / 2;
        const cd = info.cd(delay);
        const speed = info.speed(lvl);
        const range = info.range();

        s_lunge(level, player, damage, speed, range, () => { }, () => { });

        global.particleWind(level, 4, player, "cloud", 0.8, 1);
        global.sound(level, player, "fmn:skill/lunge", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "whirlwind_lunge": (level, player, info, delay, dmg, lvl, id) => {
        const damage = (info.damage(dmg) + skill_formulas["whirlwind"].damage(dmg)) / 2;
        const cd = info.cd(delay);
        const speed = info.speed(lvl);
        const range = (info.range() + skill_formulas["whirlwind"].range(lvl)) / 4;

        s_lunge(level, player, damage, speed, range, () => { }, (target) => {
            s_whirlwind(player, target, damage);
        });

        global.particleBurst(level, player, "sweep_attack", 1, 0.2, 0, 0.2);
        global.sound(level, player, "fmn:skill/lunge", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "vortex_lunge": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage(dmg);
        const cd = info.cd(delay);
        const speed = info.speed(lvl);
        const range = info.range();
        const range2 = skill_formulas["vortex"].range(lvl);

        s_lunge(level, player, damage, speed, range, (target) => {
            s_areaCheck(target, level, player, range2, (target2) => {
                s_vortex(target, player, target2)
            });

            global.particleRing(level, range * 3, range, target, "poof", -0.1 * range, -0.1)
        }, () => { })

        global.particleWind(level, 4, player, "cloud", 0.2, 0.5);
        global.sound(level, player, "fmn:skill/lunge", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "inferno_lunge": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage(dmg);
        const damage2 = skill_formulas["inferno"].damage(dmg);
        const cd = info.cd(delay);
        const speed = info.speed(lvl);
        const range = (info.range() + skill_formulas["inferno"].range(lvl)) / 4;

        s_lunge(level, player, damage, speed, range, () => { }, (target) => {
            s_inferno(player, target, damage2, cd)
        })

        global.particleWind(level, 4, player, "flame", 0.5, 1);
        global.sound(level, player, "fmn:skill/lunge", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "blizzard_lunge": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage(dmg);
        const cd = info.cd(delay);
        const speed = info.speed(lvl);
        const range = (info.range() + skill_formulas["blizzard"].range(lvl)) / 4;
        const duration = skill_formulas["blizzard"].duration(damage);

        s_lunge(level, player, damage, speed, range, () => { }, (target) => {
            s_blizzard(target, duration, cd)
        })

        global.particleWind(level, 6, player, "snowflake", 0.5, 1);
        global.sound(level, player, "fmn:skill/lunge", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "inferno_vortex": (level, player, info, delay, dmg, lvl, id) => {
        const cd = info.cd(delay);
        const range = (info.range(lvl) + skill_formulas["inferno"].range(lvl)) / 3;
        const damage = skill_formulas["inferno"].damage(dmg);

        const center = s_findCenter(level, player);

        s_areaCheck(center, level, player, range, (target) => {
            s_vortex(center, player, target);
            s_inferno(player, target, damage, cd)
        })

        global.particleRing(level, range * 3, range, center, "flame", -0.1 * range);
        global.sound(level, player, "fmn:skill/vortex", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "blizzard_vortex": (level, player, info, delay, dmg, lvl, id) => {
        const cd = info.cd(delay);
        const range = (info.range(lvl) + skill_formulas["blizzard"].range(lvl)) / 3;
        const duration = skill_formulas["blizzard"].duration(dmg);

        const center = s_findCenter(level, player);

        s_areaCheck(center, level, player, range, (target) => {
            s_vortex(center, player, target);
            s_blizzard(target, duration, cd)
        })

        global.particleRing(level, range * 3, range, center, "snowflake", -0.1 * range, 0.3);
        global.sound(level, player, "fmn:skill/vortex", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "sacrifice_smite": (level, player, info, delay, dmg, lvl, id) => {
        const cost = skill_formulas["sacrifice"].cost(lvl);
        const cd = skill_formulas["sacrifice"].cd(info.cd(delay));
        lvl = skill_formulas["sacrifice"].amp(lvl);
        s_sacrifice(player, cost);

        const damage = info.damage(dmg, lvl);

        s_smite(level, player, damage, cd, () => { });

        global.particleBurst(level, player,
            global.itemParticle("minecraft:redstone_block"), 8, 0.1);
        global.sound(level, player, "fmn:skill/smite", 0.3);
        global.sound(level, player, "fmn:skill/sacrifice", 0.6);

        player.cooldowns.addCooldown(id, cd)
    },
    "sacrifice_whirlwind": (level, player, info, delay, dmg, lvl, id) => {
        const cost = skill_formulas["sacrifice"].cost(lvl);
        const cd = skill_formulas["sacrifice"].cd(info.cd(delay));
        lvl = skill_formulas["sacrifice"].amp(lvl);
        s_sacrifice(player, cost);

        const damage = skill_formulas["whirlwind"].damage(dmg);
        const range = skill_formulas["whirlwind"].range(lvl);

        s_areaCheck(player, level, player, range, (target) =>
            s_whirlwind(player, target, damage)
        );

        global.particleRing(level, range * 3, range, player, "sweep_attack", 0, 0.7);
        global.particleBurst(level, player,
            global.itemParticle("minecraft:redstone_block"), 8, 0.1);
        global.sound(level, player, "fmn:skill/whirlwind", 0.3);
        global.sound(level, player, "fmn:skill/sacrifice", 0.6);

        player.cooldowns.addCooldown(id, cd)
    },

    "sacrifice_lunge": (level, player, info, delay, dmg, lvl, id) => {
        const cost = skill_formulas["sacrifice"].cost(lvl);
        const cd = skill_formulas["sacrifice"].cd(info.cd(delay));
        lvl = skill_formulas["sacrifice"].amp(lvl) + 2;
        s_sacrifice(player, cost);

        const damage = info.damage(dmg);
        const speed = info.speed(lvl);
        const range = info.range();

        s_lunge(level, player, damage, speed, range, () => { }, () => { });

        global.particleWind(level, 4, player, "cloud", 0.8, 1);
        global.particleBurst(level, player,
            global.itemParticle("minecraft:redstone_block"), 8, 0.1);
        global.sound(level, player, "fmn:skill/lunge", 0.3);
        global.sound(level, player, "fmn:skill/sacrifice", 0.6);

        player.cooldowns.addCooldown(id, cd)
    },
    "sacrifice_slash": (level, player, info, delay, dmg, lvl, id) => {
        const cost = skill_formulas["sacrifice"].cost(lvl);
        const cd = skill_formulas["sacrifice"].cd(info.cd(delay));
        lvl = skill_formulas["sacrifice"].amp(lvl);
        s_sacrifice(player, cost);

        const damage = info.damage(dmg, lvl);
        const speed = info.speed(dmg);

        s_slash(level, player, damage, cd, speed, "parry", lvl);

        global.particleBurst(level, player,
            global.itemParticle("minecraft:redstone_block"), 8, 0.1);
        global.sound(level, player, "fmn:skill/slash", 0.3);
        global.sound(level, player, "fmn:skill/sacrifice", 0.6);

        player.cooldowns.addCooldown(id, cd)
    },
    "sacrifice_vortex": (level, player, info, delay, dmg, lvl, id) => {
        const cost = skill_formulas["sacrifice"].cost(lvl);
        const cd = 150;
        lvl = skill_formulas["sacrifice"].amp(lvl);
        s_sacrifice(player, cost);

        const range = info.range(lvl);

        const center = s_findCenter(level, player);
        let counter = 0;
        Utils.server.scheduleInTicks(1, c => {
            if (counter > cd + 100) return;
            counter += 7;

            s_areaCheck(center, level, player, range, (target) => {
                s_vortex(center, player, target, null, 0.01)
            });

            if(!(counter % 42)) {
                global.particleRing(level, range * 3, range, center, "poof", -0.1 * range, -0.1);
                global.sound(level, center, "fmn:skill/vortex", 0.2);
            };

            c.reschedule(7)
        });

        global.particleBurst(level, player,
            global.itemParticle("minecraft:redstone_block"), 8, 0.1);
        global.sound(level, player, "fmn:skill/sacrifice", 0.6);

        player.cooldowns.addCooldown(id, cd)
    },
    "sacrifice_parry": (level, player, info, delay, dmg, lvl, id) => {
        const cost = skill_formulas["sacrifice"].cost(lvl);
        const cd = skill_formulas["sacrifice"].cd(info.cd(delay));
        lvl = skill_formulas["sacrifice"].amp(lvl);
        s_sacrifice(player, cost);

        s_parry1("nope", player, lvl, cd, null, null, null);

        global.particleBurst(level, player,
            global.itemParticle("minecraft:redstone_block"), 8, 0.1);
        global.sound(level, player, "fmn:skill/sacrifice", 0.6);

        player.cooldowns.addCooldown(id, cd)
    },
    "sacrifice_inferno": (level, player, info, delay, dmg, lvl, id) => {
        const cost = skill_formulas["sacrifice"].cost(lvl);
        const cd = skill_formulas["sacrifice"].cd(skill_formulas["generic_cd"](delay));
        lvl = skill_formulas["sacrifice"].amp(lvl);
        s_sacrifice(player, cost);

        const damage = info.damage(dmg);
        const range = info.range(lvl);

        s_areaCheck(player, level, player, range, (target) => {
            s_inferno(player, target, damage, cd)
        });

        global.particleRingVertical(level, range * 5, range, player, "lava", 0.2, -0.1);
        global.particleRing(level, range * 2, 0.5, player, "flame", 0.4);
        global.particleBurst(level, player,
            global.itemParticle("minecraft:redstone_block"), 8, 0.1);
        global.sound(level, player, "fmn:skill/inferno", 0.3);
        global.sound(level, player, "fmn:skill/sacrifice", 0.6);

        player.cooldowns.addCooldown(id, cd)
    },
    "sacrifice_blizzard": (level, player, info, delay, dmg, lvl, id) => {
        const cost = skill_formulas["sacrifice"].cost(lvl);
        const cd = skill_formulas["sacrifice"].cd(skill_formulas["generic_cd"](delay));
        lvl = skill_formulas["sacrifice"].amp(lvl);
        s_sacrifice(player, cost);

        const duration = info.duration(dmg);
        const range = info.range(lvl);

        s_areaCheck(player, level, player, range, (target) => {
            s_blizzard(target, duration, cd)
        });

        global.particleRingVertical(level, range * 5, range, player, "snowflake", 0.4, -0.1);
        global.particleRing(level, range * 2, 0.5, player, "cloud", 0.8);
        global.particleBurst(level, player,
            global.itemParticle("minecraft:redstone_block"), 8, 0.1);
        global.sound(level, player, "fmn:skill/blizzard", 0.3);
        global.sound(level, player, "fmn:skill/sacrifice", 0.6);

        player.cooldowns.addCooldown(id, cd)
    }
}

const { skill_formulas, skills } = global