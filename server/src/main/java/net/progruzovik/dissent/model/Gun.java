package net.progruzovik.dissent.model;

public final class Gun {

    private final String name;
    private final int radius;
    private final int cooldown;

    private final String projectileType;
    private final int shotsCount;
    private final int shotDelay;

    public Gun(String name, int radius, int cooldown, String projectileType) {
        this.name = name;
        this.radius = radius;
        this.cooldown = cooldown;
        this.projectileType = projectileType;
        this.shotsCount = 1;
        this.shotDelay = 0;
    }

    public Gun(String name, int radius, int cooldown, String projectileType, int shotsCount, int shotDelay) {
        this.name = name;
        this.radius = radius;
        this.cooldown = cooldown;
        this.projectileType = projectileType;
        this.shotsCount = shotsCount;
        this.shotDelay = shotDelay;
    }

    public String getName() {
        return name;
    }

    public int getRadius() {
        return radius;
    }

    public int getCooldown() {
        return cooldown;
    }

    public String getProjectileType() {
        return projectileType;
    }

    public int getShotsCount() {
        return shotsCount;
    }

    public int getShotDelay() {
        return shotDelay;
    }
}
