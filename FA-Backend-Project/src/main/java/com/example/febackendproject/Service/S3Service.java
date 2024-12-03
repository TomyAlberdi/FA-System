package com.example.febackendproject.Service;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PreDestroy;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.net.URL;
import java.time.Duration;

@Service
public class S3Service {

    private final S3Presigner presigner;
    private final Dotenv dotenv;
    
    public S3Service() {
        this.dotenv = Dotenv.load();
        this.presigner = S3Presigner.builder()
                .region(Region.SA_EAST_1)
                .credentialsProvider(
                        StaticCredentialsProvider.create(
                                AwsBasicCredentials.create(dotenv.get("ACCESS_KEY_ID"),dotenv.get("SECRET_ACCESS_KEY"))))
                .build();
    }
    
    public URL generatePresignedUrl(String bucket, String key) {
        
        if (bucket == null || bucket.isEmpty() || key == null || key.isEmpty()) {
            throw new IllegalArgumentException("Bucket and key must not be null or empty.");
        }
        
        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();
        
        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(5))
                .putObjectRequest(objectRequest)
                .build();
        
        return presigner.presignPutObject(presignRequest).url();
    }
    
    @PreDestroy
    public void close() {
        presigner.close();
    }

}
