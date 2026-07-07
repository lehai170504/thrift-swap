package com.ecommerce.thriftauction.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) {
        log.info("Sending OTP {} to email {}", otp, to);
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Mã xác nhận quên mật khẩu - ThriftSwap");
            message.setText("Xin chào,\n\nMã xác nhận (OTP) để khôi phục mật khẩu của bạn là: " + otp
                    + "\n\nMã này sẽ hết hạn trong 15 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.\n\nTrân trọng,\nĐội ngũ ThriftSwap.");

            mailSender.send(message);
            log.info("OTP email sent successfully.");
        } catch (Exception e) {
            log.error("Failed to send OTP email. Please check your SMTP configuration. OTP is: {}", otp, e);
        }
    }
}
