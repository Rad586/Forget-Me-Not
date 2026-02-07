global.upgrade_limit = 20;
global.reforge_limit = 10;
const { upgrade_limit, reforge_limit } = global;

const upgrade = {
    "kubejs:upgrade_runic": {
        type: "upgrade",
        index: 1
    },
    "kubejs:reforge_runic_dmg": {
        type: "reforge",
        index: 1
    },
    "kubejs:reforge_runic_spd": {
        type: "reforge",
        index: -1
    }
}
const upgrade_items = Object.keys(upgrade);
const uuid = global.randomUuid;

const upgrage_msg = Text.translate("dialogue.fmn.upgrade_count").getString();
const reforge_msg = Text.translate("dialogue.fmn.reforge_count").getString();

global.Weapons.forEach(i => {
    const { id } = i;
    const ini_dmg = i.getAttributes("generic.attack_damage")[0].getAmount();
    const ini_spd = i.getAttributes("generic.attack_speed")[0].getAmount() + 4;

    ItemEvents.rightClicked(id, e => {
        const { player } = e, { offhandItem } = player, { id: id2 } = offhandItem;
        if (!upgrade_items.includes(id2)) return;

        const { item } = e;
        if (!item.nbt) item.setNbt({});
        const { nbt } = item;
        const { type, index } = upgrade[id2];
        const is_upgrade = type == "upgrade";

        let Upgrade = nbt.Upgrade || 0, Reforge = nbt.Reforge || 0;
        if (is_upgrade) Upgrade += index
        else Reforge += index;

        if (Upgrade > upgrade_limit || Math.abs(Reforge) > reforge_limit) {
            player.statusMessage = Text.translate(`dialogue.fmn.${type}_limit`)
            return;
        };

        offhandItem.count--;
        nbt.Upgrade = Upgrade; nbt.Reforge = Reforge;

        if (is_upgrade) {
            player.statusMessage = upgrage_msg + Upgrade + "/" + upgrade_limit
        }
        else {
            player.statusMessage = reforge_msg + Math.abs(Reforge) + "/" + reforge_limit
        };

        const upgraded_dmg = ini_dmg + (0.05 * Upgrade);
        const reforged_dmg = Reforge >= 0
            ? upgraded_dmg * Math.pow(1 + 0.2, Reforge)
            : upgraded_dmg * Math.pow(1 - 0.2, -Reforge);
        const reforged_spd = (ini_spd * upgraded_dmg) / reforged_dmg;
        const final_dmg = parseFloat(reforged_dmg.toFixed(2));
        const final_spd = parseFloat(reforged_spd.toFixed(2));
        nbt.dmg = parseFloat((final_dmg + 0.5).toFixed(2)); nbt.spd = final_spd;

        const modifier = {
            "generic.attack_damage": final_dmg,
            "generic.attack_speed": final_spd - 4
        };
        nbt.AttributeModifiers = [];
        Object.keys(modifier).forEach(attribute =>
            item.addAttributeModifier(
                attribute,
                new AttributeModifier(uuid, "", modifier[attribute], "addition"),
                "mainhand"
            )
        );

        global.sound(player, "block.enchantment_table.use", 0.4, 1.8);
        global.sound(player, "block.stone.break", 0.5, 0.74);
        global.particleBurst(player, "end_rod", 5, 0.2);
        global.particleBurst(player, "enchant", 24, 0.6, 0.5)
    })
})

global.Armors.forEach(i => {
    const { id } = i;
    const ini_amr = i.getAttributes("generic.armor")[0].getAmount();
    const ini_tou = i.getAttributes("generic.armor_toughness")[0].getAmount();

    ItemEvents.rightClicked(id, e => {
        const { player } = e, { offhandItem } = player, { id: id2 } = offhandItem;
        if (id2 != "kubejs:upgrade_runic") return;

        const { item } = e;
        if (!item.nbt) item.setNbt({});
        const { nbt } = item;

        let Upgrade = nbt.Upgrade || 0;
        Upgrade += 1;

        if (Upgrade > upgrade_limit) {
            player.statusMessage = Text.translate("dialogue.fmn.upgrade_limit")
            return;
        };
        offhandItem.count--;
        nbt.Upgrade = Upgrade;

        player.statusMessage = upgrage_msg + Upgrade + "/" + upgrade_limit

        const upgraded_amr = ini_amr + (0.05 * Upgrade);
        const final_amr = parseFloat(upgraded_amr.toFixed(2));
        nbt.amr = final_amr;

        nbt.AttributeModifiers = [];
        item.addAttributeModifier(
            "generic.armor",
            new AttributeModifier(uuid, "", final_amr, "addition"),
            "chest"
        );
        item.addAttributeModifier(
            "generic.armor_toughness",
            new AttributeModifier(uuid, "", ini_tou, "addition"),
            "chest"
        );

        global.sound(player, "block.enchantment_table.use", 0.4, 1.8);
        global.sound(player, "block.stone.break", 0.5, 0.74);
        global.particleBurst(player, "end_rod", 5, 0.2);
        global.particleBurst(player, "enchant", 24, 0.6, 0.5)
    })
})


global.Upgradeables.forEach(id => {
    ItemEvents.rightClicked(id, e => {
        const { player, item } = e, { offhandItem } = player;
        if (offhandItem.id != "kubejs:reveal_runic") return;

        const { nbt } = item, { revealed } = nbt;
        // if (revealed == null || revealed == true) return;
        if (revealed != false) return;

        nbt.revealed = true;

        global.sound(player, "block.enchantment_table.use", 0.4, 1.8);
        global.sound(player, "block.stone.break", 0.5, 0.74);
        global.particleBurst(player, "end_rod", 5, 0.2);
        global.particleBurst(player, "enchant", 24, 0.6, 0.5)
    })
})