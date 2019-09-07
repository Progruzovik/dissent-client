package net.progruzovik.dissent.exception

class NotEnoughActionPointsException(actualActionPoints: Int, requiredActionPoints: Int) :
    AbstractBattleException("Not enough AP ($actualActionPoints/$requiredActionPoints)")
