//package com.tchatsouvenir.service;
//
//import io.minio.BucketExistsArgs;
//import io.minio.MakeBucketArgs;
//import io.minio.MinioClient;
//import io.minio.PutObjectArgs;
//import jakarta.annotation.PostConstruct;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//
//import java.io.InputStream;
//
//@Service
//public class MinioService {
//
//    @Value("${minio.url}")
//    private String minioUrl;
//
//    @Value("${minio.accessKey}")
//    private String accessKey;
//
//    @Value("${minio.secretKey}")
//    private String secretKey;
//
//    @Value("${minio.bucket}")
//    private String bucketName;
//
//    private MinioClient client;
//
//    @PostConstruct
//    public void init() throws Exception {
//        client = MinioClient.builder()
//                .endpoint(minioUrl)
//                .credentials(accessKey, secretKey)
//                .build();
//
//        boolean exists = client.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
//        if (!exists) {
//            client.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
//        }
//    }
//
//    public String upload(String objectName, InputStream stream, String contentType) throws Exception {
//        client.putObject(PutObjectArgs.builder()
//                .bucket(bucketName)
//                .object(objectName)
//                .stream(stream, stream.available(), -1)
//                .contentType(contentType)
//                .build());
//
//        return String.format("%s/%s/%s", minioUrl, bucketName, objectName);
//    }
//}
