NetworkEvents.dataReceived("amethyst", e => {
    const { player, data } = e, { containerMenu: menu } = player;
    const slot = menu.getSlot(data.slot), { item: hovered } = slot;
    const { carried } = menu;
    const count = data.shift ? carried.count : 1;

    if (!hovered.hasEnchantment("kubejs:infusion", 1)) {
        hovered.enchantStack("kubejs:infusion", count);
    }
    else {
        hovered.nbt.Enchantments
            .find(i => i.id == "kubejs:infusion").lvl += count;
    };
    carried.shrink(count);

    menu.setCarried(hovered);
    slot.set(carried)
})