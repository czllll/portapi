package work.dirtsai.portapiadmin.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import work.dirtsai.portapiadmin.common.SecurityUtils;
import work.dirtsai.portapiadmin.model.dto.TopUpRequestDTO;
import work.dirtsai.portapiadmin.model.dto.TopUpResponseDTO;
import work.dirtsai.portapiadmin.model.entity.WalletRechargeRecord;
import work.dirtsai.portapiadmin.model.vo.WalletRechargeRecordVO;
import work.dirtsai.portapiadmin.service.WalletService;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {
    private final WalletService walletService;
    private final SecurityUtils securityUtils;

    @GetMapping("/balance")
    public ResponseEntity<Map<String, BigDecimal>> getBalance() {
        Long userId = securityUtils.getCurrentUserId();
        BigDecimal balance = walletService.getBalance(userId);
        return ResponseEntity.ok(Map.of("balance", balance));
    }

    @PostMapping("/topup")
    public ResponseEntity<TopUpResponseDTO> topUp(@Valid @RequestBody TopUpRequestDTO request) {
        TopUpResponseDTO response = new TopUpResponseDTO();
        try {
            Long userId = securityUtils.getCurrentUserId();
            WalletRechargeRecord record = walletService.topUp(userId, request.getAmount(), request.getPromoCode());

            // 创建并转换为VO
            WalletRechargeRecordVO recordVO = new WalletRechargeRecordVO();
            BeanUtils.copyProperties(record, recordVO);

            response.setSuccess(true);
            response.setMessage("充值成功");
            response.setRecord(recordVO);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.setSuccess(false);
            response.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    @GetMapping("/records")
    public ResponseEntity<Page<WalletRechargeRecord>> getRechargeRecords(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Long userId = securityUtils.getCurrentUserId();
        Page<WalletRechargeRecord> records = (Page<WalletRechargeRecord>) walletService.getRechargeRecords(userId, page, size);
        return ResponseEntity.ok(records);
    }

//    @GetMapping("/export")
//    public ResponseEntity<Resource> exportRechargeRecords() {
//        Long userId = securityUtils.getCurrentUserId();
//        try {
//            Resource file = walletService.exportRechargeRecords(userId);
//            return ResponseEntity.ok()
//                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=recharge-records.csv")
//                    .contentType(MediaType.parseMediaType("text/csv"))
//                    .body(file);
//        } catch (IOException e) {
//            return ResponseEntity.internalServerError().build();
//        }
//    }
}