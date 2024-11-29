package work.dirtsai.portapiadmin.service;

public interface TokenService {
    String createToken(Long userId);


    /**
     * 解密token
     * @param token
     */
    Long parseToken(String token);

}
