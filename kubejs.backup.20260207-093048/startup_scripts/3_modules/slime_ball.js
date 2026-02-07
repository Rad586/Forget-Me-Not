/* Idea from MikhailTapio(https://www.curseforge.com/minecraft/mc-mods/throwableslimeball) */
function slime_ball_block(entity, direction) {
    const {level} = entity;
    if(level.isClientSide()) return;

    const {motionX, motionY, motionZ} = entity;
    const motion = Math.abs(motionX) + Math.abs(motionY) + Math.abs(motionZ);

	if(motion.toFixed(0) > 0) global.bounce(entity, direction, motionX, motionY, motionZ);
	else {
        entity.discard();
        let slime_ball = level.createEntity("item");

        slime_ball.setItem("slime_ball");
		slime_ball.copyPosition(entity);
        global.bounce(slime_ball, direction, motionX, motionY, motionZ);
		slime_ball.spawn();
	}
}

function slime_ball_entity(entity, result) {
    const {server} = entity;
    if (!server) return;

    const target = result.entity;
    if(target == entity.owner) {
        target.give("slime_ball");
    }
    else if(target instanceof Slime){
        target.heal(2);
        global.sound(target, "entity.puffer_fish.blow_up", 0.48, 1.4);
        global.particleBurst(target, "heart", 3, 0.06, 0.4, entity.eyeY);
    }
    else if(Object.keys(global.evolutionMap).includes(target.type)){
        evolution(server.persistentData.nether_stage, target, 1);
        target.potionEffects.add("slowness", 24, 0);
        global.sound(target, "entity.generic.eat", 0.55, 0.8);
    };

    if(entity.isOnFire()) target.setSecondsOnFire(1.5);

    entity.discard();

    global.particleBurst(target, "item_slime", 4);
    global.sound(target, "block.slime_block.break", 0.4, 1.1);
}