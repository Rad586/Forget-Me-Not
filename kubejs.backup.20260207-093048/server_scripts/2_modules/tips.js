const advancements = [
    "msg", "ender_dragon_death", "falling_star",
    "death", "respawn", "updated", "lowhp", 
    "lvl20", "glow_berries", "fish", 
    "goat_horn", "protection", "amethyst", 
    "chest", "golden_key", "helper", 
    "sapling", "oak_leaves", "torch", 
    "furnace", "crafting_table", "anvil", 
    "obsiian_placed", "ladder", "shulker_box", 
    "crying_obsidian", "fletching_table", 
    "oak_door", "spawner", "campfire", 
    "altar", "gauntlet", "obsidilith",
    "parkour", "spyglass", "shield",
    "water_bucket", "debug_stick",
    "flint_and_steel", "boat", "dragon_breath2",
    "zombie", "skeleton", "zoom", 
    "piglin", "spider", "creeper1",
    "tool", "witch", "wither_skeleton", 
    "normal_chest_mimic", "vex", "husk", 
    "slime1", "rabbit", "ender_dragon", 
    "iron_golem", "piglin_trade", "wolf",
    "mimic", "horse", "llama", "guard_rc", 
    "blaze", "piglin2", "drowned", 
    "creeper2", "magma_cube", "slime2", 
    "stray", "fire", "underwater", 
    "hot_biome", "cold_biome", "dirt", 
    "netherrack", "coal_ore", "obsidian", 
    "gold_block", "nether_wart", 
    "deep", "diamond", "waystone", 
    "smithing_table", "nether_portal", 
    "cauldron", "mob_farm", "dummy", 
    "waypoint", "hoe", "breeding"
]

advancements.forEach(adv => {
    const name = "kubejs:tip/" + adv;
    const tip = Text.translate("dialogue.fmn." + adv);
    PlayerEvents.advancement(name, e => {
        const {player} = e, {x, y, z} = player;
        e.level.playSound(null, x, y, z, "entity.experience_orb.pickup", "master", 0.2, 0.95 + Math.random()*0.1);
        player.displayClientMessage(tip, true)
    })
})