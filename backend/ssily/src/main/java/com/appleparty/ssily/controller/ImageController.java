package com.appleparty.ssily.controller;

import com.appleparty.ssily.common.response.ResponseService;
import com.appleparty.ssily.common.result.Result;
import com.appleparty.ssily.common.result.SingleResult;
import com.appleparty.ssily.dto.image.ImageRequestDto;
import com.appleparty.ssily.exception.image.ImageNotFoundException;
import com.appleparty.ssily.service.ImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Base64;

@Slf4j
//@CrossOrigin(origins = {"*"})
@RestController
@RequestMapping("/image")
@RequiredArgsConstructor
public class ImageController {

    private final ResponseService responseService;
    private final ImageService imageService;

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

    @PostMapping
    public Result uploadAnswerImage(@RequestBody ImageRequestDto requestDto) {
        String name = requestDto.getName();
        String img = requestDto.getImg();

        byte[] imageArray = null;
        final String BASE_64_PREFIX = "data:image/png;base64,";

        try{
            String base64Url = img;
            if(base64Url.startsWith(BASE_64_PREFIX)){
                imageArray =  Base64.getDecoder().decode(base64Url.substring(BASE_64_PREFIX.length()));
            }
        } catch (Exception e){
            e.printStackTrace();
        }

        log.info("imageArray = {}", imageArray);
        imageService.saveAnswerImage(name, imageArray);
        return responseService.getSuccessResult();
    }
}
