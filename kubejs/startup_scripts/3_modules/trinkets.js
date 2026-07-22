function attack(player, target, amount) {
    target.invulnerableTime = 0;
    target.attack(player, amount)
}

global.trinkets_common = {
    /* common attribute */
    "dmg": {
        attribute: "minecraft:generic.attack_damage",
        step: 0.65
    },
    "spd": {
        attribute: "minecraft:generic.movement_speed",
        step: 0.06,
        percent: true,
        operation: "multiply_base"
    },
    "amr": {
        attribute: "minecraft:generic.armor",
        step: 1.75
    },
    "mh": {
        attribute: "minecraft:generic.max_health",
        step: 2
    },

    /* rare attribute */
    "luck": {
        attribute: "minecraft:generic.luck",
        step: 0.2
    },
    "as": {
        attribute: "minecraft:generic.attack_speed",
        step: 0.14,
        percent: true,
        operation: "multiply_base"
    },
    "at": {
        attribute: "minecraft:generic.armor_toughness",
        step: 1.75
    },
    "bless": {
        step: 0.08,
        percent: true,
        action: (level, player, target, amount, healAmount) => {
            const { step } = global.trinkets["bless"];

            player.health += healAmount *
                amount * step *
                (1 - 2 * player.isInvertedHealAndHarm())
        }
    },
    "cc": {
        attribute: "minecraft:generic.crit_chance",
        percent: true,
        step: 0.08
    },
    "cd": {
        attribute: "minecraft:generic.crit_damage",
        percent: true,
        step: 0.08
    }
}

global.trinkets_attack = {
    "fire": {
        step: 1,
        action: (level, player, target, amount) => {
            const { step } = global.trinkets["fire"];
            amount += 1;

            global.setSecondsOnFire(level, target, amount * step)
        }
    },
    "leech": {
        step: 0.45,
        action: (level, player, target, amount) => {
            const { step } = global.trinkets["leech"];

            if (global.throttle(player, 1, "leech")) return;
            player.heal(amount * step)
        }
    },
    "execution": {
        step: 0.04,
        percent: true,
        action: (level, player, target, amount) => {
            const { step } = global.trinkets["execution"];

            if (target.health / target.maxHealth > amount * step) return;
            attack(player, target, 999)
        }
    },
    "grim": {
        step: 0.075,
        percent: true,
        action: (level, player, target, amount) => {
            const { step } = global.trinkets["grim"];

            if (Math.random() > amount * step) return;
            attack(player, target, 100)
        }
    }
}

global.trinkets_hurt = {
    "thorns": {
        step: 0.75,
        action: (level, player, target, amount) => {
            const { step } = global.trinkets["thorns"];

            attack(player, target, amount * step)
        }
    },
    "absorption": {
        step: 1,
        action: (level, player, target, amount) => {
            const { step } = global.trinkets["absorption"];

            if (global.throttle(player, 60, "absorption") ||
                player.absorptionAmount >= amount * step) return;

            player.setAbsorptionAmount(amount * step)
        }
    }
}

global.trinkets = Object.assign(
    {},
    global.trinkets_common,
    global.trinkets_attack,
    global.trinkets_hurt
)