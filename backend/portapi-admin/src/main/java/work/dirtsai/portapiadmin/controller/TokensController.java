package work.dirtsai.portapiadmin.controller;

import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;
import work.dirtsai.common.common.BaseResponse;
import work.dirtsai.common.common.UpdateQuotaRequest;
import work.dirtsai.portapiadmin.common.ErrorCode;
import work.dirtsai.portapiadmin.common.ResultUtils;
import work.dirtsai.portapiadmin.model.entity.Tokens;
import work.dirtsai.portapiadmin.model.vo.TokensVO;
import work.dirtsai.portapiadmin.service.TokensService;

import java.util.List;

@RestController
@RequestMapping("/api/tokens")
public class TokensController {

    @Resource
    private TokensService tokensService;
    /**
     * 新增令牌
     * @param tokensVO 令牌
     */
    @PostMapping("/create")
    public BaseResponse<Boolean> save(@RequestBody TokensVO tokensVO) {

        try {
            return ResultUtils.success(tokensService.createTokens(tokensVO));
        } catch (Exception e) {
            return (BaseResponse<Boolean>) ResultUtils.error(ErrorCode.OPERATION_ERROR.getCode(), e.getMessage());
        }
    }

    /**
     * 逻辑删除
     * @param id
     * @return
     */
    @PutMapping("/{id}/delete")
    public BaseResponse<Boolean> deleteUser(@PathVariable Long id) {
        boolean result = tokensService.deleteTokensById(id);
        return ResultUtils.success(result);
    }


    /**
     * 修改令牌
     * @param tokens 令牌
     */
    @PutMapping("/{id}")
    public BaseResponse<Boolean> update(@RequestBody TokensVO tokens) {
        // 修改令牌
        try {
            return ResultUtils.success(tokensService.updateTokens(tokens));
        } catch (Exception e) {
            return (BaseResponse<Boolean>) ResultUtils.error(ErrorCode.OPERATION_ERROR.getCode(), e.getMessage());
        }

    }

    /**
     * 获取令牌
     *
     * @param id 令牌id
     * @return 令牌
     */
    @GetMapping("/{id}")
    public Tokens get(@PathVariable Long id) {
        // 获取令牌
        return tokensService.getById(id);
    }

    /**
     * 分页查询令牌
     * @param currentPage 当前页
     * @param pageSize 每页数量
     */
    @GetMapping("/page")
    public BaseResponse<List<TokensVO>> page(
            @RequestParam (defaultValue = "1") Integer currentPage,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam Integer userId) {
        // 分页查询令牌
        List<TokensVO> tokensList = tokensService.getTokensList(currentPage, pageSize, userId);
        return ResultUtils.success(tokensList);
    }

    /**
     * 更新令牌状态
     * @param id 令牌 id
     */
    @PutMapping("/{id}/status")
    public BaseResponse<Boolean> updateTokensStatus(
            @PathVariable Long id,
            @RequestParam Integer status
    ) {
        boolean result = tokensService.updateTokensStatus(id, status);
        return ResultUtils.success(result);
    }

    /**
     * 更新令牌配额
     * @param updateQuotaRequest 更新配额请求
     *                           tokenNumber 令牌编号
     *                           consumedQuota 消耗配额
     */
    @PutMapping("/quota")
    public BaseResponse<Boolean> updateTokensQuota(@RequestBody UpdateQuotaRequest updateQuotaRequest) {
        String tokenNumber = updateQuotaRequest.getTokenNumber();
        Integer consumeQuota = updateQuotaRequest.getConsumedQuota();
        boolean result = tokensService.updateTokensQuato(tokenNumber, consumeQuota);
        return ResultUtils.success(result);
    }


}
