BlockEvents.rightClicked("minecraft:sign", e => {
    const { player } = e;
    if (!player.isCrouching() || e.hand == "off_hand") return;
    player.openTextEdit(e.block.entity)
})