package work.dirtsai.portapiadmin.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import work.dirtsai.portapiadmin.model.entity.ModelTemplate;
import work.dirtsai.portapiadmin.service.ModelTemplateService;

import java.util.List;

@RestController
@RequestMapping("/api/model-template")
@RequiredArgsConstructor
public class ModelTemplateController {

    private final ModelTemplateService modelTemplateService;

    @GetMapping("/list")
    public List<ModelTemplate> listTemplates() {
        return modelTemplateService.list();
    }
}