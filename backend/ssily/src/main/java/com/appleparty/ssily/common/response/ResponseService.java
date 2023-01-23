package com.appleparty.ssily.common.response;

import com.appleparty.ssily.common.result.ListResult;
import com.appleparty.ssily.common.result.Result;
import com.appleparty.ssily.common.result.SingleResult;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ResponseService {

    private static final String SUCCESS_MESSAGE = "success";

    public Result getDefaultSuccessResult() {
        return getSuccessResult();
    }

    public <T> SingleResult<T> getSingleResult(T data) {
        SingleResult<T> result = new SingleResult<>();
        setSuccessResult(result);
        result.setData(data);

        return result;
    }

    public <T>ListResult<T> getListResult(List<T> data){
        ListResult<T> result = new ListResult<>();
        setSuccessResult(result);
        result.setData(data);

        return result;
    }

    public Result getSuccessResult() {
        Result result = new Result();
        result.setMessage(SUCCESS_MESSAGE);

        return result;
    }

    public void setSuccessResult(Result result) {
        result.setMessage(SUCCESS_MESSAGE);
    }

    public Result getFailureResult(String message){
        Result result = new Result();
        result.setMessage(message);

        return result;
    }
}
