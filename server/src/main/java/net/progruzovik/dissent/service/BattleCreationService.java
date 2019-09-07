package net.progruzovik.dissent.service;

import net.progruzovik.dissent.model.domain.battle.Battle;
import net.progruzovik.dissent.model.domain.battle.Side;
import net.progruzovik.dissent.model.domain.battle.UnitQueue;
import net.progruzovik.dissent.model.domain.battle.field.Field;
import net.progruzovik.dissent.model.domain.util.Cell;
import net.progruzovik.dissent.captain.Captain;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

@Service
public class BattleCreationService implements BattleCreator {

    @Override
    public void createBattle(@NonNull Captain leftCaptain, @NonNull Captain rightCaptain) {
        int maxShipsOnSide = Math.max(leftCaptain.getShips().size(), rightCaptain.getShips().size());
        int rowsCount = maxShipsOnSide + (maxShipsOnSide - 1) * Field.UNIT_INDENT + Field.BORDER_INDENT * 2;
        Field field = new Field(new Cell((int) (rowsCount * 1.5), rowsCount));
        Battle battle = new Battle(new UnitQueue(), field, leftCaptain, rightCaptain);
        leftCaptain.addToBattle(battle, Side.LEFT);
        rightCaptain.addToBattle(battle, Side.RIGHT);
        battle.startBattle();
    }
}
