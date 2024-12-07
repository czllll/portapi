package work.dirtsai.portapiadmin.model.dto;

import lombok.Data;
import work.dirtsai.portapiadmin.model.vo.WalletRechargeRecordVO;

@Data
public class TopUpResponseDTO {
    private Boolean success;
    private String message;
    private WalletRechargeRecordVO record;
}