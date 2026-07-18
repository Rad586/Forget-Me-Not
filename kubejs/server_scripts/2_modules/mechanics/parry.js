const effect_parry = {
    "nope": (level, player, target, lvl, damage, cd, range, speed, duration) => {
        damage = skill_formulas["parry"].damage(damage, lvl);

        parry2(player, target, lvl, damage)
    },
    "smite": (level, player, target, lvl, damage, cd, range, speed, duration) => {
        const d1 = skill_formulas["parry"].damage(damage, lvl);
        const d2 = skill_formulas["smite"].damage(damage, lvl);
        damage = (d1 + d2) / 1.5

        parry2(player, target, lvl, damage)
    },
    "whirlwind": (level, player, target, lvl, damage, cd, range, speed, duration) => {
        damage = skill_formulas["parry"].damage(damage, lvl);
        damage = skill_formulas["whirlwind"].damage(damage)

        areaCheck(player, level, player, range, (target2) =>
            whirlwind(player, target2, damage)
        );
        player.heal(lvl * 2)
    },
    "lunge": (level, player, target, lvl, damage, cd, range, speed, duration) => {
        damage = skill_formulas["parry"].damage(damage, lvl);
        damage = skill_formulas["lunge"].damage(damage)

        lunge(level, player, damage, speed, range, () => { }, (target2) => {
            attack(player, target2, damage);
            target2.potionEffects.add("weakness", 40, 0, true, false)
        })
        player.heal(lvl * 2)
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
    },
    "vortex": (level, player, target, lvl, damage, cd, range, speed, duration) => {
        damage = skill_formulas["parry"].damage(damage, lvl) * 0.75;

        areaCheck(target, level, player, range, (target2) => {
            parry2(player, target2, lvl, damage)
            vortex(target, player, target2)
        })
    },
    "inferno": (level, player, target, lvl, damage, cd, range, speed, duration) => {
        damage = skill_formulas["parry"].damage(damage, lvl);
        damage = skill_formulas["inferno"].damage(damage);

        areaCheck(target, level, player, range, (target2) => {
            inferno(player, target2, damage, cd, range);
            target2.knockback(1, player.x - target2.x, player.z - target2.z)
        });
        parry2(player, target, lvl, damage)
    },
    "blizzard": (level, player, target, lvl, damage, cd, range, speed, duration) => {
        damage = skill_formulas["parry"].damage(damage, lvl);

        areaCheck(target, level, player, range, (target2) => {
            blizzard(target2, duration, cd);
            target2.knockback(1, player.x - target2.x, player.z - target2.z)
        });
        parry2(player, target, lvl, damage / 2)
    }
}

function parry_effect(level, player, actual, final_dmg, e) {
    if (!player.hasEffect("kubejs:parry")) return
    // player.removeEffect("kubejs:parry");

    const { parry } = player.persistentData;
    if (!parry) return;

    const { type, lvl, cd, range, speed, duration } = parry;
    effect_parry[type](
        level, player, actual, lvl, final_dmg, cd, range, speed, duration);

    // pData.remove("parry");
    // e.cancel()
}