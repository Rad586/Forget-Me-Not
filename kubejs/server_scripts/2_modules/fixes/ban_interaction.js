global.banned_block = [
    "minecraft:anvil", "minecraft:enchanting_table", 
    "minecraft:grindstone", "minecraft:bee_nest",
    "minecraft:beehive"
]
BlockEvents.rightClicked(global.banned_block, e => e.cancel())