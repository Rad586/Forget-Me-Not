global.released_fish = [
    "minecraft:pufferfish", "minecraft:salmon", "minecraft:cod",
    "minecraft:tropical_fish", "fishofthieves:pondie", "fishofthieves:islehopper",
    "fishofthieves:ancientscale", "fishofthieves:plentifin", "fishofthieves:wildsplash",
    "fishofthieves:devilfish", "fishofthieves:battlegill", "fishofthieves:wrecker",
    "fishofthieves:stormfish", "fishofthieves:splashtail"
];

function released_fish_hurt(context) {
    if(!context.entity.tags.contains("released")) return false;

    const player = context.damageSource.getPlayer();
    if(player && !player.isCrouching()) return true;

    return false
}