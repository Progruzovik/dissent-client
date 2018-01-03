package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.battle.model.Battle;
import net.progruzovik.dissent.battle.model.Side;
import net.progruzovik.dissent.battle.model.UnitQueue;
import net.progruzovik.dissent.battle.model.field.Field;
import net.progruzovik.dissent.captain.Captain;
import net.progruzovik.dissent.model.util.Cell;
import org.springframework.stereotype.Service;

import static net.progruzovik.dissent.battle.model.field.Field.BORDER_INDENT;
import static net.progruzovik.dissent.battle.model.field.Field.UNIT_INDENT;

@Service
public class BattleCreationService implements BattleCreator {

    @Override
    public void createBattle(Captain leftCaptain, Captain rightCaptain) {
        final int maxShipsCountOnSide = Math.max(leftCaptain.getShips().size(), rightCaptain.getShips().size());
        final int colsCount = maxShipsCountOnSide * UNIT_INDENT + BORDER_INDENT * 2;
        final Battle battle = new Battle(leftCaptain, rightCaptain,
                new UnitQueue(), new Field(new Cell(colsCount, colsCount)));
        leftCaptain.addToBattle(Side.LEFT, battle);
        rightCaptain.addToBattle(Side.RIGHT, battle);
        battle.startBattle();
    }
}
