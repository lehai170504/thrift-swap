import os

base_dir = "d:/GitHub/E-commercial/backend/src/main/java/com/ecommerce/thriftauction"

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith(".java"):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Replace ID types in Entities & DTOs
            content = content.replace("private Long id;", "private String id;")
            content = content.replace("@GeneratedValue(strategy = GenerationType.IDENTITY)", "@GeneratedValue(strategy = GenerationType.UUID)")
            
            # Repositories
            content = content.replace("JpaRepository<User, Long>", "JpaRepository<User, String>")
            content = content.replace("JpaRepository<Wallet, Long>", "JpaRepository<Wallet, String>")
            content = content.replace("JpaRepository<Category, Long>", "JpaRepository<Category, String>")
            content = content.replace("JpaRepository<Product, Long>", "JpaRepository<Product, String>")
            content = content.replace("JpaRepository<AuctionSession, Long>", "JpaRepository<AuctionSession, String>")
            content = content.replace("JpaRepository<Order, Long>", "JpaRepository<Order, String>")
            
            # Custom Repo methods
            content = content.replace("findBySellerId(Long sellerId)", "findBySellerId(String sellerId)")
            content = content.replace("findByCategoryId(Long categoryId)", "findByCategoryId(String categoryId)")
            
            # DTOs
            content = content.replace("private Long parentId;", "private String parentId;")
            content = content.replace("private Long categoryId;", "private String categoryId;")
            content = content.replace("private Long sellerId;", "private String sellerId;")
            
            # Services
            content = content.replace("getProductById(Long id)", "getProductById(String id)")
            
            # Controllers
            content = content.replace("@PathVariable Long id", "@PathVariable String id")
            
            if content != original_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated {filepath}")

print("Replacement complete")
