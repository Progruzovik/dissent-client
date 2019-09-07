package net.progruzovik.dissent.exception

class GunNotFoundException(gunId: Int) : AbstractBattleException("Ship has no gun with id = $gunId")
