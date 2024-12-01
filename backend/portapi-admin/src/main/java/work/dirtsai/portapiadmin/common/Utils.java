package work.dirtsai.portapiadmin.common;

import jakarta.annotation.Resource;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.Base64;

@Component
public class Utils {

    /**
     * 生成随机key
     * @return
     */
    public String generateKey() {
        byte[] bytes = new byte[32];
        SecureRandom secureRandom = new SecureRandom();
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

}
