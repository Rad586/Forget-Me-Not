const bonuses = [
    {
        armors: [
            "minecraft:golden_helmet", "minecraft:golden_chestplate",
            "minecraft:golden_leggings", "minecraft:golden_boots"
        ],
        bonus: ["fire_resistance", 0]
    },
    {
        armors: [
            "minecraft:leather_helmet", "minecraft:leather_chestplate",
            "minecraft:leather_leggings", "minecraft:leather_boots"
        ],
        bonus: ["speed", 0]
    }
];

const bonuses_set = new Map();
bonuses.forEach(info => {
    info.armors.forEach(id => {
        if (!bonuses_set.has(id)) bonuses_set.set(id, []);
        bonuses_set.get(id).push(info);
    })
})

function set_bonus(context) {
    const { entity, previousStack, currentStack } = context;
    const p_id = String(previousStack.id), c_id = String(currentStack.id);
    if (!entity.server || p_id == c_id) return;
    const { potionEffects, armorSlots } = entity;

    function add(stuff) {
        if (stuff) for (let s of stuff) affted_sets.add(s);
    };
    const affted_sets = new Set();
    [p_id, c_id].forEach(i => add(bonuses_set.get(i)));
    if (affted_sets.size == 0) return;

    const current_set = new Set(armorSlots.toArray().map(i => String(i.id)));
    affted_sets.forEach(info => {
        const { armors, bonus } = info;
        const has_set = armors.every(a => current_set.has(a));

        if (has_set) potionEffects.add(bonus[0], global.MAX_VALUE, bonus[1], true, true)
        else if (armors.includes(p_id)) entity.removeEffect(bonus[0])
    })
}