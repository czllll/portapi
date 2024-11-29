package work.dirtsai.portapiadmin.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import work.dirtsai.portapiadmin.common.BaseResponse;
import work.dirtsai.portapiadmin.common.ErrorCode;
import work.dirtsai.portapiadmin.common.ResultUtils;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public BaseResponse<?> businessExceptionHandler(BusinessException e) {
        log.error("BusinessException", e);
        return ResultUtils.error(e.getCode(), e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public BaseResponse<?> methodArgumentNotValidExceptionHandler(MethodArgumentNotValidException e) {
        log.error("MethodArgumentNotValidException", e);
        return ResultUtils.error(ErrorCode.PARAMS_ERROR.getCode(), e.getBindingResult().getAllErrors().get(0).getDefaultMessage());
    }
}