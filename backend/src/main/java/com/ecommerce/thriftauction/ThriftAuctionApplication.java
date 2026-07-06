package com.ecommerce.thriftauction;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.ecommerce.thriftauction.entity.Category;
import com.ecommerce.thriftauction.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

import java.util.UUID;

@SpringBootApplication
public class ThriftAuctionApplication {

	public static void main(String[] args) {
		SpringApplication.run(ThriftAuctionApplication.class, args);
	}

	@Bean
	public CommandLineRunner dataSeeder(CategoryRepository categoryRepository,
			com.ecommerce.thriftauction.repository.UserRepository userRepository,
			org.springframework.security.crypto.password.PasswordEncoder passwordEncoder,
			com.ecommerce.thriftauction.repository.WalletRepository walletRepository) {
		return args -> {
			if (categoryRepository.count() == 0) {
				categoryRepository.save(Category.builder().id(UUID.randomUUID().toString()).name("Điện tử")
						.description("Đồ công nghệ, điện thoại, máy tính").icon("Laptop").build());
				categoryRepository.save(Category.builder().id(UUID.randomUUID().toString()).name("Thời trang")
						.description("Quần áo, túi xách, giày dép").icon("Shirt").build());
				categoryRepository.save(Category.builder().id(UUID.randomUUID().toString()).name("Nội thất")
						.description("Bàn ghế, tủ giường").icon("Sofa").build());
				categoryRepository.save(Category.builder().id(UUID.randomUUID().toString()).name("Sách truyện")
						.description("Sách, tiểu thuyết, truyện tranh").icon("BookOpen").build());
			}

			if (categoryRepository.count() <= 4) {
				categoryRepository.save(Category.builder().id(UUID.randomUUID().toString()).name("Đồ gia dụng")
						.description("Tủ lạnh, máy giặt, đồ bếp").icon("Coffee").build());
				categoryRepository.save(Category.builder().id(UUID.randomUUID().toString()).name("Thể thao")
						.description("Đồ tập, dụng cụ thể thao").icon("Dumbbell").build());
				categoryRepository.save(Category.builder().id(UUID.randomUUID().toString()).name("Xe cộ")
						.description("Xe máy, xe đạp, phụ kiện").icon("Car").build());
				categoryRepository.save(Category.builder().id(UUID.randomUUID().toString()).name("Đồ sưu tầm")
						.description("Đồ cổ, tem, mô hình").icon("Gem").build());
				categoryRepository.save(Category.builder().id(UUID.randomUUID().toString()).name("Mẹ & Bé")
						.description("Đồ chơi, đồ dùng cho bé").icon("Baby").build());
				categoryRepository.save(Category.builder().id(UUID.randomUUID().toString()).name("Thú cưng")
						.description("Thức ăn, phụ kiện thú cưng").icon("Cat").build());
			}

			if (!userRepository.findByEmail("admin@thrift.com").isPresent()) {
				com.ecommerce.thriftauction.entity.User admin = com.ecommerce.thriftauction.entity.User.builder()
						.username("admin")
						.email("admin@thrift.com")
						.password(passwordEncoder.encode("123456"))
						.role(com.ecommerce.thriftauction.entity.Role.ADMIN)
						.isActive(true)
						.build();
				userRepository.save(admin);

				com.ecommerce.thriftauction.entity.Wallet wallet = com.ecommerce.thriftauction.entity.Wallet.builder()
						.user(admin)
						.balance(java.math.BigDecimal.ZERO)
						.heldBalance(java.math.BigDecimal.ZERO)
						.build();
				walletRepository.save(wallet);
			}
		};
	}
}
