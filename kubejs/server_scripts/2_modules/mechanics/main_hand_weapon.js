const mainhand_weapon = {
    "minecraft:golden_sword": (level, player, target) => {
        global.setSecondsOnFire(level, target, 2)
    }
}

function main_hand_weapon(level, player, target) {
    const info = mainhand_weapon[player.mainHandItem.id];
    if (info) info(level, player, target)
}