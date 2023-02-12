package com.appleparty.ssily.service;

import com.appleparty.ssily.domain.image.Image;
import com.appleparty.ssily.exception.image.ImageNotFoundException;
import com.appleparty.ssily.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.engine.jdbc.BlobProxy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Blob;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ImageService {

    private final ImageRepository imageRepository;

    @Transactional
    public void saveAnswerImage(String name, byte[] img) {
        Optional<Image> optionalImage = imageRepository.findByName(name);

        if(optionalImage.isPresent()){
            Image image = optionalImage.get();
            image.updateImg(BlobProxy.generateProxy(img));
        }
        else{
            Image image = Image.builder()
                    .name(name)
                    .img(BlobProxy.generateProxy(img))
                    .build();

            imageRepository.save(image);
        }
    }

    public Blob findImage(String name){
        Image image = imageRepository.findByName(name).orElseThrow(ImageNotFoundException::new);
        return image.getImg();
    }
}
