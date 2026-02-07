let lastEffects = [];

function end_dim_fix_out(e) {
    const {player} = e;
    /* Getting *out* the end dimension */
	if(e.getOldLevel().dimension.toString() == "minecraft:the_end") return;
    player.stages.add("end");

    player.activeEffects.forEach(effect => {
        const match = effect.getDescriptionId().replace(".", ",").split(",");
        lastEffects.push({modId: match[1], effectId: match[2], duration: effect.duration, amplifier: effect.amplifier});
    })
}

function end_dim_fix_respawn(player) {
    /* used in limited_lives.js */
    lastEffects.forEach(effect => {
        player.potionEffects.add(`${effect.modId}:${effect.effectId}`, effect.duration, effect.amplifier);
    });
    lastEffects = [];
}