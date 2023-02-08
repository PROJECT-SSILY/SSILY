package com.appleparty.ssily.controller;

import com.appleparty.ssily.common.response.ResponseService;
import com.appleparty.ssily.common.result.SingleResult;
import com.appleparty.ssily.exception.image.ImageNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Slf4j
//@CrossOrigin(origins = {"*"})
@RestController
@RequestMapping("/image")
@RequiredArgsConstructor
public class ImageController {

    private final ResponseService responseService;

    @PostMapping("/upload")
    public SingleResult<String> uploadAnswerImage(@RequestParam(value = "answerImage", required = false) MultipartFile multipartFile,
                                                  @RequestParam("sessionId") String sessionId) throws IOException {
        if(multipartFile == null || multipartFile.isEmpty()) throw new ImageNotFoundException();

        String separator = File.separator;
        String absolutePath = new File("").getAbsolutePath() + separator + separator;

        String path = "src/main/resources/static/images";
        File file = new File(path);

        if(!file.exists()) file.mkdirs();

        String fileName = sessionId + ".png";
        file = new File(absolutePath + path + separator + fileName);
        multipartFile.transferTo(file);

        return responseService.getSingleResult(fileName);
    }
}
