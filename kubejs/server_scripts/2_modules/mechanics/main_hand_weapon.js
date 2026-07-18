const weapon_abilities = {
    "minecraft:golden_sword": (level, player, target) => {
        global.setSecondsOnFire(level, target, 2)
    }
}

function main_hand_weapon(level, player, target) {
    const info = weapon_abilities[player.mainHandItem.id];
    if (info) info(level, player, target)
}