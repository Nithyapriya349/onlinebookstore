<?php
// api.php
header('Content-Type: application/json');

// Initialize database
$dbFile = __DIR__ . '/bookstore.sqlite';
$needsSetup = !file_exists($dbFile);
$db = new PDO('sqlite:' . $dbFile);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if ($needsSetup) {
    // Setup tables
    $db->exec("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)");
    $db->exec("CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, author TEXT, price REAL, tag TEXT, category TEXT, image TEXT, rating REAL)");
    $db->exec("CREATE TABLE orders (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, total REAL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)");
    $db->exec("CREATE TABLE order_items (id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER, book_id INTEGER, price REAL)");
    
    // Seed user
    $db->exec("INSERT INTO users (name, email) VALUES ('Demo User', 'demo@example.com')");
    
    // Seed books
    $stmt = $db->prepare("INSERT INTO books (title, author, price, tag, category, image, rating) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $initialBooks = [
        ["The Art of Tomorrow", "Elena Vance", 45.00, "Premium", "Design", "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400", 4.8],
        ["Architectural Zen", "Sato Kenji", 32.00, "Classic", "Design", "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400", 4.5],
        ["Nodes of Logic", "Marcus Thorne", 28.50, "Bestseller", "Technology", "https://images.unsplash.com/photo-1543004629-142a26698a3a?auto=format&fit=crop&q=80&w=400", 4.7],
        ["The Silent Echo", "Sarah J. Maas", 19.99, "Popular", "Fiction", "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=400", 4.9],
        ["Design for Space", "Julian Peters", 55.00, "Limited", "Technology", "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400", 4.6],
        ["The Last Horizon", "Clara Oswald", 24.00, "Trending", "Fiction", "https://images.unsplash.com/photo-1532012197367-6849412618d1?auto=format&fit=crop&q=80&w=400", 4.4],
        ["Cybernetic Ethics", "Dr. Aris Varma", 38.00, "New", "Technology", "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=400", 4.3],
        ["Minimalist Living", "Lars Hudson", 15.50, "Classic", "Philosophy", "https://images.unsplash.com/photo-1491841260033-68d799049969?auto=format&fit=crop&q=80&w=400", 4.8],
        ["Ancient Shadows", "Yara Ben", 29.99, "Mystery", "Fiction", "https://images.unsplash.com/photo-1512588150435-401cd7eaa9c5?auto=format&fit=crop&q=80&w=400", 4.5],
        ["The Creative Act", "Rick Rubin", 42.00, "Premium", "Design", "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=400", 5.0],
        ["Stoic Calm", "Marcus Aurelius", 12.00, "Essential", "Philosophy", "https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?auto=format&fit=crop&q=80&w=400", 4.9],
        ["Beyond Reality", "S.J. Kincaid", 22.50, "Sci-Fi", "Fiction", "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=400", 4.2],
        ["The Ocean of Night", "Gregory Benford", 27.00, "Space", "Fiction", "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&q=80&w=400", 4.1],
        ["Typographic Soul", "Erik Spiekermann", 48.00, "Art", "Design", "https://images.unsplash.com/photo-1561070791-2dc269789961?auto=format&fit=crop&q=80&w=400", 4.6],
        ["The AI Revolution", "Sam Altman", 65.50, "Advanced", "Technology", "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400", 4.7],
        ["Modernist Cuisine", "Nathan Myhrvold", 120.00, "Elite", "Design", "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400", 4.9],
        ["Ego is the Enemy", "Ryan Holiday", 18.00, "Bestseller", "Philosophy", "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400", 4.8],
        ["The Hidden Forest", "Peter Wohlleben", 21.00, "Nature", "Philosophy", "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=400", 4.7],
        ["Code of the Brave", "Linus Torvalds", 35.00, "Source", "Technology", "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400", 4.5],
        ["Vintage Architecture", "Frank Wright", 72.00, "Exclusive", "Design", "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80&w=400", 4.6],
        ["Dark Matter Chronicles", "Blake Crouch", 24.50, "Thriller", "Fiction", "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=400", 4.8],
        ["The Laws of Human Nature", "Robert Greene", 31.00, "Classic", "Philosophy", "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400", 4.9]
    ];
    foreach ($initialBooks as $b) {
        $stmt->execute($b);
    }
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($action === 'books') {
    $stmt = $db->query("SELECT * FROM books");
    $books = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Ensure numeric types
    foreach($books as &$book) {
        $book['id'] = (int)$book['id'];
        $book['price'] = (float)$book['price'];
        $book['rating'] = (float)$book['rating'];
    }
    
    echo json_encode(["status" => "success", "data" => $books]);
    exit;
}

if ($action === 'checkout') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || empty($data['cart'])) {
        echo json_encode(["status" => "error", "message" => "Empty cart"]);
        exit;
    }
    
    $total = 0;
    foreach ($data['cart'] as $item) {
        $total += (float)$item['price'];
    }
    
    // Create order
    $stmt = $db->prepare("INSERT INTO orders (user_id, total) VALUES (?, ?)");
    $stmt->execute([1, $total]); // Demo user ID
    $orderId = $db->lastInsertId();
    
    // Add order items
    $stmtItem = $db->prepare("INSERT INTO order_items (order_id, book_id, price) VALUES (?, ?, ?)");
    foreach ($data['cart'] as $item) {
        $stmtItem->execute([$orderId, $item['id'], $item['price']]);
    }
    
    echo json_encode(["status" => "success", "message" => "Order processed successfully", "order_id" => $orderId]);
    exit;
}

echo json_encode(["status" => "error", "message" => "Invalid action"]);
