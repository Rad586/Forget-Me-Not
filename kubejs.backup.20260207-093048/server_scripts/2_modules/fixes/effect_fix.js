function loggedOutEffects(player) {
    const pData = player.persistentData;
	pData.effects = [];
    player.activeEffects.forEach(effect => {
        const match = effect.getDescriptionId().replace(".", ",").split(",");
        pData.effects.push({modId: match[1], effectId: match[2], duration: effect.duration, amplifier: effect.amplifier});
    })
};