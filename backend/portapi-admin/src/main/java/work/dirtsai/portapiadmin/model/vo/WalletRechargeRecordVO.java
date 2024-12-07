package work.dirtsai.portapiadmin.model.vo;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class WalletRechargeRecordVO {
    private Long id;
    private BigDecimal amount;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
    private String paymentMethod;
    private String status;
    private LocalDateTime createdAt;
}