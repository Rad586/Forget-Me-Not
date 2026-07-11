function remove_enchantments(entity) {
    entity.handSlots.concat(entity.armorSlots).forEach(stack => {
        if (!stack.isEnchanted()) return;
        stack.setNbt(null)
    })
}