function reveal_system(e) {
	e.addLootTypeModifier(LootType.values())
		.modifyLoot(global.Upgradeables, item => {
			if (item.isEnchanted()) {
				let { nbt } = item;
				nbt.remove("Enchantments");
                nbt.revealed = false;	
			}
			return item;
		})
}