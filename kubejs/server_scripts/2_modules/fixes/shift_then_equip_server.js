global.Armors.map(i => i.id).forEach(id => {
    ItemEvents.rightClicked(id, e => {
        const { player, item } = e;
        if (!player.isCrouching() || e.hand == "off_hand") e.cancel();

        const armor_map = {
            "_helmet": "head",
            "_chestplate": "chest",
            "_leggings": "legs",
            "_boots": "feet"
        };
        Object.keys(armor_map).forEach(key => {
            if(!id.endsWith(key)) return;
            const slot = armor_map[key];

            const target_stack = player.getItemBySlot(slot);
            if (target_stack.isEmpty() || target_stack == item) return;
            
            player.setItemSlot(slot, item);
            player.setMainHandItem(target_stack)
        })
    })
})