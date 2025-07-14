package login.cloudComputing.exception;

import login.cloudComputing.common.result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    @ResponseBody
    public result<?> exceptionHandler(){
        return result.error();
    }

    @ExceptionHandler(CustomException.class)
    @ResponseBody
    public result<?> CustomExceptionHandler(CustomException e){
        log.error("error：{}", e.getMessage());
        return result.error(e.getCode(),e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseBody
    public result<?> MethodArgumentNotValidExceptionHandler(MethodArgumentNotValidException e){
        List<FieldError> fieldErrors = e.getBindingResult().getFieldErrors();
        String message = fieldErrors.get(0).getDefaultMessage();
        log.error("error: {}", message);
        return result.error(message);
    }
}

