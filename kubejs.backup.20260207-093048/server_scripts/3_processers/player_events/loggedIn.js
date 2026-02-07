PlayerEvents.loggedIn(e => {
    const { player } = e;
    const { persistentData: pData, username, potionEffects } = player;

    if (pData.effects) {
        pData.effects.forEach(effect => {
            potionEffects.add(`${effect.modId}:${effect.effectId}`, effect.duration, effect.amplifier);
        });
        pData.remove('effects')
    }

    potionEffects.add("kubejs:bad_omen_check", 1, 0, true, false);
    if (player.team == "net.minecraft.class_268@57dfd0e3") {
        server.runCommandSilent(`team leave ${username}`)
    };

    pData.basehealth = 20;
    global.updateMaxHealth(player);

    const { stages } = player;
    if (stages.has("loggedin")) return;
    stages.add("loggedin")

    if (pData.armor_sets == null) {
        pData.armor_sets = [
            ["air", "air", "air", "air"],
            ["air", "air", "air", "air"],
            ["air", "air", "air", "air"]
        ]
    };

    player.sendData("pingchannel", { channel: Math.random().toFixed(6).slice(-6) })
})