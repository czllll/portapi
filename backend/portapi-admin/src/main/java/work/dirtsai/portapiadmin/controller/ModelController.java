package work.dirtsai.portapiadmin.controller;


import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import work.dirtsai.portapiadmin.model.entity.Model;
import work.dirtsai.portapiadmin.service.ModelService;

import java.util.List;

@RestController
@RequestMapping("/api/model")
public class ModelController {

    @Resource
    private ModelService modelService;

    /** 获取模型列表 */
    @GetMapping("/list")
    public List<Model> list() {
        return modelService.list();
    }
}
