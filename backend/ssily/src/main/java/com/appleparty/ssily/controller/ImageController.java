package com.appleparty.ssily.controller;

import com.appleparty.ssily.common.response.ResponseService;
import com.appleparty.ssily.common.result.Result;
import com.appleparty.ssily.common.result.SingleResult;
import com.appleparty.ssily.dto.image.ImageRequestDto;
import com.appleparty.ssily.exception.image.ImageNotFoundException;
import com.appleparty.ssily.service.ImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.Base64Utils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.Base64;

@Slf4j
@CrossOrigin(origins = {"*"})
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

        byte[] bytes = multipartFile.getBytes();
        imageService.saveAnswerImage(sessionId, bytes);
        return responseService.getSingleResult(sessionId);
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

    @GetMapping("{name}")
    public SingleResult<String> findImage(@PathVariable("name") String name){
        Blob blob = imageService.findImage(name);
        byte[] arr = blobToBytes(blob);

        if(arr != null && arr.length > 0){
            String base64Encode = byteToBase64(arr);
            base64Encode = "data:image/png;base64," + base64Encode;
            return responseService.getSingleResult(base64Encode);
        }

        throw new ImageNotFoundException();
    }

    // blob 데이터를 바이트로 변환
    private byte[] blobToBytes(Blob blob){
        BufferedInputStream br = null;
        byte[] bytes = null;

        try{
            br = new BufferedInputStream(blob.getBinaryStream());
            bytes = new byte[(int) blob.length()];
            int len = bytes.length;
            int offset = 0;
            int read = 0;

            while(offset < len &&
                    (read = br.read(bytes, offset, len-offset)) >= 0){
                offset += read;
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return bytes;
    }

    // byte를 base64로 인코딩
    private String byteToBase64(byte[] arr){
        String result = "";
        try {
            result = Base64Utils.encodeToString(arr);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }
}
