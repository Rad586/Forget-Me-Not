const custom_sounds = [
    "whirlwind", "smite", "arc", 
    "blizzard", "inferno", "vortex", 
    "lunge", "destroy_projectile"
]
StartupEvents.registry("sound_event", e => custom_sounds.forEach(s => e.create("fmn:" + s)))