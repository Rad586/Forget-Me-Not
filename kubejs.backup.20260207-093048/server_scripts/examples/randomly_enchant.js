// ServerEvents.highPriorityData(e => {
// 	function newRandomBook(lvl, treasure) {
// 		e.addJson(`kubejs:loot_tables/book_${lvl}_${treasure}.json`, {
// 			"type": "minecraft:chest",
// 			"pools": [
// 			  {
// 				"rolls": 1.0,
// 				"bonus_rolls": 0.0,
// 				"entries": [
// 					{
// 						"type": "minecraft:item",
// 						"functions": [
// 						  {
// 							"function": "minecraft:enchant_with_levels",
// 							"levels": lvl,
// 							"treasure": treasure
// 						  }
// 						],
// 						"name": "minecraft:book"
// 					}
// 				]
// 			  }
// 			]  
// 		})
// 	};

// 	newRandomBook(30, true) //level = 30, can be treasure enchant
// })
// ItemEvents.rightClicked(e => {
// 	const book = Utils.rollChestLoot("kubejs:book_30_true")[0];

//     //give a randomly enchanted book
// 	e.player.give(book)

//     //randomly enchant a item
// 	if(!e.item.isEnchantable()) return;
// 	e.item.setNbt({Enchantments: book.nbt.StoredEnchantments})
// })