global.custom_sounds = [
    "skill/whirlwind", "skill/smite", "skill/slash",
    "skill/blizzard", "skill/inferno", "skill/vortex",
    "skill/lunge", "destroy_projectile", "skill/parry", 
    "skill/sacrifice"
]

StartupEvents.registry("sound_event", e => 
    global.custom_sounds.forEach(s => e.create("fmn:" + s)))