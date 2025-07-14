package login.cloudComputing.exception;

import lombok.Getter;

@Getter
public class CustomException extends RuntimeException{
    private final Integer code;

    public CustomException(Integer code,String message) {
        super(message);
        this.code = code;
    }

    public CustomException(String message) {
        super(message);
        this.code = 500;
    }
}
