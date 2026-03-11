const PhysicsConfig = Java.loadClass('net.diebuddies.config.ConfigClient')
function modPhysics() {
    if (PhysicsConfig.guiPhysics == false) return;
    PhysicsConfig.guiPhysics = false
}