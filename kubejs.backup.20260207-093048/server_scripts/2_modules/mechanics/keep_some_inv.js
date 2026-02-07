/* Credit: Liopyu (https://discord.com/channels/303440391124942858/1246451798743449640/1246465482761048165) */
const keep_slots = [
	103, 102, 101, 100, /* armor slots */
	-106, /* offhand */
	0, 1, 2, 3, 4, 5, 6, 7, 8 /* hotbar */
];
function loadAndUpdate(player, content) {
    player.mergeNbt({Inventory: content});
	player.inventoryMenu.broadcastFullState()
};

EntityEvents.death("minecraft:player", e => {
	const {player} = e, {inventory} = player;
	if(keep_inv == "true" || inventory.isEmpty()) return;

	inventory.allItems.forEach(i => {
		if(i.hasEnchantment('vanishing_curse', 1)) i.setCount(0)
	});

	const keep = [], clear = [];
	if (["PEACEFUL", "EASY"].includes(`${e.level.difficulty}`)) {
		player.nbt.Inventory.forEach(i =>
			keep.push(i)
		)
	}
	else {
		player.nbt.Inventory.forEach(i =>
			keep_slots.includes(i.Slot) ? keep.push(i) : clear.push(i)
		)
	};

	player.persistentData.lastItems = keep;
    loadAndUpdate(player, clear)
})

PlayerEvents.respawned(e => {
	const {player} = e, {persistentData: pData} = player, {lastItems} = pData;

	if(keep_inv == "true" || !lastItems) return;
	loadAndUpdate(player, lastItems);
	pData.remove('lastItems')
})

ServerEvents.command("gamerule", e => keep_inv = e.server.gameRules.get("keepInventory"))