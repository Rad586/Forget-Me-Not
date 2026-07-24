NetworkEvents.dataReceived("removedye", e => {
    const {player} = e, { containerMenu: menu } = player;
    const slot = menu.getSlot(e.data.slot), { item: hovered } = slot;
    const { carried } = menu;

    if(carried.is("potion")) {
        carried.shrink(1)
        player.give("glass_bottle")
    };
    hovered.nbt.remove("dye");

    menu.setCarried(hovered);
    slot.set(carried)
})