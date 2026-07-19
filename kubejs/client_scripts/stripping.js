const AxeItem = Java.loadClass("net.minecraft.world.item.AxeItem")

Ingredient.of("#minecraft:logs").getItemIds().forEach(log => {
    if(log.includes("stripped_")) return;

    BlockEvents.rightClicked(log, e => {
        if (e.hand == "off_hand" || 
            e.player.isCrouching() ||
            !(e.item.item instanceof AxeItem)
        ) return;

        e.cancel()
    })
})