const {
    s_attack, s_attackable, s_hit_criteria,
    s_areaCheck, s_findCenter, s_smite,
    s_whirlwind, s_lunge, s_slash, s_vortex,
    s_inferno, s_blizzard, s_sacrifice,
    skill_formulas
} = global

function s_parry2(player, target, lvl, damage) {
    const mul = JavaMath.clamp(
        1 - (target.distanceToEntity(player) - 8) / 16, 0.5, 1);
    s_attack(player, target, Math.max(lvl + 5, damage) * mul);
    player.heal(lvl * 2)
}

global.effect_parry = {
    "nope": (level, player, target, lvl, damage, cd, range, speed, duration) => {
        damage = skill_formulas["parry"].damage(damage, lvl);

        s_parry2(player, target, lvl, damage);

        global.particleBurst(level, target, "sweep_attack", 1);
        global.particleWind(level, 3, player, "flame", -0.3, 0.3);
        global.sound(level, player, "fmn:skill/parry", 0.5);
    },
    "smite": (level, player, target, lvl, damage, cd, range, speed, duration) => {
        const d1 = skill_formulas["parry"].damage(damage, lvl);
        const d2 = skill_formulas["smite"].damage(damage, lvl);
        damage = (d1 + d2) / 1.5

        s_parry2(player, target, lvl, damage);

        global.particleBurst(level, target, "sweep_attack", 1);
        global.particleWind(level, 3, player, "flame", -0.3, 0.3);
        global.sound(level, player, "fmn:skill/smite", 0.15);
        global.sound(level, player, "fmn:skill/parry", 0.5)
    },
    "whirlwind": (level, player, target, lvl, damage, cd, range, speed, duration) => {
        damage = skill_formulas["parry"].damage(damage, lvl);
        damage = skill_formulas["whirlwind"].damage(damage)

        s_areaCheck(player, level, player, range, (target2) =>
            s_whirlwind(player, target2, damage)
        );
        player.heal(lvl * 2);

        global.particleRing(level, range * 3, range, player, "sweep_attack", 0, 0.7);
        global.particleWind(level, 3, player, "flame", -0.3, 0.3);
        global.sound(level, player, "fmn:skill/whirlwind", 0.3);
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

            s_slash(level, player, damage, cd, speed, "nope", lvl, motion);
        };
        player.heal(lvl * 2);

        global.particleWind(level, 3, player, "flame", -0.3, 0.3);
        global.sound(level, player, "fmn:skill/slash", 0.3);
        global.sound(level, player, "fmn:skill/parry", 0.5)
    },
    "vortex": (level, player, target, lvl, damage, cd, range, speed, duration) => {
        damage = skill_formulas["parry"].damage(damage, lvl) * 0.75;

       s_areaCheck(target, level, player, range, (target2) => {
            s_parry2(player, target2, lvl, damage)
            s_vortex(target, player, target2)
        });

        global.particleRing(level, range * 3, range, target, "poof", -0.1 * range, -0.1);
        global.particleWind(level, 3, player, "flame", -0.3, 0.3);
        global.sound(level, player, "fmn:skill/vortex", 0.3);
        global.sound(level, player, "fmn:skill/parry", 0.5)
    },
    "inferno": (level, player, target, lvl, damage, cd, range, speed, duration) => {
        damage = skill_formulas["parry"].damage(damage, lvl);
        damage = skill_formulas["inferno"].damage(damage);

        s_areaCheck(target, level, player, range, (target2) => {
            s_inferno(player, target2, damage, cd, range);
            target2.knockback(1, player.x - target2.x, player.z - target2.z)
        });
        s_parry2(player, target, lvl, damage);

        global.particleRingVertical(level, range * 5, range, player, "lava", 0.2, -0.1);
        global.particleRing(level, range * 2, 0.5, player, "flame", 0.4);
        global.particleBurst(level, target, "sweep_attack", 1);
        global.particleWind(level, 3, player, "flame", -0.3, 0.3);
        global.sound(level, player, "fmn:skill/inferno", 0.2);
        global.sound(level, player, "fmn:skill/parry", 0.5)
    },
    "blizzard": (level, player, target, lvl, damage, cd, range, speed, duration) => {
        damage = skill_formulas["parry"].damage(damage, lvl);

        s_areaCheck(target, level, player, range, (target2) => {
            s_blizzard(target2, duration, cd);
            target2.knockback(1, player.x - target2.x, player.z - target2.z)
        });
        s_parry2(player, target, lvl, damage / 2);

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
    if (!parry) return;

    const { type, lvl, cd, range, speed, duration } = parry;
    global.effect_parry[type](
        level, player, actual, lvl, final_dmg, cd, range, speed, duration);

    pData.remove("parry");
    e.cancel()
}