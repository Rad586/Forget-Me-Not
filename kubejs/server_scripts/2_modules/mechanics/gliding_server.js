NetworkEvents.dataReceived("gliding", e => {
    const {player} = e;
    player.persistentData.gliding = e.data.status; /* used in fall_damage_modifier.js */
    player.resetFallDistance()
})