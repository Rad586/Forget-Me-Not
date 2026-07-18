const t_attributes = []
Object.keys(global.trinkets_common).forEach(name => {
    const { attribute: at } = global.trinkets_common[name];
    if (at) t_attributes.push(at)
})

function trinkets(player) {
    const modifiers = {};
    global.mergedTrinkets(player).forEach(stack => {
        const split = stack.idLocation.path.split("_rune_");
        const info = global.trinkets_common[split[0]];
        if(!info) return;

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

function trinkets_action(level, player, target, ref) {
    global.mergedTrinkets(player).forEach(stack => {
        const split = stack.idLocation.path.split("_rune_");
        const info = ref[split[0]];
        if (!info) return;

        const { action } = info;
        if (!action) return;

        action(level, player, target, split[1] * stack.count)
    })
}

let t_hurting = false
function trinkets_attack(level, player, target) {
    if (t_hurting) return;

    trinkets_action(level, player, target, global.trinkets_attack)

    t_hurting = false
}

function trinkets_hurt(level, player, attacker) {
    trinkets_action(level, player, attacker, global.trinkets_hurt)
}