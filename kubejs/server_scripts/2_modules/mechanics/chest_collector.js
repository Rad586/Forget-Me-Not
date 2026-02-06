global.Chests.forEach(chest => {
    BlockEvents.leftClicked(chest.id, e => {
        const { player } = e;
        if (e.hand == "off_hand" || !player.isCrouching()) return;
        if (!player.hasEffect("kubejs:timer")) {
            player.potionEffects.add("kubejs:timer", 5, 0, true, false)
            return
        };

        const { block, level } = e, { properties } = block;
        if(!block.inventory) return;
        const { type } = properties;

        const left_type = type == "left";
        const facing_dir = Direction[properties.facing];

        const to_neighbor = (type == "single" || !type) ?
            new Vec3f(0, 0, 0) :
            (
                left_type ?
                    facing_dir.getClockWise().step() :
                    facing_dir.getCounterClockWise().step()
            )
        const aabb = AABB.ofBlock(block.pos)
            .expandTowards(new Vec3(to_neighbor))
            .inflate(1.2, 0, 1.2);

        const main_chest = left_type ? block[facing_dir.getClockWise()] : block;
        const { inventory } = main_chest;

        const item_entities = e.level.getEntitiesWithin(aabb)
            .filter(e => e.type == "minecraft:item");
        if (item_entities.isEmpty()) {
            player.statusMessage = Text.translate("dialogue.fmn.not_found")
            return
        };

        function let_them_fly() {
            item_entities.forEach(entity => {
                entity.setNoGravity(true);
                entity.setGlowing(true);
                entity.setMotionY(0.04);
                entity.addTag("flying")
            })
        };
        function collect_them() {
            item_entities.forEach(entity => {
                if (!entity) return;
                const { item } = entity;
                inventory.insertItem(item, false);
                global.particleBurst(entity, "reverse_portal", 3, 0.024);
                entity.discard()
            })
        };

        let_them_fly();
        level.playSound(null, aabb.getCenter(), "block.beacon.power_select", "master", 0.45, 1.14);

        e.server.scheduleInTicks(20, () => {
            collect_them();
            main_chest.getEntity().startOpen(player)
        });

        player.removeEffect("kubejs:timer")
    })
})