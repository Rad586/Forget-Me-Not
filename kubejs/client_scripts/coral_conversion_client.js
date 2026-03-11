const coral_alive = []
Array.of("tube", "brain", "bubble", "fire", "horn").forEach(form => {
    Array.of("", "_fan", "_wall_fan", "_block").forEach(type => {
        coral_alive.push(`minecraft:${form}_coral${type}`)
    })
})
const coral_dead = coral_alive.map(id => id.replace(":", ":dead_"))

coral_alive.concat(coral_alive.map(
    id => id.replace("minecraft:", "waxablecoral:waxed_"))).forEach(id => {
        const dead_form = id.includes("waxable") ? 
            id.replace("waxablecoral:waxed_", "minecraft:dead_"): 
            id.replace(":", ":dead_");
        BlockEvents.rightClicked(id, e => {
            const { player } = e;
            if (!e.item.is("minecraft:flint_and_steel") || player.isCrouching()) return;

            const { x, y, z } = e.block;
            player.sendData("coral_dry", { pos: [x, y, z], dead_form: dead_form });
            e.cancel()
        })
    })

ItemEvents.rightClicked(["water_bucket", "potion"], e => {
    const { item, player } = e, { nbt } = item;
    if (nbt && nbt.Potion != "minecraft:water") return;

    const { block } = e.target, { id } = block;
    if (!block || !coral_dead.includes(id) || player.isCrouching()) return;

    const { x, y, z } = block;
    player.sendData("coral_wet", {
        pos: [x, y, z],
        id: id.replace("minecraft:dead_", "waxablecoral:waxed_")
    });
    e.cancel()
})