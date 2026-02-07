Ingredient.of("#minecraft:wooden_doors").getItemIds().forEach(id => {
    BlockEvents.rightClicked(id, e => {
        if (e.hand == "off_hand" || e.player.isCrouching()) return;
        const { block } = e;

        const { facing, hinge, open } = block.properties;
        const dir = Direction[facing];
        const neighbor = block[
            hinge == "left" ?
                dir.getClockWise() :
                dir.getCounterClockWise()
        ];

        const { properties: n_properties } = neighbor;
        if (
            neighbor.id != id ||
            n_properties.facing != facing ||
            n_properties.open != open ||
            n_properties.hinge == hinge
        ) return;

        n_properties.open = open == "true" ? false : true;
        neighbor.set(id, n_properties)
    })
})