package work.dirtsai.backend.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;
import work.dirtsai.backend.model.entity.ApiInfo;
import work.dirtsai.backend.service.ApiInfoService;

@RestController
@RequestMapping("/api/api-info")
public class ApiInfoController {

    @Resource
    private ApiInfoService apiInfoService;

    @PostMapping
    public boolean save(@RequestBody ApiInfo apiInfo) {
        return apiInfoService.save(apiInfo);
    }

    @DeleteMapping("/{id}")
    public boolean delete(@PathVariable Integer id) {
        return apiInfoService.removeById(id);
    }

    @PutMapping
    public boolean update(@RequestBody ApiInfo apiInfo) {
        return apiInfoService.updateById(apiInfo);
    }

    @GetMapping("/{id}")
    public ApiInfo getById(@PathVariable Integer id) {
        return apiInfoService.getById(id);
    }

    @GetMapping("/page")
    public Page<ApiInfo> page(@RequestParam(defaultValue = "1") Integer current,
                              @RequestParam(defaultValue = "10") Integer size) {
        return apiInfoService.page(new Page<>(current, size));
    }
}