function trinkets(player) {
    const t_attributes = [
        "minecraft:generic.attack_damage", "minecraft:generic.movement_speed",
        "minecraft:generic.armor", "minecraft:generic.max_health",
        "minecraft:generic.luck", "minecraft:generic.attack_speed",
        "minecraft:generic.armor_toughness", "reach-entity-attributes:attack_range"
    ]

    const modifiers = {};
    global.getTrinkets(player).forEach(stack => {
        const split = stack.idLocation.path.split("_rune_");
        const info = global.trinkets[split[0]];
        const { attribute } = info;
        if (!attribute) return;

        const modifier = modifiers[attribute];
        if (modifier) {
            modifier.amount += info.step * split[1];
        }
        else {
            modifiers[attribute] = {
                amount: info.step * split[1],
                operation: info.operation || "addition"
            }
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