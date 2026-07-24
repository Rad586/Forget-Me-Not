const { skill_formulas } = global;
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
        String(target.ownerUUID) != player.uuid &&
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
function parry2(player, target, lvl, damage) {
    attack(player, target, Math.max(lvl + 5, damage))
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

global.effect_parry = {
    "nope": (level, player, target, lvl, damage, cd, range, speed, duration) => {
        damage = skill_formulas["parry"].damage(damage, lvl);

        parry2(player, target, lvl, damage);

        global.particleBurst(level, target, "sweep_attack", 1);
        global.particleWind(level, 3, player, "flame", -0.3, 0.3);
        global.sound(level, player, "fmn:skill/parry", 0.5);
    },
    "smite": (level, player, target, lvl, damage, cd, range, speed, duration) => {
        const d1 = skill_formulas["parry"].damage(damage, lvl);
        const d2 = skill_formulas["smite"].damage(damage, lvl);
        damage = (d1 + d2) / 1.5

        parry2(player, target, lvl, damage);

        global.particleBurst(level, target, "sweep_attack", 1);
        global.particleWind(level, 3, player, "flame", -0.3, 0.3);
        global.sound(level, player, "fmn:skill/smite", 0.15);
        global.sound(level, player, "fmn:skill/parry", 0.5)
    },
    "whirlwind": (level, player, target, lvl, damage, cd, range, speed, duration) => {
        damage = skill_formulas["parry"].damage(damage, lvl);
        damage = skill_formulas["whirlwind"].damage(damage)

        areaCheck(player, level, player, range, (target2) =>
            whirlwind(player, target2, damage)
        );
        player.heal(lvl * 2);

        global.particleRing(level, range * 3, range, player, "sweep_attack", 0, 0.7);
        global.particleWind(level, 3, player, "flame", -0.3, 0.3);
        global.sound(level, player, "fmn:skill/whirlwind", 0.3);
        global.sound(level, player, "fmn:skill/parry", 0.5)
    },
    "lunge": (level, player, target, lvl, damage, cd, range, speed, duration) => {
        damage = skill_formulas["parry"].damage(damage, lvl);
        damage = skill_formulas["lunge"].damage(damage)

        lunge(level, player, damage, speed, range, () => { }, (target2) => {
            attack(player, target2, damage);
            target2.potionEffects.add("weakness", 40, 0, true, false)
        });
        player.heal(lvl * 2);

        global.particleWind(level, 4, player, "cloud", 0.8, 1);
        global.particleWind(level, 3, player, "flame", -0.3, 0.3);
        global.sound(level, player, "fmn:skill/lunge", 0.3);
        global.sound(level, player, "fmn:skill/parry", 0.5)
    },
    "slash": (level, player, target, lvl, damage, cd, range, speed, duration) => {
        const d1 = skill_formulas["parry"].damage(damage, lvl);
        const d2 = skill_formulas["slash"].damage(damage, lvl);
        damage = (d1 + d2) / 2;
        speed = 2;
        const count = 6;

        const base = player.yaw * 3.14 / 180;
        for (let i = 0; i < count; i++) {
            let angle = base + i * 3.14 * 2 / count;

            let motion = new Vec3(
                -Math.sin(angle),
                0,
                Math.cos(angle)
            ).scale(speed);

            slash(level, player, damage, cd, speed, "parry", lvl, motion);
        };
        player.heal(lvl * 2);

        global.particleWind(level, 3, player, "flame", -0.3, 0.3);
        global.sound(level, player, "fmn:skill/slash", 0.3);
        global.sound(level, player, "fmn:skill/parry", 0.5)
    },
    "vortex": (level, player, target, lvl, damage, cd, range, speed, duration) => {
        damage = skill_formulas["parry"].damage(damage, lvl) * 0.75;

        areaCheck(target, level, player, range, (target2) => {
            parry2(player, target2, lvl, damage)
            vortex(target, player, target2)
        });

        global.particleRing(level, range * 3, range, target, "poof", -0.1 * range, -0.1);
        global.particleWind(level, 3, player, "flame", -0.3, 0.3);
        global.sound(level, player, "fmn:skill/vortex", 0.3);
        global.sound(level, player, "fmn:skill/parry", 0.5)
    },
    "inferno": (level, player, target, lvl, damage, cd, range, speed, duration) => {
        damage = skill_formulas["parry"].damage(damage, lvl);
        damage = skill_formulas["inferno"].damage(damage);

        areaCheck(target, level, player, range, (target2) => {
            inferno(player, target2, damage, cd, range);
            target2.knockback(1, player.x - target2.x, player.z - target2.z)
        });
        parry2(player, target, lvl, damage);

        global.particleRingVertical(level, range * 5, range, player, "lava", 0.2, -0.1);
        global.particleRing(level, range * 2, 0.5, player, "flame", 0.4);
        global.particleBurst(level, target, "sweep_attack", 1);
        global.particleWind(level, 3, player, "flame", -0.3, 0.3);
        global.sound(level, player, "fmn:skill/inferno", 0.2);
        global.sound(level, player, "fmn:skill/parry", 0.5)
    },
    "blizzard": (level, player, target, lvl, damage, cd, range, speed, duration) => {
        damage = skill_formulas["parry"].damage(damage, lvl);

        areaCheck(target, level, player, range, (target2) => {
            blizzard(target2, duration, cd);
            target2.knockback(1, player.x - target2.x, player.z - target2.z)
        });
        parry2(player, target, lvl, damage / 2);

        global.particleRingVertical(level, range * 5, range, player, "snowflake", 0.4, -0.1);
        global.particleRing(level, range * 2, 0.5, player, "cloud", 0.8);
        global.particleBurst(level, target, "sweep_attack", 1);
        global.particleWind(level, 3, player, "flame", -0.3, 0.3);
        global.sound(level, player, "fmn:skill/blizzard", 0.2);
        global.sound(level, player, "fmn:skill/parry", 0.5)
    }
}

function parry_effect(level, player, actual, final_dmg, e) {
    if (!player.hasEffect("kubejs:parry")) return;
    player.removeEffect("kubejs:parry");

    const pData = player.persistentData, { parry } = pData;
    player.tell(parry)
    if (!parry) return;

    const { type, lvl, cd, range, speed, duration } = parry;
    global.effect_parry[type](
        level, player, actual, lvl, final_dmg, cd, range, speed, duration);

    pData.remove("parry");
    e.cancel()
}