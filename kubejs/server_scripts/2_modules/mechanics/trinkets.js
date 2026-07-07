const t_attributes = [
    "minecraft:generic.attack_damage",
    "minecraft:generic.movement_speed",
    "minecraft:generic.armor",
    "minecraft:generic.max_health",
    "minecraft:generic.luck",
    "minecraft:generic.attack_speed",
    "minecraft:generic.armor_toughness"
]

function trinkets(player) {
    const modifiers = {};
    global.mergeTrinkets(global.getTrinkets(player)).forEach(stack => {
        const split = stack.idLocation.path.split("_rune_");
        const info = global.trinkets[split[0]];
        const { attribute, step, operation } = info;
        if (!attribute) return;

        modifiers[attribute] = {
            amount: step * split[1] * stack.count,
            operation: operation || "addition"
        }
    });

    const pData = player.persistentData;
    t_attributes.forEach(attribute => {
        const modifier = modifiers[attribute];
        const amount = modifier ? modifier.amount : 0;

        if (pData[attribute] == amount) return;
        pData[attribute] = amount;

        player.modifyAttribute(
            attribute,
            "trinket",
            amount,
            modifier ? modifier.operation : "addition"
        )
    })
}