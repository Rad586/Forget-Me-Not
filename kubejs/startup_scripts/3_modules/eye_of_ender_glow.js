function ender_eye_glow(entity, server) {
    if(entity.item.id != "minecraft:ender_eye") return;
    /* don't want to use a command but seems it's the only way */
    server.runCommandSilent(`team join eye ${entity.uuid}`);
    entity.setGlowing(true);
}