global.banned_block = [
    "minecraft:anvil", "minecraft:enchanting_table", 
    "minecraft:grindstone"
]
BlockEvents.rightClicked(global.banned_block, e => e.cancel())