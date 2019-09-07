package net.progruzovik.dissent.exception;

public final class InvalidGunIdException extends RuntimeException {

    public InvalidGunIdException(int gunId) {
        super(String.format("Ship has no gun with id %d!", gunId));
    }
}
