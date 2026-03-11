/* requires both on server and client side */
global.Armors.forEach(armor => {
    ItemEvents.rightClicked(armor.id, e => {
        if (!e.player.isCrouching() || e.hand == "off_hand") e.cancel()
    })
})
