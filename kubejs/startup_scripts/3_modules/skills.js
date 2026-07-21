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
    "gernic_cd": (delay) => delay * 1.25
}
const { skill_formulas } = global

function attack(player, target, damage) {
    if (!target) return;
    target.invulnerableTime = 0;
    target.attack(player, damage)
}
function attackable(player, target) {
    if (target &&
        target.isLiving() &&
        target.isAlive() &&
        target != player &&
        target.owner != player &&
        !player.isOnSameTeam(target)
    ) return true;

    if (target instanceof Projectile && !target.inGround) {
        target.discard();

        global.particleBurst(level, target, "large_smoke", 2, 0.06, 0.1);
        target.playSound("fmn:destroy_projectile", 0.3, 1)
    };

    return false
}
const hit_criteria = (center, player, target, range) => (
    (target && player) &&
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

        global.particleBurst(level, target, "sweep_attack", 1)
    };

    const first_try = global.advancedRayTraceEntity(player, 4);
    if (attackable(player, first_try)) {
        temp(first_try)
    }
    else {
        Utils.server.scheduleInTicks(1, () => {
            temp(findCenter(level, player))
        })
    }
}
function whirlwind(player, target, damage) {
    attack(player, target, damage)
}
function slash(level, player, damage, cd, speed, type, lvl, override) {
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
function vortex(center, player, target, str, override) {
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
function lunge(level, player, damage, speed, range, func1, func2) {
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

        if (attackable(player, target)) {
            if (target && hit.length == 0) {
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
function parry1(type, player, lvl, cd, range, speed, duration) {
    player.persistentData.parry = {
        type: type,
        lvl: lvl,
        cd: cd,
        range: range,
        speed: speed,
        duration: duration
    };
    player.potionEffects.add("kubejs:parry", 40/* 7 */, 0, false, true);
}
function parry2(player, target, lvl, damage) {
    attack(player, target, damage)
    player.heal(lvl * 2)
}
function inferno(player, target, damage, cd) {
    if (!target.isOnFire()) {
        global.setSecondsOnFire(target.level, target, cd / 20 + 1.2)
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
        potionEffects.add("slow_falling", 20, 0, false, false)
    }
    else {
        potionEffects.add("slowness", duration, 1, false, true);
        potionEffects.add("slow_falling", 20, 0, false, false)
    }
}
function sacrifice(player, cost) {
    player.attack("magic", player.maxHealth * cost)
}

global.skills = {
    "smite": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage(dmg, lvl);
        const cd = info.cd(delay);

        smite(level, player, damage, cd, () => { });

        global.sound(level, player, "fmn:skill/smite", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "whirlwind": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage(dmg);
        const cd = info.cd(delay);
        const range = info.range(lvl);

        areaCheck(player, level, player, range, (target) =>
            whirlwind(player, target, damage)
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

        lunge(level, player, damage, speed, range, () => { }, () => { })

        global.particleWind(level, 4, player, "cloud", 0.8, 1);
        global.sound(level, player, "fmn:skill/lunge", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "slash": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage(dmg, lvl);
        const cd = info.cd(delay);
        const speed = info.speed(dmg);

        slash(level, player, damage, cd, speed, "nope", lvl);

        global.sound(level, player, "fmn:skill/slash", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "vortex": (level, player, info, delay, dmg, lvl, id) => {
        const cd = info.cd(delay);
        const range = info.range(lvl);

        const center = findCenter(level, player);

        areaCheck(center, level, player, range, (target) => {
            vortex(center, player, target)
        });

        global.particleRing(level, range * 3, range, center, "poof", -0.1 * range, -0.1);
        global.sound(level, player, "fmn:skill/vortex", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "inferno": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage(dmg);
        const cd = skill_formulas["gernic_cd"](delay);
        const range = info.range(lvl);

        areaCheck(player, level, player, range, (target) =>
            inferno(player, target, damage, cd)
        );

        global.particleRingVertical(level, range * 5, range, player, "lava", 0.2, -0.1);
        global.particleRing(level, range * 2, 0.5, player, "flame", 0.4);
        global.sound(level, player, "fmn:skill/inferno", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "blizzard": (level, player, info, delay, dmg, lvl, id) => {
        const duration = info.duration(dmg);
        const cd = skill_formulas["gernic_cd"](delay);
        const range = info.range(lvl);

        areaCheck(player, level, player, range, (target) =>
            blizzard(target, duration, cd)
        );

        global.particleRingVertical(level, range * 5, range, player, "snowflake", 0.4, -0.1);
        global.particleRing(level, range * 2, 0.5, player, "cloud", 0.8);
        global.sound(level, player, "fmn:skill/blizzard", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },

    "smite_slash": (level, player, info, delay, dmg, lvl, id) => {
        const damage = (skill_formulas["smite"].damage(dmg, lvl) + info.damage(dmg, lvl)) / 2;
        const cd = info.cd(delay);
        const speed = info.speed(dmg);

        slash(level, player, damage, cd, speed, "nope", lvl);

        global.sound(level, player, "fmn:skill/slash", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "whirlwind_slash": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage(dmg, lvl) - 1;
        const cd = info.cd(delay);
        const speed = info.speed(dmg);

        slash(level, player, damage, cd, speed, "whirlwind", lvl);

        global.sound(level, player, "fmn:skill/slash", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "vortex_slash": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage(dmg, lvl);
        const cd = info.cd(delay);
        const speed = info.speed(dmg);

        slash(level, player, damage, cd, speed, "vortex", lvl);

        global.sound(level, player, "fmn:skill/slash", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "inferno_slash": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage(dmg, lvl);
        const cd = info.cd(delay);
        const speed = info.speed(dmg);

        slash(level, player, damage, cd, speed, "inferno", lvl);

        global.sound(level, player, "fmn:skill/slash", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "blizzard_slash": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage(dmg, lvl);
        const cd = info.cd(delay);
        const speed = info.speed(dmg);

        slash(level, player, damage, cd, speed, "blizzard", lvl);

        global.sound(level, player, "fmn:skill/slash", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "lunge_slash": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage(dmg, lvl);
        const cd = info.cd(delay);
        const speed = info.speed(dmg) * 1.25;

        slash(level, player, damage, cd, speed, "lunge", lvl);

        global.sound(level, player, "fmn:skill/slash", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "smite_whirlwind": (level, player, info, delay, dmg, lvl, id) => {
        const damage = (info.damage(dmg) + skill_formulas["smite"].damage(dmg, lvl)) / 2.25;
        const cd = info.cd(delay);
        const range = info.range(lvl);

        areaCheck(player, level, player, range, (target) => {
            whirlwind(player, target, damage)
        });

        global.particleRing(level, range * 3, range, player, "sweep_attack", 0, 0.7);
        global.sound(level, player, "fmn:skill/whirlwind", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "inferno_whirlwind": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage(dmg);
        const cd = info.cd(delay);
        const range = info.range(lvl);
        const range2 = skill_formulas["inferno"].range(lvl);

        areaCheck(player, level, player, range2, (target) => {
            if (target.distanceToEntity(player) <= range) {
                whirlwind(player, target, damage)
            };
            inferno(player, target, damage, cd)
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

        areaCheck(player, level, player, range2, (target) => {
            if (target.distanceToEntity(player) <= range) {
                whirlwind(player, target, damage)
            };
            blizzard(target, duration, cd)
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

        areaCheck(player, level, player, range + range2, (target) => {
            if (target.distanceToEntity(player) <= range) {
                whirlwind(player, target, damage)
            }
            else {
                vortex(player, player, target, 0.075)
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

        const center = findCenter(level, player);

        areaCheck(center, level, player, range, (target) => {
            attack(player, target, damage);
            vortex(center, player, target)
        });

        global.particleRing(level, range * 4, range, center, "poof", -0.1 * range, -0.1);
        global.particleBurst(level, center, "sweep_attack", 1);
        global.sound(level, player, "fmn:skill/smite", 0.3);
        global.sound(level, player, "fmn:skill/vortex", 0.1);

        player.cooldowns.addCooldown(id, cd)
    },
    "inferno_smite": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage(dmg, lvl);
        const damage2 = skill_formulas["inferno"].damage(dmg)
        const range = skill_formulas["inferno"].range(lvl);
        const cd = info.cd(delay);

        smite(level, player, damage, cd, (player, target, damage, cd) => {
            areaCheck(target, level, player, range, (target) => {
                inferno(player, target, damage2, cd);
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

        smite(level, player, damage, cd, (player, target, damage, cd) => {
            areaCheck(target, level, player, range, (target) => {
                blizzard(target, duration, cd);
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
        const cd = skill_formulas["gernic_cd"](delay);
        const range = (info.range(lvl) + skill_formulas["blizzard"].range(lvl)) / 2;
        const duration = skill_formulas["blizzard"].duration(damage);

        areaCheck(player, level, player, range, (target) => {
            inferno(player, target, damage, cd);
            blizzard(target, duration, cd)
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

        lunge(level, player, damage, speed, range, () => { }, () => { });

        global.particleWind(level, 4, player, "cloud", 0.8, 1);
        global.sound(level, player, "fmn:skill/lunge", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "whirlwind_lunge": (level, player, info, delay, dmg, lvl, id) => {
        const damage = (info.damage(dmg) + skill_formulas["whirlwind"].damage(dmg)) / 2;
        const cd = info.cd(delay);
        const speed = info.speed(lvl);
        const range = (info.range() + skill_formulas["whirlwind"].range(lvl)) / 4;

        lunge(level, player, damage, speed, range, () => { }, (target) => {
            whirlwind(player, target, damage);
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

        lunge(level, player, damage, speed, range, (target) => {
            areaCheck(target, level, player, range2, (target2) => {
                vortex(target, player, target2)
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

        lunge(level, player, damage, speed, range, () => { }, (target) => {
            inferno(player, target, damage2, cd)
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

        lunge(level, player, damage, speed, range, () => { }, (target) => {
            blizzard(target, duration, cd)
        })

        global.particleWind(level, 6, player, "snowflake", 0.5, 1);
        global.sound(level, player, "fmn:skill/lunge", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "inferno_vortex": (level, player, info, delay, dmg, lvl, id) => {
        const cd = info.cd(delay);
        const range = (info.range(lvl) + skill_formulas["inferno"].range(lvl)) / 3;
        const damage = skill_formulas["inferno"].damage(dmg);

        const center = findCenter(level, player);

        areaCheck(center, level, player, range, (target) => {
            vortex(center, player, target);
            inferno(player, target, damage, cd)
        })

        global.particleRing(level, range * 3, range, center, "flame", -0.1 * range);
        global.sound(level, player, "fmn:skill/vortex", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },
    "blizzard_vortex": (level, player, info, delay, dmg, lvl, id) => {
        const cd = info.cd(delay);
        const range = (info.range(lvl) + skill_formulas["blizzard"].range(lvl)) / 3;
        const duration = skill_formulas["blizzard"].duration(dmg);

        const center = findCenter(level, player);

        areaCheck(center, level, player, range, (target) => {
            vortex(center, player, target);
            blizzard(target, duration, cd)
        })

        global.particleRing(level, range * 3, range, center, "snowflake", -0.1 * range, 0.3);
        global.sound(level, player, "fmn:skill/vortex", 0.3);

        player.cooldowns.addCooldown(id, cd)
    },


    "parry": (level, player, info, delay, dmg, lvl, id) => {
        const damage = info.damage(dmg, lvl);
        const cd = info.cd(delay);

        parry1("nope", player, lvl, cd, null, null, null);

        player.cooldowns.addCooldown(id, cd)
    },
    "smite_parry": (level, player, info, delay, dmg, lvl, id) => {
        const cd = info.cd(delay);

        parry1("smite", player, lvl, cd, null, null, null);

        player.cooldowns.addCooldown(id, cd)
    },
    "whirlwind_parry": (level, player, info, delay, dmg, lvl, id) => {
        const cd = info.cd(delay);
        const range = skill_formulas["whirlwind"].range(lvl);

        parry1("whirlwind", player, lvl, cd, range, null, null);

        player.cooldowns.addCooldown(id, cd)
    },
    "lunge_parry": (level, player, info, delay, dmg, lvl, id) => {
        const cd = info.cd(delay);
        const speed = skill_formulas["lunge"].speed(lvl);
        const range = skill_formulas["lunge"].range();

        parry1("lunge", player, lvl, cd, range, speed, null);

        player.cooldowns.addCooldown(id, cd)
    },
    "slash_parry": (level, player, info, delay, dmg, lvl, id) => {
        const cd = info.cd(delay);
        const speed = skill_formulas["slash"].speed(dmg);

        parry1("slash", player, lvl, cd, null, speed, null);

        player.cooldowns.addCooldown(id, cd)
    },
    "vortex_parry": (level, player, info, delay, dmg, lvl, id) => {
        const cd = info.cd(delay);
        const range = skill_formulas["vortex"].range(lvl);

        parry1("vortex", player, lvl, cd, range, null, null);

        player.cooldowns.addCooldown(id, cd)
    },
    "inferno_parry": (level, player, info, delay, dmg, lvl, id) => {
        const cd = info.cd(delay);
        const range = skill_formulas["inferno"].range(lvl);

        parry1("inferno", player, lvl, cd, range, null, null);

        player.cooldowns.addCooldown(id, cd)
    },
    "blizzard_parry": (level, player, info, delay, dmg, lvl, id) => {
        const duration = skill_formulas["blizzard"].duration(dmg);
        const cd = info.cd(delay);
        const range = skill_formulas["blizzard"].range(lvl);

        parry1("blizzard", player, lvl, cd, range, null, duration);

        player.cooldowns.addCooldown(id, cd)
    },


    "sacrifice": (level, player, info, delay, dmg, lvl, id) => {
        const cost = info.cost(lvl);
        const amp = info.amp(lvl);
        const cd = info.cd(delay);

        sacrifice(player, cost);
        dmg *= 2 + ((lvl - 1) * 0.5);

        smite(level, player, dmg, cd, () => { });
        sacrifice(player, cost);

        player.cooldowns.addCooldown(id, cd)
    },
    "sacrifice_smite": (level, player, info, delay, dmg, lvl, id) => {
        const cost = skill_formulas["sacrifice"].cost(lvl);
        const cd = skill_formulas["sacrifice"].cd(info.cd(delay));
        lvl = skill_formulas["sacrifice"].amp(lvl);
        sacrifice(player, cost);

        const damage = info.damage(dmg, lvl);

        smite(level, player, damage, cd, () => { });

        player.cooldowns.addCooldown(id, cd)
    },
    "sacrifice_whirlwind": (level, player, info, delay, dmg, lvl, id) => {
        const cost = skill_formulas["sacrifice"].cost(lvl);
        const cd = skill_formulas["sacrifice"].cd(info.cd(delay));
        lvl = skill_formulas["sacrifice"].amp(lvl);
        sacrifice(player, cost);

        const damage = skill_formulas["whirlwind"].damage(dmg);
        const range = skill_formulas["whirlwind"].range(lvl);

        areaCheck(player, level, player, range, (target) =>
            whirlwind(player, target, damage)
        );

        player.cooldowns.addCooldown(id, cd)
    },

    "sacrifice_lunge": (level, player, info, delay, dmg, lvl, id) => {
        const cost = skill_formulas["sacrifice"].cost(lvl);
        const cd = skill_formulas["sacrifice"].cd(info.cd(delay));
        lvl = skill_formulas["sacrifice"].amp(lvl) + 2;
        sacrifice(player, cost);

        const damage = info.damage(dmg);
        const speed = info.speed(lvl);
        const range = info.range();

        lunge(level, player, damage, speed, range, () => { }, () => { })

        player.cooldowns.addCooldown(id, cd)
    },
    "sacrifice_slash": (level, player, info, delay, dmg, lvl, id) => {
        const cost = skill_formulas["sacrifice"].cost(lvl);
        const cd = skill_formulas["sacrifice"].cd(info.cd(delay));
        lvl = skill_formulas["sacrifice"].amp(lvl);
        sacrifice(player, cost);

        const damage = info.damage(dmg, lvl);
        const speed = info.speed(dmg);

        slash(level, player, damage, cd, speed, "parry", lvl);

        player.cooldowns.addCooldown(id, cd)
    },
    "sacrifice_vortex": (level, player, info, delay, dmg, lvl, id) => {
        const cost = skill_formulas["sacrifice"].cost(lvl);
        const cd = 150;
        lvl = skill_formulas["sacrifice"].amp(lvl);
        sacrifice(player, cost);

        const range = info.range(lvl);

        const center = findCenter(level, player);
        let counter = 0;
        Utils.server.scheduleInTicks(1, c => {
            if (counter > cd + 100) return;
            counter += 7;

            areaCheck(center, level, player, range, (target) => {
                vortex(center, player, target, null, 0.01)
            });

            c.reschedule(7)
        });

        player.cooldowns.addCooldown(id, cd)
    },
    "sacrifice_parry": (level, player, info, delay, dmg, lvl, id) => {
        const cost = skill_formulas["sacrifice"].cost(lvl);
        const cd = skill_formulas["sacrifice"].cd(info.cd(delay));
        lvl = skill_formulas["sacrifice"].amp(lvl);
        sacrifice(player, cost);
        Utils.server.tell(lvl)

        parry1("nope", player, lvl, cd, null, null, null);

        player.cooldowns.addCooldown(id, cd)
    },
    "sacrifice_inferno": (level, player, info, delay, dmg, lvl, id) => {
        const cost = skill_formulas["sacrifice"].cost(lvl);
        const cd = skill_formulas["sacrifice"].cd(info.cd(delay));
        lvl = skill_formulas["sacrifice"].amp(lvl);
        sacrifice(player, cost);

        const damage = info.damage(dmg);
        const range = info.range(lvl);

        areaCheck(player, level, player, range, (target) => {
            inferno(player, target, damage, cd)
        });

        player.cooldowns.addCooldown(id, cd)
    },
    "sacrifice_blizzard": (level, player, info, delay, dmg, lvl, id) => {
        const cost = skill_formulas["sacrifice"].cost(lvl);
        const cd = skill_formulas["sacrifice"].cd(info.cd(delay));
        lvl = skill_formulas["sacrifice"].amp(lvl);
        sacrifice(player, cost);

        const duration = info.duration(dmg);
        const range = info.range(lvl);

        areaCheck(player, level, player, range, (target) => {
            blizzard(target, duration, cd)
        });

        player.cooldowns.addCooldown(id, cd)
    }
}