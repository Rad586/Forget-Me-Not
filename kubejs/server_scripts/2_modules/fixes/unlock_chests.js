["probablychests:gold_chest", "probablychests:shadow_chest"].forEach(key => {
	BlockEvents.rightClicked(key, e => e.block.setEntityData({isLocked: false}))
})