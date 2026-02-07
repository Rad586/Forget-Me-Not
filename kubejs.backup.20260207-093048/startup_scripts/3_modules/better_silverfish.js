function better_silverfish(target) {
    if(target.level.isClientSide()) return;
    target.damageHeldItem("main_hand", 2)
}