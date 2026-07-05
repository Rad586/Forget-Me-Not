NetworkEvents.dataReceived("remove_item", e => {
	e.player.containerMenu.getSlot(e.data.slot).set(Item.empty)
})