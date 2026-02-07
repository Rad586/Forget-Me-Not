const starting_msg = Text.translate("dialogue.fmn.starting").gold()
const succeed_msg = Text.translate("dialogue.fmn.path_succeed").gold();
const failed_msg = Text.translate("dialogue.fmn.path_failed");
const cancelled_msg = Text.translate("dialogue.fmn.path_cancelled");

Ingredient.of("#minecraft:dirt").getItemIds().forEach(id => {
    BlockEvents.rightClicked(id, e => {
        const { player, item } = e;
        if (e.hand == "off_hand" ||
            !e.player.isCrouching() ||
            !(e.item.item instanceof ShovelItem)
        ) return;

        const { level, block, server } = e, { nbt } = item;
        const { x, y, z } = block;
        if (!nbt) item.setNbt({});

        function makePath(block) {
            if (
                block.hasTag("minecraft:dirt") &&
                !block.up.blockState.block.getCollidable()
            ) {
                block.set("minecraft:dirt_path")
            }
        };
        function particle() {
            level.spawnParticles(
                "composter", true,
                x + 0.5, y + 1.1, z + 0.5,
                0.4, 0.0, 0.4,
                8, 0
            )
        };

        if (!nbt.Start) {
            nbt.Start = [x, y, z];
            player.statusMessage = [starting_msg, ` (${x}, ${y}, ${z})`];
            particle();
            e.cancel()
        }
        else {
            let dummy = level.createEntity("kubejs:dummy");
            dummy.setPosition(x + 0.5, y + 1, z + 0.5);
            dummy.spawn();

            let { Start: s } = nbt;
            server.scheduleInTicks(2, () => { /* delay needs to be >= 2 */
                let path = dummy.navigation.createPath(s[0], s[1], s[2], 0);
                if (!path || !path.canReach()) {
                    player.statusMessage = failed_msg;
                    nbt.remove("Start");
                    return
                };

                let count = path.getNodeCount();
                let i = 0;
                server.scheduleInTicks(1, c => {
                    const pos = path.getNodePos(i).above(-1);
                    [-1, 0, 1].forEach(x => 
                        [-1, 0, 1].forEach(z => 
                            makePath(level.getBlock(pos.offset(x, 0, z)))
                        )
                    )

                    i++;
                    if (i + 1 >= count) return;
                    c.reschedule()
                })

                nbt.remove("Start")
                player.addItemCooldown(item.id, 40);
                player.statusMessage = succeed_msg;
                particle()
            });
            e.cancel()
        }
    })
})

global.Shovels.forEach(shovel => {
    ItemEvents.rightClicked(shovel.id, e => {
        const { nbt } = e.item, { player } = e;
        if (!player.isCrouching() || !nbt || e.target.block) return;

        const { Start } = nbt;
        if (!Start) return;

        nbt.remove("Start");
        player.statusMessage = cancelled_msg;

        global.sound(player, "entity.item.pickup", 0.15, 1.08);
        player.swing()
    })
})