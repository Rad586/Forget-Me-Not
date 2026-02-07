const caving_dim = [
	"diamond", "ruby", "sapphire", "emerald", 
	"alexandrite", "aquamarine", "opal", "turquoise", 
	"topaz", "zircon", "lapis_lazuli", "malachite",
	"moonstone", "schorl", "charoite", "rhodochrosite", 
	"chalcedony", "kunzite", "morganite", "citrine",
	"labradorite", "grossular", "kyanite", "agate", 
	"jade", "stone"
];
ServerEvents.highPriorityData(e => {
	caving_dim.forEach(key => {
		e.addJson(`kubejs:loot_tables/blocks/${key}_ore.json`, {
			"type": "minecraft:block",
			"pools": [
				{
				  "bonus_rolls": 0.0,
				  "rolls": 1.0,
				  "entries": [
					  {
						  "type": "minecraft:item",
						  "functions": [{"function": "minecraft:explosion_decay"}],
						  "name": `kubejs:${key}`
					  }
				  ]
				}
			]
		});
		e.addJson(`kubejs:loot_tables/blocks/random_ore.json`, { 
			"type": "minecraft:block",
			"pools": [
				{
				  "bonus_rolls": 0.0,
				  "rolls": 1.0,
				  "entries": caving_dim.map(key => ({
					"type": "minecraft:item",
					"functions": [{"function": "minecraft:explosion_decay"}],
					"name": `kubejs:${key}`
				  }))
				}
			]
		})
	})
})