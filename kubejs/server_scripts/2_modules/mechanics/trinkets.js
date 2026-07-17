const t_attributes = [
    "minecraft:generic.attack_damage", "minecraft:generic.movement_speed",
    "minecraft:generic.armor", "minecraft:generic.max_health",
    "minecraft:generic.luck", "minecraft:generic.attack_speed",
    "minecraft:generic.armor_toughness"
]

function trinkets(player) {
    const modifiers = {};
    global.mergedTrinkets(player).forEach(stack => {
        const split = stack.idLocation.path.split("_rune_");
        const info = global.trinkets[split[0]];
        const { attribute } = info;
        if (!attribute) return;

        modifiers[attribute] = {
            amount: info.step * split[1] * stack.count,
            operation: info.operation || "addition"
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
        );

        if (attribute == "minecraft:generic.max_health" &&
            player.health > player.maxHealth
        ) {
            player.setHealth(player.maxHealth)
        }
    })
}