function villager_trade(entity, player) {
    if(trade == true) return true;

    if(player.hasEffect("kubejs:timer")) return false;
    player.potionEffects.add("kubejs:timer", 5, 0, true, false);

    const {x, y, z, navigation} = entity;
    const totalNodes = [0, 1, 2, 3].reduce((sum, i) => {
        const angle = i * Math.PI / 2;
        return sum + navigation.createPath(x + Math.cos(angle), y, z + Math.sin(angle), 0.1).getNodeCount();
    }, 0);  

    if(totalNodes < 16) {
        global.sound(entity, "entity.villager.no");
        entity.level.spawnParticles("angry_villager", true, x, y+1.5, z, 0.2, 0.2, 0.2, 2, 0);
        player.statusMessage = Text.translate("dialogue.fmn.villager_denial");
        return false;
    };
    return true;
}