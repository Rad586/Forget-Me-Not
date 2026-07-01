global.Signs.forEach(sign => {
    const { id } = sign;
    BlockEvents.rightClicked(id, e => {
        const { player } = e;
        if (!player.isCrouching() || e.hand == "off_hand") return;

        player.openTextEdit(e.block.entity);
        e.cancel()
    })
})