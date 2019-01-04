package net.progruzovik.dissent.battle;

import net.progruzovik.dissent.battle.model.Battle;
import net.progruzovik.dissent.battle.model.Side;
import net.progruzovik.dissent.battle.model.UnitQueue;
import net.progruzovik.dissent.battle.model.field.Field;
import net.progruzovik.dissent.battle.model.util.Cell;
import net.progruzovik.dissent.captain.Captain;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

@Service
public class BattleCreationService implements BattleCreator {

    @Override
    public void createBattle(@NonNull Captain leftCaptain, @NonNull Captain rightCaptain) {
        final int maxShipsOnSide = Math.max(leftCaptain.getShips().size(), rightCaptain.getShips().size());
        final int rowsCount = maxShipsOnSide + (maxShipsOnSide - 1) * Field.UNIT_INDENT + Field.BORDER_INDENT * 2;
        final Battle battle = new Battle(leftCaptain.getId(), rightCaptain.getId(),
                new UnitQueue(), new Field(new Cell((int) (rowsCount * 1.5), rowsCount)));
        leftCaptain.addToBattle(Side.LEFT, battle);
        rightCaptain.addToBattle(Side.RIGHT, battle);
        battle.startBattle();
    }
}
