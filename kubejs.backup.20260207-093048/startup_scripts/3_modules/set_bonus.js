const bonuses = {
    set1: {
        armors: [
            "minecraft:golden_helmet", "minecraft:golden_chestplate",
            "minecraft:golden_leggings", "minecraft:golden_boots"
        ],
        bonus: ["fire_resistance", 0]
    },
    set2: {
        armors: [
            "minecraft:leather_helmet", "minecraft:leather_chestplate",
            "minecraft:leather_leggings", "minecraft:leather_boots"
        ],
        bonus: ["speed", 0]
    },
    set3: {
        armors: [
            "kubejs:crown_of_scarlet"
        ],
        bonus: ["strength", 0]
    }
};
function armor_set_bonus(context) {
    const { entity, previousStack, currentStack } = context;
    const { potionEffects, armorSlots } = entity;

    const now_set = armorSlots.toArray().map(i => i.id);
    const last_set = now_set.map(i =>
        i == currentStack.id ? previousStack.id : i
    );
    const check_array = (array1, array2) =>
        array1.every(a =>
            array2.filter(i => i != "minecraft:air").includes(a)
        );

    Object.keys(bonuses).forEach(set => {
        const data = bonuses[set];
        const { armors, bonus } = data;

        if (!check_array(armors, last_set)) entity.removeEffect(bonus[0]);

        if (check_array(armors, now_set)) potionEffects.add(bonus[0], MAX_VALUE, bonus[1], true, true)
    })
}